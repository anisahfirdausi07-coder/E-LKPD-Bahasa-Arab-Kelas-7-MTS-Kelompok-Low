import React, { useState } from 'react';
import {
  PenTool,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { KitabahQuestion } from '../../types/learning';
import { checkKitabahAnswer } from '../../utils/arabicNormalize';
import { playArabicAudio, playRetrySfx, playVictorySfx } from '../../utils/audio';
import { VocabCartoon } from '../CartoonIllustrations';

interface KitabahSectionProps {
  questions: KitabahQuestion[];
  volume: number;
  soundEnabled: boolean;
  isCompleted: boolean;
  onRecordAnswer: (questionId: string, isCorrect: boolean) => { coinEarned: number };
  onCompleteMaharah: () => void;
  onTriggerCelebration: (msgArabic: string, subIndo: string, withConfetti?: boolean) => void;
  onNextStep: () => void;
  onOpenHelp: (steps: string[]) => void;
}

export const KitabahSection: React.FC<KitabahSectionProps> = ({
  questions,
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
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, { isCorrect: boolean; feedback: string }>>({});

  const allSolved = questions.every((q) => results[q.id]?.isCorrect);

  const handleChipClick = (qId: string, word: string) => {
    setAnswers((prev) => {
      const existing = (prev[qId] || '').trim();
      const nextVal = existing ? `${existing} ${word}` : word;
      return { ...prev, [qId]: nextVal };
    });
  };

  const handleCheck = (q: KitabahQuestion) => {
    const userText = answers[q.id] || '';
    const check = checkKitabahAnswer(userText, q.acceptedKeywords, q.type);
    const { coinEarned } = onRecordAnswer(q.id, check.isCorrect);

    const nextResults = {
      ...results,
      [q.id]: { isCorrect: check.isCorrect, feedback: check.feedbackIndo },
    };
    setResults(nextResults);

    if (check.isCorrect) {
      playVictorySfx(soundEnabled, volume);
      const doneNow = questions.every((item) => nextResults[item.id]?.isCorrect);
      if (doneNow) {
        onCompleteMaharah();
      }
      onTriggerCelebration(
        'أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ',
        coinEarned > 0 ? `+${coinEarned} Koin menulis!` : 'Tulisanmu tepat!',
        doneNow,
      );
    } else {
      playRetrySfx(soundEnabled, volume);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setResults({});
  };

  const helpSteps = [
    'Perhatikan kalimat rumpang atau gambar yang disediakan pada setiap nomor.',
    'Kamu boleh mengetik langsung dengan huruf Arab, ATAU cukup menekan tombol kata bantuan di bawah kotak untuk menyusun jawaban.',
    'Tekan tombol "Periksa Jawaban" untuk melihat hasil dan mendapatkan koin.',
    'Jika belum tepat, perhatikan contoh jawaban benar dan perbaiki tulisanmu!',
  ];

  if (!started) {
    return (
      <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xs">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center">
          <PenTool className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <p className="arabic-cairo text-3xl font-bold text-slate-900">الْكِتَابَةُ</p>
          <h3 className="font-display text-xl font-bold text-amber-800">Maharah Kitabah (Menulis)</h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Lengkapi kalimat rumpang dan tulis kalimat sederhana sesuai gambar. Tersedia tombol kata bantu agar mudah dikerjakan!
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <PenTool className="w-5 h-5" />
            <span>Mulai Menulis</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenHelp(helpSteps)}
            className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold flex items-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Petunjuk</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-amber-200 rounded-3xl p-5 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <PenTool className="w-6 h-6" />
          </span>
          <div>
            <h3 className="arabic-cairo text-xl font-bold text-slate-900">الْكِتَابَةُ</h3>
            <p className="text-xs font-semibold text-slate-500">Latihan Melengkapi & Menulis Kalimat</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenHelp(helpSteps)}
          aria-label="Bantuan Kitabah"
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {questions.map((q, idx) => {
          const res = results[q.id];
          return (
            <div
              key={q.id}
              className={`rounded-2xl border-2 p-5 space-y-4 transition-colors ${
                res?.isCorrect
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : res && !res.isCorrect
                    ? 'bg-rose-50/50 border-rose-300'
                    : 'bg-[#FFFDF7] border-amber-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-bold text-slate-800">
                  {idx + 1}. {q.promptIndo}
                </p>
                {q.illustrationId && (
                  <div className="w-20 h-20 rounded-2xl bg-white border border-amber-200 flex items-center justify-center shrink-0 p-2">
                    <VocabCartoon id={q.illustrationId} className="w-16 h-16" />
                  </div>
                )}
              </div>

              {/* Sentence & Input Box */}
              <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4" dir="rtl">
                {q.sentenceBefore && (
                  <span className="arabic-amiri text-2xl font-bold text-slate-900">{q.sentenceBefore}</span>
                )}
                <input
                  type="text"
                  dir="rtl"
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="اكْتُبْ هُنَا..."
                  className="flex-1 min-w-[180px] px-4 py-2 rounded-xl border-2 border-amber-300 focus:border-sky-500 focus:outline-none arabic-cairo text-xl font-bold text-sky-900 bg-amber-50/40"
                />
                {q.sentenceAfter && (
                  <span className="arabic-amiri text-2xl font-bold text-slate-900">{q.sentenceAfter}</span>
                )}
              </div>

              {/* Word Helper Chips */}
              <div className="flex flex-wrap items-center gap-2" dir="rtl">
                <span className="text-xs font-semibold text-slate-500 font-sans ml-1">Kata bantu:</span>
                {q.wordChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(q.id, chip)}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 arabic-cairo text-base font-bold text-sky-900 transition-colors cursor-pointer"
                  >
                    + {chip}
                  </button>
                ))}
                {answers[q.id] && (
                  <button
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: '' }))}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 font-sans cursor-pointer"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleCheck(q)}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Periksa Jawaban
                </button>

                <button
                  type="button"
                  onClick={() => playArabicAudio(q.sampleAnswer, { slow: true, volume })}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Dengar Contoh</span>
                </button>
              </div>

              {/* Feedback */}
              {res && (
                <div
                  className={`rounded-xl p-3 text-xs space-y-1 ${
                    res.isCorrect ? 'bg-emerald-100/80 text-emerald-900' : 'bg-rose-100/80 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {res.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-700" />
                    )}
                    <span className="arabic-cairo text-base">
                      {res.isCorrect ? 'أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ' : 'حَاوِلْ مَرَّةً أُخْرَى'}
                    </span>
                  </div>
                  <p>{res.feedback}</p>
                  <p className="text-slate-700">
                    Contoh jawaban: <strong className="arabic-cairo text-sm">{q.sampleAnswer}</strong> — {q.explanationIndo}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ulangi Latihan</span>
        </button>

        {(allSolved || isCompleted) && (
          <button
            type="button"
            onClick={onNextStep}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Lanjut ke Evaluasi Dars (التَّقْيِيمُ)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
