import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Volume2,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  GripVertical,
} from 'lucide-react';
import { DarsData } from '../../types/learning';
import { playArabicAudio, playRetrySfx, playVictorySfx } from '../../utils/audio';

interface QiraahSectionProps {
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

export const QiraahSection: React.FC<QiraahSectionProps> = ({
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
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [draggedChip, setDraggedChip] = useState<string | null>(null);
  const [matchChecked, setMatchChecked] = useState<Record<string, boolean>>({});
  const [mcAnswers, setMcAnswers] = useState<Record<string, string>>({});
  const [mcFeedback, setMcFeedback] = useState<Record<string, boolean>>({});

  // Shuffle answer pool deterministically per Dars
  const answerPool = useMemo(() => {
    const items = dars.qiraah.matchingPairs.map((p) => p.correctAnswerArabic);
    return [...items].sort((a, b) => a.localeCompare(b));
  }, [dars.qiraah.matchingPairs]);

  const placedValues = Object.values(placements);

  const checkCompletion = (nextMatchChecked: Record<string, boolean>, nextMcFeedback: Record<string, boolean>) => {
    const allMatchDone = dars.qiraah.matchingPairs.every((p) => nextMatchChecked[p.id] === true);
    const allMcDone = (dars.qiraah.mcQuestions ?? []).every((q) => nextMcFeedback[q.id] === true);
    if (allMatchDone && allMcDone) {
      onCompleteMaharah();
    }
  };

  const assignAnswerToPair = (pairId: string, answerText: string) => {
    const pair = dars.qiraah.matchingPairs.find((p) => p.id === pairId);
    if (!pair) return;

    const updatedPlacements = { ...placements };
    // Remove answerText if already placed elsewhere
    Object.keys(updatedPlacements).forEach((k) => {
      if (updatedPlacements[k] === answerText) {
        delete updatedPlacements[k];
      }
    });
    updatedPlacements[pairId] = answerText;
    setPlacements(updatedPlacements);
    setSelectedChip(null);
    setDraggedChip(null);

    const isCorrect = answerText === pair.correctAnswerArabic;
    const { coinEarned } = onRecordAnswer(pairId, isCorrect);
    const nextMatchChecked = { ...matchChecked, [pairId]: isCorrect };
    setMatchChecked(nextMatchChecked);

    if (isCorrect) {
      playVictorySfx(soundEnabled, volume);
      const allDoneNow =
        dars.qiraah.matchingPairs.every((p) => nextMatchChecked[p.id] === true) &&
        (dars.qiraah.mcQuestions ?? []).every((q) => mcFeedback[q.id] === true);
      onTriggerCelebration(
        'أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ',
        coinEarned > 0 ? `+${coinEarned} Koin menjodohkan!` : 'Pasangan tepat!',
        allDoneNow,
      );
      checkCompletion(nextMatchChecked, mcFeedback);
    } else {
      playRetrySfx(soundEnabled, volume);
    }
  };

  const handleMcSelect = (qId: string, optionKey: string, correctKey: string) => {
    setMcAnswers((prev) => ({ ...prev, [qId]: optionKey }));
    const isCorrect = optionKey === correctKey;
    const { coinEarned } = onRecordAnswer(qId, isCorrect);
    const nextMc = { ...mcFeedback, [qId]: isCorrect };
    setMcFeedback(nextMc);

    if (isCorrect) {
      playVictorySfx(soundEnabled, volume);
      const allDoneNow =
        dars.qiraah.matchingPairs.every((p) => matchChecked[p.id] === true) &&
        (dars.qiraah.mcQuestions ?? []).every((q) => nextMc[q.id] === true);
      onTriggerCelebration(
        'أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ',
        coinEarned > 0 ? `+${coinEarned} Koin membaca!` : 'Jawaban tepat!',
        allDoneNow,
      );
      checkCompletion(matchChecked, nextMc);
    } else {
      playRetrySfx(soundEnabled, volume);
    }
  };

  const handleReset = () => {
    setPlacements({});
    setSelectedChip(null);
    setDraggedChip(null);
    setMatchChecked({});
    setMcAnswers({});
    setMcFeedback({});
  };

  const allDone =
    dars.qiraah.matchingPairs.every((p) => matchChecked[p.id] === true) &&
    (dars.qiraah.mcQuestions ?? []).every((q) => mcFeedback[q.id] === true);

  const helpSteps = [
    'Bacalah teks Bahasa Arab di kotak atas dengan tenang. Kamu juga bisa menekan tombol audio untuk mendengarkannya.',
    'Pada bagian menjodohkan, seret (drag & drop) kotak jawaban berwarna kuning ke kotak pertanyaan yang sesuai.',
    'Di HP atau tablet, kamu juga cukup mengetuk kotak jawaban lalu mengetuk kotak tujuan di samping pertanyaan.',
    'Jika semua pasangan dan soal sudah benar (hijau), kamu bisa lanjut ke Maharah Kitabah!',
  ];

  if (!started) {
    return (
      <div className="bg-white border-2 border-violet-200 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xs">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-violet-100 text-violet-700 flex items-center justify-center">
          <BookOpen className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <p className="arabic-cairo text-3xl font-bold text-slate-900">الْقِرَاءَةُ</p>
          <h3 className="font-display text-xl font-bold text-violet-800">Maharah Qira&apos;ah (Membaca)</h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Baca teks cerita pendek berharakat lengkap, dengarkan pelafalannya jika perlu, lalu jodohkan
            jawaban yang tepat!
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="px-7 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <BookOpen className="w-5 h-5" />
            <span>Mulai Membaca</span>
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
    <div className="bg-white border-2 border-violet-200 rounded-3xl p-5 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-violet-100">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </span>
          <div>
            <h3 className="arabic-cairo text-xl font-bold text-slate-900">الْقِرَاءَةُ</h3>
            <p className="text-xs font-semibold text-slate-500">Membaca Teks & Menjodohkan Jawaban</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenHelp(helpSteps)}
          aria-label="Bantuan Qiraah"
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Arabic Passage Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF7] to-[#F5F3FF] border-2 border-violet-200 p-6 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="arabic-ruqaa text-3xl font-bold text-violet-900" dir="rtl">
            {dars.qiraah.titleArabic}
          </h4>
          <button
            type="button"
            onClick={() =>
              playArabicAudio(`${dars.qiraah.titleArabic}. ${dars.qiraah.passageArabic}`, {
                slow: true,
                volume,
              })
            }
            className="px-4 py-2 rounded-xl bg-white border border-violet-200 hover:bg-violet-50 text-violet-800 text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Dengarkan Teks (Opsional)</span>
          </button>
        </div>

        <p
          dir="rtl"
          className="arabic-amiri text-2xl sm:text-3xl text-slate-900 leading-[2.2] bg-white/80 rounded-2xl p-5 border border-violet-100"
        >
          {dars.qiraah.passageArabic}
        </p>

        <p className="text-xs sm:text-sm text-slate-600">{dars.qiraah.passageIndoHint}</p>
      </div>

      {/* Optional Multiple Choice Section (Dars 2 & 3) */}
      {dars.qiraah.mcQuestions && dars.qiraah.mcQuestions.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-display text-base font-bold text-slate-900">
            Bagian A: Pilihan Ganda Sesuai Teks
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dars.qiraah.mcQuestions.map((q, idx) => {
              const chosen = mcAnswers[q.id];
              const isRight = mcFeedback[q.id];
              return (
                <div key={q.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <p className="arabic-cairo text-lg font-bold text-slate-900 text-right" dir="rtl">
                    {idx + 1}. {q.questionArabic}
                  </p>
                  <div className="grid grid-cols-2 gap-2" dir="rtl">
                    {q.options.map((opt) => {
                      const active = chosen === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleMcSelect(q.id, opt.key, q.correctKey)}
                          className={`px-3 py-2.5 rounded-xl border text-right arabic-cairo text-base font-semibold transition-all cursor-pointer ${
                            active
                              ? isRight
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                : 'bg-rose-50 border-rose-400 text-rose-900'
                              : 'bg-white border-slate-200 hover:border-violet-400 text-slate-800'
                          }`}
                        >
                          <span className="font-bold ml-1">{opt.key}.</span> {opt.arabic}
                        </button>
                      );
                    })}
                  </div>
                  {chosen && (
                    <p className={`text-xs font-semibold ${isRight ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {isRight
                        ? `أَحْسَنْتَ! ${q.explanationIndo}`
                        : `حَاوِلْ مَرَّةً أُخْرَى — Coba cek kembali teks bacaan di atas!`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drag-and-Drop / Tap-to-Place Matching Exercise */}
      <div className="space-y-4">
        <div>
          <h4 className="font-display text-base font-bold text-slate-900">
            {dars.qiraah.mcQuestions ? 'Bagian B: Menjodohkan Pertanyaan & Jawaban' : 'Menjodohkan Pertanyaan & Jawaban'}
          </h4>
          <p className="text-xs text-slate-600">
            Geser (drag & drop) kotak jawaban di bawah ke kotak kosong pada pertanyaan, atau klik jawaban lalu klik kotak tujuan.
          </p>
        </div>

        {/* Draggable Answer Chips Bank */}
        <div className="rounded-2xl bg-amber-50/80 border-2 border-dashed border-amber-300 p-4 space-y-2">
          <p className="text-xs font-bold text-amber-900">Kotak Pilihan Jawaban (Geser atau Klik):</p>
          <div className="flex flex-wrap gap-2.5" dir="rtl">
            {answerPool.map((ans) => {
              const isUsedCorrectly = Object.entries(placements).some(
                ([pId, val]) => val === ans && matchChecked[pId] === true,
              );
              const isSelected = selectedChip === ans;
              return (
                <button
                  key={ans}
                  type="button"
                  draggable={!isUsedCorrectly}
                  onDragStart={() => setDraggedChip(ans)}
                  onClick={() => {
                    if (!isUsedCorrectly) {
                      setSelectedChip((prev) => (prev === ans ? null : ans));
                    }
                  }}
                  disabled={isUsedCorrectly}
                  className={`px-4 py-2.5 rounded-xl border-2 arabic-cairo text-base font-bold flex items-center gap-2 transition-all ${
                    isUsedCorrectly
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800 opacity-60 cursor-default'
                      : isSelected
                        ? 'bg-amber-300 border-amber-600 text-slate-900 scale-105 cursor-pointer shadow-xs'
                        : 'bg-white border-amber-300 hover:border-amber-500 text-slate-900 cursor-grab active:cursor-grabbing'
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{ans}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Matching Question Slots */}
        <div className="space-y-3">
          {dars.qiraah.matchingPairs.map((pair, idx) => {
            const placed = placements[pair.id];
            const isCorrect = matchChecked[pair.id];
            const hasAttempt = pair.id in matchChecked;

            return (
              <div
                key={pair.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const chosen = draggedChip || selectedChip;
                  if (chosen) assignAnswerToPair(pair.id, chosen);
                }}
                onClick={() => {
                  if (selectedChip) {
                    assignAnswerToPair(pair.id, selectedChip);
                  }
                }}
                className={`rounded-2xl border-2 p-4 flex flex-col sm:flex-row-reverse items-stretch sm:items-center justify-between gap-3 transition-colors ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-400'
                    : hasAttempt && !isCorrect
                      ? 'bg-rose-50 border-rose-300'
                      : selectedChip
                        ? 'bg-sky-50/70 border-sky-300 cursor-pointer'
                        : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div dir="rtl" className="text-right flex-1">
                  <p className="arabic-cairo text-lg sm:text-xl font-bold text-slate-900">
                    {idx + 1}. {pair.questionArabic}
                  </p>
                </div>

                {/* Drop Target Slot */}
                <div
                  dir="rtl"
                  className={`min-w-[210px] min-h-[48px] px-4 py-2 rounded-xl border-2 border-dashed flex items-center justify-between gap-2 ${
                    isCorrect
                      ? 'bg-white border-emerald-500 text-emerald-800'
                      : hasAttempt && !isCorrect
                        ? 'bg-white border-rose-400 text-rose-800'
                        : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  <span className="arabic-cairo text-base font-bold">
                    {placed || 'Letakkan jawaban di sini'}
                  </span>
                  {hasAttempt &&
                    (isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Note if any wrong */}
        {Object.values(matchChecked).some((v) => v === false) && (
          <p className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
            حَاوِلْ مَرَّةً أُخْرَى — Ada pasangan yang belum tepat. Geser atau pilih jawaban lain dari kotak kuning ya!
          </p>
        )}
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

        {(allDone || isCompleted) && (
          <button
            type="button"
            onClick={onNextStep}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Lanjut ke Maharah Kitabah (الْكِتَابَةُ)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
