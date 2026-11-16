import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { DarsData } from '../../types/learning';
import { playArabicAudio, playRetrySfx, playVictorySfx } from '../../utils/audio';

interface KalamMessage {
  role: 'ai' | 'student';
  arabic: string;
  indo?: string;
  indicator?: 'نَاطِقٌ جَيِّدٌ' | 'إِجَابَةٌ صَحِيحَةٌ' | 'حَاوِلْ مَرَّةً أُخْرَى';
  exampleAnswer?: string;
  pronunciationFeedback?: string;
}

interface KalamSectionProps {
  dars: DarsData;
  volume: number;
  soundEnabled: boolean;
  isCompleted: boolean;
  onRecordAnswer: (questionId: string, isCorrect: boolean) => { coinEarned: number };
  onCompleteMaharah: () => void;
  onTriggerCelebration: (msgArabic: string, subIndo: string, withConfetti?: boolean) => void;
  onNextStep: () => void;
  onOpenHelp: (steps: string[]) => void;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export const KalamSection: React.FC<KalamSectionProps> = ({
  dars,
  volume,
  soundEnabled,
  isCompleted,
  onRecordAnswer,
  onCompleteMaharah,
  onTriggerCelebration,
  onNextStep,
  onOpenHelp,
}) => {
  const [started, setStarted] = useState(false);
  const [turnIndex, setTurnIndex] = useState(0);
  const [messages, setMessages] = useState<KalamMessage[]>([
    {
      role: 'ai',
      arabic: dars.kalamStarter.firstQuestion,
      indo: dars.kalamStarter.turns[0]?.hintIndo,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isRecordingFallback, setIsRecordingFallback] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [dialogueFinished, setDialogueFinished] = useState(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [waveLevels, setWaveLevels] = useState<number[]>([25, 45, 70, 50, 30, 60, 40]);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const waveIntervalRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isListening || isRecordingFallback) {
      waveIntervalRef.current = window.setInterval(() => {
        setWaveLevels((prev) => prev.map(() => Math.floor(20 + Math.random() * 75)));
      }, 140);
    } else if (waveIntervalRef.current) {
      window.clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
      setWaveLevels([25, 45, 70, 50, 30, 60, 40]);
    }
    return () => {
      if (waveIntervalRef.current) window.clearInterval(waveIntervalRef.current);
    };
  }, [isListening, isRecordingFallback]);

  const currentTurnGuide = dars.kalamStarter.turns[Math.min(turnIndex, dars.kalamStarter.turns.length - 1)];

  const handleStartSection = () => {
    setStarted(true);
    void playArabicAudio(dars.kalamStarter.firstQuestion, { slow: true, volume });
  };

  const submitStudentAnswer = async (textToSend: string) => {
    const clean = textToSend.trim();
    if (!clean || isSending) return;

    setMicNotice(null);
    setInputText('');
    setMessages((prev) => [...prev, { role: 'student', arabic: clean }]);
    setIsSending(true);

    try {
      const res = await fetch('/api/kalam/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          darsId: dars.id,
          turnIndex,
          userText: clean,
          history: messages.map((m) => ({
            role: m.role,
            text: m.arabic,
          })),
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        indicator?: 'نَاطِقٌ جَيِّدٌ' | 'إِجَابَةٌ صَحِيحَةٌ' | 'حَاوِلْ مَرَّةً أُخْرَى';
        isCorrect?: boolean;
        aiReplyArabic?: string;
        aiReplyIndo?: string;
        pronunciationFeedback?: string;
        exampleAnswer?: string;
        nextQuestionArabic?: string;
        nextTurnIndex?: number;
        finished?: boolean;
      };

      if (!res.ok || data.error) {
        setMicNotice(data.error || 'Terjadi gangguan pada server percakapan.');
        setIsSending(false);
        return;
      }

      const isCorrect = Boolean(data.isCorrect);
      const qId = `dars${dars.id}-kalam-turn-${turnIndex}`;
      const { coinEarned } = onRecordAnswer(qId, isCorrect);

      if (isCorrect) {
        playVictorySfx(soundEnabled, volume);
        onTriggerCelebration(
          data.indicator || 'إِجَابَةٌ صَحِيحَةٌ',
          coinEarned > 0 ? `+${coinEarned} Koin berbicara!` : 'Pengucapan bagus!',
          Boolean(data.finished),
        );
      } else {
        playRetrySfx(soundEnabled, volume);
      }

      const fullAiArabic = data.finished
        ? `${data.aiReplyArabic || ''} ${data.nextQuestionArabic || ''}`.trim()
        : `${data.aiReplyArabic || ''} ${data.nextQuestionArabic || ''}`.trim();

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          arabic: fullAiArabic,
          indo: data.aiReplyIndo,
          indicator: data.indicator,
          exampleAnswer: data.exampleAnswer,
          pronunciationFeedback: data.pronunciationFeedback,
        },
      ]);

      void playArabicAudio(fullAiArabic, { slow: true, volume });

      if (typeof data.nextTurnIndex === 'number') {
        setTurnIndex(data.nextTurnIndex);
      }

      if (data.finished) {
        setDialogueFinished(true);
        onCompleteMaharah();
      }
    } catch {
      setMicNotice('Tidak dapat terhubung ke server percakapan. Pastikan koneksi internet aktif.');
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleMic = async () => {
    setMicNotice(null);

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    if (isRecordingFallback && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecordingFallback(false);
      return;
    }

    // Try Web Speech API first
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        const rec = new SpeechRec();
        rec.lang = 'ar-SA';
        rec.interimResults = false;
        rec.maxAlternatives = 1;

        rec.onresult = (event) => {
          const transcript = event.results?.[0]?.[0]?.transcript || '';
          setIsListening(false);
          if (transcript.trim()) {
            setInputText(transcript.trim());
            void submitStudentAnswer(transcript.trim());
          } else {
            setMicNotice('Suara belum terdengar jelas. Silakan coba ucapkan lagi.');
          }
        };

        rec.onerror = (ev) => {
          setIsListening(false);
          if (ev.error === 'not-allowed') {
            setMicNotice('Izin mikrofon ditolak. Kamu bisa mengetik jawaban Bahasa Arab di kotak bawah.');
          } else {
            setMicNotice('Mikrofon tidak menangkap suara dengan jelas. Coba lagi atau ketik jawaban.');
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
        rec.start();
        setIsListening(true);
        return;
      } catch {
        setIsListening(false);
      }
    }

    // Fallback: MediaRecorder + server /api/transcribe
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64 = String(reader.result || '').split(',')[1];
            if (!base64) return;
            setIsSending(true);
            try {
              const res = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioBase64: base64, mimeType: blob.type || 'audio/webm' }),
              });
              const data = (await res.json()) as { transcript?: string; error?: string };
              setIsSending(false);
              if (data.transcript) {
                await submitStudentAnswer(data.transcript);
              } else {
                setMicNotice(data.error || 'Suara belum dikenali. Silakan ketik jawaban di bawah.');
              }
            } catch {
              setIsSending(false);
              setMicNotice('Gagal mengirim rekaman suara. Gunakan kotak ketik di bawah ya.');
            }
          };
          reader.readAsDataURL(blob);
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
        setIsRecordingFallback(true);
      } catch {
        setMicNotice('Mikrofon tidak tersedia atau belum diizinkan. Kamu tetap bisa mengetik atau memilih contoh kata!');
      }
    } else {
      setMicNotice('Browser ini tidak mendukung mikrofon. Silakan ketik jawaban Bahasa Arab di kotak bawah.');
    }
  };

  const handleRestartDialogue = () => {
    setTurnIndex(0);
    setDialogueFinished(false);
    setMicNotice(null);
    setMessages([
      {
        role: 'ai',
        arabic: dars.kalamStarter.firstQuestion,
        indo: dars.kalamStarter.turns[0]?.hintIndo,
      },
    ]);
    void playArabicAudio(dars.kalamStarter.firstQuestion, { slow: true, volume });
  };

  const helpSteps = [
    'Klik tombol "Dengarkan" pada balon Ustadz/Ustadzah untuk mendengar pertanyaan Bahasa Arab.',
    'Tekan tombol Mikrofon (اِضْغَطْ لِلتَّحَدُّثِ) lalu ucapkan jawabanmu dalam Bahasa Arab dengan jelas.',
    'Jika mikrofon belum tersedia, kamu bisa mengetik jawaban atau menggunakan contoh kata bantuan di bawah kotak input.',
    'Ustadz/Ustadzah akan memeriksa jawabanmu, memberi pujian atau perbaikan lembut, dan melanjutkan pertanyaan berikutnya!',
  ];

  if (!started) {
    return (
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xs">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <MessageCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <p className="arabic-cairo text-3xl font-bold text-slate-900">الْكَلَامُ</p>
          <h3 className="font-display text-xl font-bold text-emerald-800">Maharah Kalam (Berbicara)</h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Ayo berlatih bercakap-cakap dalam Bahasa Arab sederhana! Kamu bisa menjawab langsung memakai
            mikrofon atau mengetik jawabanmu.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleStartSection}
            className="px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Mic className="w-5 h-5" />
            <span>Mulai Percakapan Kalam</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenHelp(helpSteps)}
            className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Petunjuk</span>
          </button>
        </div>
      </div>
    );
  }

  const micActive = isListening || isRecordingFallback;

  return (
    <div className="bg-white border-2 border-emerald-200 rounded-3xl p-5 sm:p-8 space-y-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </span>
          <div>
            <h3 className="arabic-cairo text-xl font-bold text-slate-900">الْكَلَامُ</h3>
            <p className="text-xs font-semibold text-slate-500 tabular-nums">
              Dialog Tahap {Math.min(turnIndex + 1, dars.kalamStarter.turns.length)} dari {dars.kalamStarter.turns.length}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenHelp(helpSteps)}
          aria-label="Bantuan Kalam"
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Conversation Transcript */}
      <div className="bg-gradient-to-b from-emerald-50/50 to-sky-50/40 border border-emerald-100 rounded-3xl p-4 sm:p-5 space-y-4 max-h-[380px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === 'student' ? 'items-end' : 'items-start'} space-y-1.5`}
          >
            <span className="text-[11px] font-bold text-slate-500 px-1">
              {msg.role === 'ai' ? 'Guru Bahasa Arab' : 'Jawabanmu'}
            </span>
            <div
              className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 border ${
                msg.role === 'student'
                  ? 'bg-sky-600 text-white border-sky-700'
                  : 'bg-white text-slate-900 border-emerald-200 shadow-xs'
              }`}
            >
              {/* Status Indicator */}
              {msg.indicator && (
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mb-2 ${
                    msg.indicator === 'حَاوِلْ مَرَّةً أُخْرَى'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {msg.indicator === 'حَاوِلْ مَرَّةً أُخْرَى' ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span className="arabic-cairo">{msg.indicator}</span>
                </div>
              )}

              <div className="flex items-start justify-between gap-3" dir="rtl">
                <p className="arabic-amiri text-xl sm:text-2xl font-bold leading-relaxed">{msg.arabic}</p>
                {msg.role === 'ai' && (
                  <button
                    type="button"
                    onClick={() => playArabicAudio(msg.arabic, { slow: true, volume })}
                    aria-label="Putar ulang suara guru"
                    className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {msg.indo && (
                <p className={`text-xs mt-1.5 ${msg.role === 'student' ? 'text-sky-100' : 'text-slate-600'}`}>
                  {msg.indo}
                </p>
              )}

              {msg.pronunciationFeedback && (
                <p className="text-xs text-sky-700 bg-sky-50 rounded-lg px-2.5 py-1.5 mt-2">
                  Saran pengucapan: {msg.pronunciationFeedback}
                </p>
              )}

              {msg.exampleAnswer && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2" dir="rtl">
                  <span className="text-xs text-slate-600 font-sans">
                    Contoh: <strong className="arabic-cairo text-sm text-emerald-800">{msg.exampleAnswer}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => playArabicAudio(msg.exampleAnswer || '', { slow: true, volume })}
                    className="text-xs text-emerald-700 hover:underline font-sans cursor-pointer"
                  >
                    Dengar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 px-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Guru sedang memeriksa jawabanmu...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* LOW-Level Hint Helper Box */}
      {!dialogueFinished && currentTurnGuide && (
        <div className="rounded-2xl bg-amber-50/90 border border-amber-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-amber-900">
            <span className="font-bold">Bantuan Jawaban: </span>
            <span className="arabic-cairo text-base font-bold mx-1">{currentTurnGuide.hintArabic}</span>
            <span className="text-amber-800">({currentTurnGuide.hintIndo})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => playArabicAudio(currentTurnGuide.hintArabic, { slow: true, volume })}
              className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-amber-100"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Dengar Contoh</span>
            </button>
            <button
              type="button"
              onClick={() => setInputText(currentTurnGuide.hintArabic)}
              className="px-3 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-bold cursor-pointer"
            >
              Salin ke Kotak
            </button>
          </div>
        </div>
      )}

      {/* Microphone & Sound Wave Controls */}
      {!dialogueFinished && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleToggleMic}
              disabled={isSending}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shrink-0 ${
                micActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {micActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span>{micActive ? 'Berhenti Bicara' : 'Tekan & Bicara (Mikrofon)'}</span>
            </button>

            {/* Live Waveform Bars */}
            <div className="flex items-center justify-center gap-1.5 h-11 px-4 rounded-2xl bg-slate-50 border border-slate-200 w-full sm:w-40 shrink-0">
              {waveLevels.map((lvl, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    micActive ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                  style={{ height: micActive ? `${Math.max(18, lvl)}%` : '28%' }}
                />
              ))}
            </div>

            {/* Text Input Fallback */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitStudentAnswer(inputText);
              }}
              className="flex-1 w-full flex items-center gap-2"
            >
              <input
                type="text"
                dir="rtl"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="أَوِ اكْتُبْ إِجَابَتَكَ هُنَا..."
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none arabic-cairo text-lg bg-white"
              />
              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                aria-label="Kirim jawaban"
                className="px-4 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="text-xs">Kirim</span>
              </button>
            </form>
          </div>

          {micNotice && (
            <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              {micNotice}
            </p>
          )}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleRestartDialogue}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ulangi Percakapan</span>
        </button>

        {(dialogueFinished || isCompleted) && (
          <button
            type="button"
            onClick={onNextStep}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Lanjut ke Maharah Qira&apos;ah (الْقِرَاءَةُ)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
