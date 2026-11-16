import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

function getAiClient(apiVersion?: string): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      ...(apiVersion ? { apiVersion } : {}),
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Simple in-memory cache for TTS audio clips
const ttsCache = new Map<string, string>();
const MAX_TTS_CACHE = 180;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

app.post('/api/tts', async (req, res) => {
  try {
    const { text, slow = false } = req.body as { text?: string; slow?: boolean };
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    const cleanText = text.trim().slice(0, 600);
    const cacheKey = `${slow ? 'slow' : 'norm'}:${cleanText}`;
    const cached = ttsCache.get(cacheKey);
    if (cached) {
      return res.json({ audioBase64: cached, mimeType: 'audio/wav', cached: true });
    }

    const ai = getAiClient('v1beta');
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        fallback: true,
      });
    }

    const stylePrompt = slow
      ? 'Speak slowly, very clearly, and warmly like an Arabic teacher pronouncing every harakat carefully for beginner junior high students.'
      : 'Speak clearly, warmly, and naturally like a friendly Arabic teacher for beginner junior high students.';

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanText,
                speechMetadata: {
                  style: stylePrompt,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
    } catch (primaryErr) {
      console.warn('TTS primary attempt failed, retrying without speechMetadata:', primaryErr);
      const fallbackAi = getAiClient('v1beta') ?? ai;
      response = await fallbackAi.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: slow
                  ? `Read this Arabic text slowly and clearly: ${cleanText}`
                  : `Read this Arabic text clearly: ${cleanText}`,
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
    }

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(502).json({ error: 'No audio returned from TTS model.', fallback: true });
    }

    if (ttsCache.size >= MAX_TTS_CACHE) {
      const firstKey = ttsCache.keys().next().value;
      if (firstKey) ttsCache.delete(firstKey);
    }
    ttsCache.set(cacheKey, base64Audio);

    return res.json({ audioBase64: base64Audio, mimeType: 'audio/wav', cached: false });
  } catch (error) {
    console.error('TTS error:', error);
    return res.status(500).json({
      error: 'Gagal menghasilkan audio pelafalan.',
      fallback: true,
    });
  }
});

app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body as { audioBase64?: string; mimeType?: string };
    if (!audioBase64 || !mimeType) {
      return res.status(400).json({ error: 'Audio data and mimeType are required.' });
    }

    const ai = getAiClient('v1beta');
    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: audioBase64,
            },
          },
          {
            text: 'Transcribe the student spoken Arabic phrase accurately into Arabic script with harakat if clear. Return only the Arabic transcription text without extra commentary.',
          },
        ],
      },
    });

    const transcript = (response.text ?? '').trim();
    return res.json({ transcript });
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({ error: 'Gagal mengenali suara. Silakan coba lagi atau ketik jawaban.' });
  }
});

const DARS_DIALOGUE_GUIDES: Record<
  number,
  {
    topic: string;
    turns: Array<{ aiQuestion: string; expectedFocus: string; sampleAnswer: string }>;
  }
> = {
  1: {
    topic: 'التَّعَارُفُ (Perkenalan diri dalam Bahasa Arab sederhana)',
    turns: [
      {
        aiQuestion: 'السَّلَامُ عَلَيْكُمْ! كَيْفَ حَالُكَ؟',
        expectedFocus: 'Menjawab salam (وَعَلَيْكُمُ السَّلَامُ) dan/atau kabar (بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ)',
        sampleAnswer: 'وَعَلَيْكُمُ السَّلَامُ، أَنَا بِخَيْرٍ وَالْحَمْدُ لِلَّهِ.',
      },
      {
        aiQuestion: 'مَا اسْمُكَ؟',
        expectedFocus: 'Menyebutkan nama dengan اِسْمِي ... atau أَنَا ...',
        sampleAnswer: 'اِسْمِي أَحْمَدُ.',
      },
      {
        aiQuestion: 'مِنْ أَيْنَ أَنْتَ؟',
        expectedFocus: 'Menyebutkan asal daerah dengan أَنَا مِنْ ...',
        sampleAnswer: 'أَنَا مِنْ سُورَابَايَا.',
      },
      {
        aiQuestion: 'فِي أَيِّ صَفٍّ أَنْتَ؟',
        expectedFocus: 'Menyebutkan kelas 7 dengan أَنَا فِي الصَّفِّ السَّابِعِ',
        sampleAnswer: 'أَنَا فِي الصَّفِّ السَّابِعِ.',
      },
    ],
  },
  2: {
    topic: 'الأَدَوَاتُ الْمَدْرَسِيَّةُ (Peralatan Sekolah dan Isim Isyarah هَذَا / هَذِهِ)',
    turns: [
      {
        aiQuestion: 'أَهْلًا! مَاذَا فِي حَقِيبَتِكَ؟',
        expectedFocus: 'Menyebutkan minimal satu peralatan sekolah dengan فِي حَقِيبَتِي ... (misal: كِتَابٌ، قَلَمٌ، دَفْتَرٌ)',
        sampleAnswer: 'فِي حَقِيبَتِي كِتَابٌ وَقَلَمٌ.',
      },
      {
        aiQuestion: 'مَا هَذَا؟ (تَخَيَّلْ أَنَّهُ كِتَابٌ أَوْ قَلَمٌ)',
        expectedFocus: 'Menjawab menggunakan هَذَا + benda mudzakkar (هَذَا كِتَابٌ / هَذَا قَلَمٌ / هَذَا دَفْتَرٌ)',
        sampleAnswer: 'هَذَا كِتَابٌ.',
      },
      {
        aiQuestion: 'وَمَا هَذِهِ؟ (تَخَيَّلْ أَنَّهَا مِسْطَرَةٌ أَوْ حَقِيبَةٌ)',
        expectedFocus: 'Menjawab menggunakan هَذِهِ + benda muannats (هَذِهِ مِسْطَرَةٌ / هَذِهِ حَقِيبَةٌ / هَذِهِ مِمْحَاةٌ)',
        sampleAnswer: 'هَذِهِ مِسْطَرَةٌ.',
      },
      {
        aiQuestion: 'هَلْ عِنْدَكَ قَلَمٌ وَدَفْتَرٌ؟',
        expectedFocus: 'Menjawab نَعَمْ، عِنْدِي قَلَمٌ وَدَفْتَرٌ atau serupa',
        sampleAnswer: 'نَعَمْ، عِنْدِي قَلَمٌ وَدَفْتَرٌ.',
      },
    ],
  },
  3: {
    topic: 'يَوْمِيَّاتُنَا (Kegiatan Sehari-hari dari Pagi sampai Malam)',
    turns: [
      {
        aiQuestion: 'مَتَى تَسْتَيْقِظُ فِي الصَّبَاحِ؟',
        expectedFocus: 'Menjawab menggunakan أَسْتَيْقِظُ فِي السَّاعَةِ ... (misalnya الْخَامِسَةِ / الرَّابِعَةِ)',
        sampleAnswer: 'أَسْتَيْقِظُ فِي السَّاعَةِ الْخَامِسَةِ صَبَاحًا.',
      },
      {
        aiQuestion: 'مَاذَا تَفْعَلُ فِي الصَّبَاحِ قَبْلَ الْمَدْرَسَةِ؟',
        expectedFocus: 'Menyebutkan kegiatan pagi seperti أَغْتَسِلُ atau أَتَنَاوَلُ الْفَطُورَ',
        sampleAnswer: 'أَغْتَسِلُ وَأَتَنَاوَلُ الْفَطُورَ.',
      },
      {
        aiQuestion: 'إِلَى أَيْنَ تَذْهَبُ فِي الصَّبَاحِ؟',
        expectedFocus: 'Menjawab أَذْهَبُ إِلَى الْمَدْرَسَةِ',
        sampleAnswer: 'أَذْهَبُ إِلَى الْمَدْرَسَةِ.',
      },
      {
        aiQuestion: 'مَاذَا تَفْعَلُ فِي الْمَسَاءِ؟',
        expectedFocus: 'Menyebutkan kegiatan malam seperti أَقْرَأُ الْكِتَابَ، أَدْرُسُ، atau أَنَامُ',
        sampleAnswer: 'أَقْرَأُ الْكِتَابَ ثُمَّ أَنَامُ.',
      },
    ],
  },
};

app.post('/api/kalam/chat', async (req, res) => {
  try {
    const {
      darsId,
      turnIndex = 0,
      userText,
      history = [],
    } = req.body as {
      darsId?: number;
      turnIndex?: number;
      userText?: string;
      history?: Array<{ role: 'ai' | 'student'; text: string }>;
    };

    if (!darsId || !DARS_DIALOGUE_GUIDES[darsId]) {
      return res.status(400).json({ error: 'Dars ID tidak valid.' });
    }
    if (!userText || typeof userText !== 'string' || !userText.trim()) {
      return res.status(400).json({ error: 'Silakan ucapkan atau ketik jawaban terlebih dahulu.' });
    }

    const guide = DARS_DIALOGUE_GUIDES[darsId];
    const currentTurn = guide.turns[Math.min(turnIndex, guide.turns.length - 1)];
    const nextTurn = guide.turns[turnIndex + 1];

    const ai = getAiClient('v1beta');
    if (!ai) {
      return res.status(503).json({
        error: 'Layanan guru AI memerlukan GEMINI_API_KEY di panel Secrets.',
      });
    }

    const systemInstruction = `Kamu adalah Ustadz/Ustadzah Bahasa Arab yang sangat ramah, sabar, dan penyayang untuk siswa Kelas VII Madrasah Tsanawiyah (MTs) dengan kemampuan awal (LOW).
Topik Dars ${darsId}: ${guide.topic}.

Aturan PENTING:
1. Semua teks Bahasa Arab WAJIB menggunakan harakat lengkap (fathah, kasrah, dhammah, sukun, syaddah) agar mudah dibaca siswa pemula.
2. Gunakan kalimat Bahasa Arab yang sangat pendek, sederhana, dan ramah anak.
3. Siswa menjawab melalui mikrofon (Speech-to-Text) atau ketikan manual, sehingga mungkin tidak ada harakat pada input siswa atau ada sedikit kesalahan ejaan nama kota/orang dari pengenalan suara—bersikaplah toleran terhadap variasi transkripsi yang masuk akal, tetapi tetap beri koreksi lembut jika makna atau struktur kalimatnya melenceng dari pertanyaan.
4. Pilih indicator TEPAT salah satu dari tiga nilai ini:
   - "نَاطِقٌ جَيِّدٌ" (jika jawaban sangat bagus, jelas, lengkap, dan sesuai konteks)
   - "إِجَابَةٌ صَحِيحَةٌ" (jika jawaban benar dan dapat dipahami dengan baik)
   - "حَاوِلْ مَرَّةً أُخْرَى" (jika jawaban kurang tepat, kosong makna, masih pakai bahasa Indonesia penuh, atau tidak menjawab pertanyaan)
5. Jika indicator adalah "حَاوِلْ مَرَّةً أُخْرَى":
   - Set isCorrect = false
   - Beri dorongan semangat dalam Bahasa Arab sederhana dan jelaskan perbaikannya dalam Bahasa Indonesia yang lembut.
   - Berikan contoh jawaban benar pada exampleAnswer.
   - Pertanyaan selanjutnya (nextQuestionArabic) tetap mengulang pertanyaan saat ini agar siswa bisa mencoba lagi.
6. Jika indicator adalah "نَاطِقٌ جَيِّدٌ" atau "إِجَابَةٌ صَحِيحَةٌ":
   - Set isCorrect = true
   - Beri pujian singkat dalam Bahasa Arab berharakat (misalnya: مُمْتَازٌ! أَحْسَنْتَ!).
   - Jika masih ada giliran berikutnya, lanjutkan dengan pertanyaan berikutnya secara alami. Jika sudah giliran terakhir, berikan ucapan selamat penutup percakapan dalam Bahasa Arab berharakat.`;

    const prompt = `Pertanyaan yang baru ditanyakan kepada siswa: "${currentTurn.aiQuestion}"
Fokus jawaban yang diharapkan: ${currentTurn.expectedFocus}
Contoh jawaban benar: "${currentTurn.sampleAnswer}"
Riwayat percakapan singkat: ${JSON.stringify(history.slice(-6))}
Jawaban siswa saat ini: "${userText.trim()}"
Apakah ini giliran terakhir? ${!nextTurn ? 'Ya (giliran ke-4 dari 4)' : `Tidak (giliran ke-${turnIndex + 1} dari ${guide.turns.length}, pertanyaan berikutnya yang disarankan: "${nextTurn.aiQuestion}")`}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            indicator: {
              type: Type.STRING,
              enum: ['نَاطِقٌ جَيِّدٌ', 'إِجَابَةٌ صَحِيحَةٌ', 'حَاوِلْ مَرَّةً أُخْرَى'],
            },
            isCorrect: { type: Type.BOOLEAN },
            aiReplyArabic: {
              type: Type.STRING,
              description: 'Respons pendek pujian atau dorongan dalam Bahasa Arab berharakat lengkap.',
            },
            aiReplyIndo: {
              type: Type.STRING,
              description: 'Penjelasan singkat dan ramah dalam Bahasa Indonesia tentang jawaban siswa.',
            },
            pronunciationFeedback: {
              type: Type.STRING,
              description: 'Saran pengucapan atau ketepatan kosakata singkat dalam Bahasa Indonesia.',
            },
            exampleAnswer: {
              type: Type.STRING,
              description: 'Contoh jawaban benar dalam Bahasa Arab berharakat lengkap.',
            },
            nextQuestionArabic: {
              type: Type.STRING,
              description: 'Pertanyaan lanjutan sederhana dalam Bahasa Arab berharakat lengkap, atau ucapan penutup jika selesai.',
            },
          },
          required: [
            'indicator',
            'isCorrect',
            'aiReplyArabic',
            'aiReplyIndo',
            'pronunciationFeedback',
            'exampleAnswer',
            'nextQuestionArabic',
          ],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? '{}').trim());
    const isCorrect = Boolean(parsed.isCorrect);
    const finished = isCorrect && !nextTurn;

    return res.json({
      ...parsed,
      nextTurnIndex: isCorrect ? Math.min(turnIndex + 1, guide.turns.length) : turnIndex,
      finished,
    });
  } catch (error) {
    console.error('Kalam chat error:', error);
    return res.status(500).json({
      error: 'Maaf, terjadi gangguan saat memproses percakapan. Silakan coba lagi.',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`E-LKPD Bahasa Arab server listening on http://localhost:${PORT}`);
  });
}

startServer();
