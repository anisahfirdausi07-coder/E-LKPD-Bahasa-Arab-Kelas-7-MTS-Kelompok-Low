import React, { useState } from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { IstimaQuestion } from '../../types/learning';
import { VocabCartoon } from '../CartoonIllustrations';
import {
  pauseArabicAudio,
  playArabicAudio,
  playRetrySfx,
  playVictorySfx,
  resumeArabicAudio,
  stopArabicAudio,
} from '../../utils/audio';

interface IstimaSectionProps {
  darsId: number;
  questions: IstimaQuestion[];
  volume: number;
  soundEnabled: boolean;
  isCompleted: boolean;
  onRecordAnswer: (questionId: string, isCorrect: boolean) => { coinEarned: number };
  onCompleteMaharah: () => void;
  onTriggerCelebration: (msgArabic: string, subIndo: string, withConfetti?: boolean) => void;
  onNextStep: () => void;
  onOpenHelp: (steps: string[]) => void;
}

export const IstimaSection: React.FC<IstimaSectionProps> = ({
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
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [solvedIds, setSolvedIds] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [slowMode, setSlowMode] = useState(true); // Default slow for LOW ability learners
  const [shakeWrong, setShakeWrong] = useState(false);

  const currentQ = questions[currentIdx];
  const allSolved = questions.every((q) => solvedIds[q.id]);

  const handlePlay = () => {
    if (isPaused && resumeArabicAudio()) {
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    setIsPaused(false);
    void playArabicAudio(currentQ.audioText, {
      slow: slowMode,
      volume,
      onStart: () => setIsPlaying(true),
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
    });
  };

  const handlePause = () => {
    pauseArabicAudio();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleReplay = () => {
    stopArabicAudio();
    setIsPaused(false);
    void playArabicAudio(currentQ.audioText, {
      slow: slowMode,
      volume,
      onStart: () => setIsPlaying(true),
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
    });
  };

  const handleSelectOption = (optionKey: string) => {
    setSelectedKey(optionKey);
    const isCorrect = optionKey === currentQ.correctKey;
    const { coinEarned } = onRecordAnswer(currentQ.id, isCorrect);

    if (isCorrect) {
      playVictorySfx(soundEnabled, volume);
      setSolvedIds((prev) => {
        const next = { ...prev, [currentQ.id]: true };
        if (questions.every((q) => next[q.id])) {
          onCompleteMaharah();
        }
        return next;
      });
      setFeedback({
        isCorrect: true,
        message: currentQ.explanationIndo,
      });
      onTriggerCelebration(
        'أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ',
        coinEarned > 0 ? `+${coinEarned} Koin diperoleh!` : 'Jawaban benar!',
        questions.every((q) => q.id === currentQ.id || solvedIds[q.id]),
      );
    } else {
      playRetrySfx(soundEnabled, volume);
      setShakeWrong(true);
      window.setTimeout(() => setShakeWrong(false), 500);
      setFeedback({
        isCorrect: false,
        message: `Petunjuk: ${currentQ.explanationIndo}`,
      });
    }
  };

  const handleNextQuestion = () => {
    stopArabicAudio();
    setIsPlaying(false);
    setIsPaused(false);
    setSelectedKey(null);
    setFeedback(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handleResetExercise = () => {
    stopArabicAudio();
    setCurrentIdx(0);
    setSelectedKey(null);
    setFeedback(null);
    setSolvedIds({});
    setIsPlaying(false);
    setIsPaused(false);
  };

  const helpSteps = [
    'Tekan tombol Putar Audio untuk mendengarkan rekaman suara Bahasa Arab dengan seksama.',
    'Kamu boleh mengaktifkan mode "Pelan" agar pelafalan lebih jelas dan mudah diikuti.',
    'Pilih salah satu jawaban Bahasa Arab (أ، ب، ج، د) yang paling sesuai dengan audio yang kamu dengar.',
    'Jika jawaban salah, kamu bisa mengulangi audio dan mencoba memilih lagi tanpa kehilangan koin!',
  ];

  if (!started) {
    return (
      <div className="bg-white border-2 border-sky-200 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xs">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-sky-100 text-sky-700 flex items-center justify-center">
          <Headphones className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <p className="arabic-cairo text-3xl font-bold text-slate-900">الاسْتِمَاعُ</p>
          <h3 className="font-display text-xl font-bold text-sky-800">Maharah Istima&apos; (Menyimak)</h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Dengarkan 5 audio pelafalan Bahasa Arab secara cermat, lalu pilih jawaban yang paling tepat.
            Soal ini melatih telingamu mengenali bunyi dan kosakata Bahasa Arab!
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="px-7 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Play className="w-5 h-5" />
            <span>Mulai Latihan Istima&apos;</span>
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

  return (
    <div className="bg-white border-2 border-sky-200 rounded-3xl p-5 sm:p-8 space-y-6 shadow-xs">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Headphones className="w-6 h-6" />
          </span>
          <div>
            <h3 className="arabic-cairo text-xl font-bold text-slate-900">الاسْتِمَاعُ</h3>
            <p className="text-xs font-semibold text-slate-500 tabular-nums">
              Soal {currentIdx + 1} dari {questions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSlowMode((s) => !s)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              slowMode
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            Kecepatan: {slowMode ? 'Pelan (0.75x)' : 'Normal'}
          </button>
          <button
            type="button"
            onClick={() => onOpenHelp(helpSteps)}
            aria-label="Bantuan soal Istima"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Progress Dots */}
      <div className="flex items-center justify-center gap-2">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            type="button"
            onClick={() => {
              stopArabicAudio();
              setCurrentIdx(idx);
              setSelectedKey(null);
              setFeedback(null);
            }}
            className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer tabular-nums ${
              idx === currentIdx
                ? 'bg-sky-600 text-white shadow-xs scale-105'
                : solvedIds[q.id]
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Audio Player Stage (NO Arabic text of the question shown, NO Indonesian translation!) */}
      <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-[#FFFDF7] to-amber-50 border-2 border-sky-200 p-6 text-center space-y-4">
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {isPlaying && (
            <>
              <span className="absolute inset-0 rounded-full bg-sky-300/40 animate-ping" />
              <span className="absolute inset-2 rounded-full bg-sky-200/60" />
            </>
          )}
          <div className="relative w-20 h-20 rounded-full bg-white border-2 border-sky-400 text-sky-700 flex items-center justify-center shadow-sm">
            <Volume2 className="w-9 h-9" />
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-700">
          Tekan tombol putar, dengarkan baik-baik, lalu pilih jawaban yang sesuai!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePlay}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>{isPaused ? 'Lanjutkan' : 'Putar Audio'}</span>
          </button>

          <button
            type="button"
            onClick={handlePause}
            disabled={!isPlaying}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Pause className="w-4 h-4" />
            <span>Jeda</span>
          </button>

          <button
            type="button"
            onClick={handleReplay}
            className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Audio</span>
          </button>
        </div>
      </div>

      {/* Answer Options (Pure Arabic + optional cartoon illustration, NO Indonesian) */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${shakeWrong ? 'animate-gentle-shake' : ''}`} dir="rtl">
        {currentQ.options.map((opt) => {
          const isSelected = selectedKey === opt.key;
          const isRightSelected = isSelected && feedback?.isCorrect;
          const isWrongSelected = isSelected && feedback && !feedback.isCorrect;

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleSelectOption(opt.key)}
              className={`rounded-2xl border-2 p-4 flex items-center justify-between gap-4 text-right transition-all cursor-pointer ${
                isRightSelected
                  ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                  : isWrongSelected
                    ? 'bg-rose-50 border-rose-400'
                    : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center shrink-0 arabic-cairo ${
                    isRightSelected
                      ? 'bg-emerald-600 text-white'
                      : isWrongSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {opt.key}
                </span>
                <span className="arabic-amiri text-2xl font-bold text-slate-900">{opt.arabic}</span>
              </div>

              {opt.illustrationId && (
                <div className="w-14 h-14 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-center shrink-0 p-1">
                  <VocabCartoon id={opt.illustrationId} className="w-12 h-12" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`rounded-2xl border-2 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            feedback.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-start gap-3">
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="arabic-cairo text-lg font-bold">
                {feedback.isCorrect ? 'أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ' : 'حَاوِلْ مَرَّةً أُخْرَى'}
              </p>
              <p className="text-sm mt-0.5">{feedback.message}</p>
            </div>
          </div>

          {feedback.isCorrect && currentIdx < questions.length - 1 && (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Soal Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleResetExercise}
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
            <span>Lanjut ke Maharah Kalam (الْكَلَامُ)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
