import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Headphones,
  HelpCircle,
  MessageCircle,
  PenTool,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  AlertCircle,
} from 'lucide-react';
import { DarsData, DarsStep, LearningProgress, MaharahKey } from '../types/learning';
import {
  AnimatedOpenBook,
  AnimatedStar,
  CoinIcon,
  GlowingLampCartoon,
  StudentRaisingHand,
  VocabCartoon,
} from './CartoonIllustrations';
import { IstimaSection } from './maharah/IstimaSection';
import { KalamSection } from './maharah/KalamSection';
import { QiraahSection } from './maharah/QiraahSection';
import { KitabahSection } from './maharah/KitabahSection';
import { playArabicAudio, playRetrySfx, playVictorySfx } from '../utils/audio';

interface DarsWorkspaceProps {
  dars: DarsData;
  progress: LearningProgress;
  darsProgressPercent: number;
  onRecordAnswer: (questionId: string, isCorrect: boolean) => { coinEarned: number };
  onCompleteMaharah: (darsId: number, maharah: MaharahKey) => { bonusEarned: number };
  onCompleteDars: (darsId: number) => { bonusEarned: number };
  onTriggerCelebration: (msgArabic: string, subIndo: string, withConfetti?: boolean) => void;
  onBackDashboard: () => void;
  onGoNextDarsOrClosing: () => void;
  onOpenHelp: (steps: string[]) => void;
}

const STEP_LIST: Array<{ key: DarsStep; label: string; arabic: string }> = [
  { key: 'intro', label: 'Pembuka', arabic: 'المُقَدِّمَةُ' },
  { key: 'tujuan', label: 'Tujuan', arabic: 'الأَهْدَافُ' },
  { key: 'materi', label: 'Materi', arabic: 'المَادَّةُ' },
  { key: 'istima', label: "Istima'", arabic: 'الاسْتِمَاعُ' },
  { key: 'kalam', label: 'Kalam', arabic: 'الْكَلَامُ' },
  { key: 'qiraah', label: "Qira'ah", arabic: 'الْقِرَاءَةُ' },
  { key: 'kitabah', label: 'Kitabah', arabic: 'الْكِتَابَةُ' },
  { key: 'evaluasi', label: 'Evaluasi', arabic: 'التَّقْيِيمُ' },
  { key: 'mahfuzhat', label: 'Mahfuzhat', arabic: 'المَحْفُوظَاتُ' },
];

export const DarsWorkspace: React.FC<DarsWorkspaceProps> = ({
  dars,
  progress,
  darsProgressPercent,
  onRecordAnswer,
  onCompleteMaharah,
  onCompleteDars,
  onTriggerCelebration,
  onBackDashboard,
  onGoNextDarsOrClosing,
  onOpenHelp,
}) => {
  const [step, setStep] = useState<DarsStep>('intro');
  const [imgError, setImgError] = useState(false);

  // Dars 2 interactive picture recognition mini-game state
  const [guessItemIdx, setGuessItemIdx] = useState(0);
  const [guessResult, setGuessResult] = useState<{ correct: boolean; picked: string } | null>(null);

  // Evaluasi state
  const [evalAnswers, setEvalAnswers] = useState<Record<string, string>>({});
  const [evalResults, setEvalResults] = useState<Record<string, boolean>>({});

  const evalAllSolved = dars.evaluasiQuestions.every((q) => evalResults[q.id] === true);

  const handleMaharahFinish = (maharah: MaharahKey) => {
    const { bonusEarned } = onCompleteMaharah(dars.id, maharah);
    if (bonusEarned > 0) {
      onTriggerCelebration(
        'مُمْتَازٌ! أَكْمَلْتَ الْمَهَارَةَ!',
        `Bonus +${bonusEarned} Koin menyelesaikan Maharah!`,
        true,
      );
    }
  };

  const handleEvalSelect = (qId: string, chosenKey: string, correctKey: string) => {
    setEvalAnswers((prev) => ({ ...prev, [qId]: chosenKey }));
    const isCorrect = chosenKey === correctKey;
    const { coinEarned } = onRecordAnswer(qId, isCorrect);

    const nextResults = { ...evalResults, [qId]: isCorrect };
    setEvalResults(nextResults);

    if (isCorrect) {
      playVictorySfx(progress.soundEnabled, progress.volume);
      const finishedAllNow = dars.evaluasiQuestions.every((q) => nextResults[q.id] === true);
      if (finishedAllNow) {
        const { bonusEarned } = onCompleteDars(dars.id);
        onTriggerCelebration(
          'أَحْسَنْتَ! أَكْمَلْتَ الدَّرْسَ!',
          bonusEarned > 0
            ? `+${coinEarned} Koin + Bonus +${bonusEarned} Koin Dars!`
            : 'Evaluasi Dars selesai!',
          true,
        );
      } else {
        onTriggerCelebration(
          'أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ',
          coinEarned > 0 ? `+${coinEarned} Koin!` : 'Jawaban benar!',
        );
      }
    } else {
      playRetrySfx(progress.soundEnabled, progress.volume);
    }
  };

  const handleGuessPicture = (pickedArabic: string, targetArabic: string) => {
    const isCorrect = pickedArabic === targetArabic;
    setGuessResult({ correct: isCorrect, picked: pickedArabic });
    if (isCorrect) {
      playVictorySfx(progress.soundEnabled, progress.volume);
      void playArabicAudio(targetArabic, { slow: true, volume: progress.volume });
    } else {
      playRetrySfx(progress.soundEnabled, progress.volume);
    }
  };

  const guessTarget = dars.vocab[guessItemIdx % dars.vocab.length];
  const guessOptions = [
    guessTarget,
    dars.vocab[(guessItemIdx + 2) % dars.vocab.length],
    dars.vocab[(guessItemIdx + 5) % dars.vocab.length],
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Dars Breadcrumb & Progress Bar */}
      <div className="bg-white border-2 border-sky-200 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackDashboard}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-sky-700">DARS {dars.id}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="arabic-cairo text-lg font-bold text-slate-900">{dars.arabicTitle}</span>
            </div>
            <p className="text-xs text-slate-600">{dars.indoTitle}</p>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Progres Dars {dars.id}</span>
            <span className="tabular-nums text-emerald-700">{darsProgressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${darsProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 9-Step Horizontal Stepper */}
      <nav aria-label="Tahapan pembelajaran Dars" className="bg-white border border-slate-200 rounded-2xl p-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {STEP_LIST.map((item, idx) => {
            const active = step === item.key;
            const isMaharahDone =
              (item.key === 'istima' ||
                item.key === 'kalam' ||
                item.key === 'qiraah' ||
                item.key === 'kitabah') &&
              Boolean(progress.completedMaharah[`dars${dars.id}-${item.key}`]);
            const isEvalDone = item.key === 'evaluasi' && Boolean(progress.completedDars[dars.id]);

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setStep(item.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-sky-600 text-white shadow-xs'
                    : isMaharahDone || isEvalDone
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="tabular-nums">{idx + 1}.</span>
                <span>{item.label}</span>
                {(isMaharahDone || isEvalDone) && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* STEP 1: HALAMAN PEMBUKA DARS */}
      {step === 'intro' && (
        <section className="bg-gradient-to-br from-[#EFF8FF] via-[#FFFDF7] to-[#FEF9C3] border-2 border-sky-200 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-extrabold tracking-wide text-sky-700 uppercase">
              Pelajaran {dars.id} · الدَّرْسُ {dars.id === 1 ? 'الأَوَّلُ' : dars.id === 2 ? 'الثَّانِي' : 'الثَّالِثُ'}
            </span>
            <h2 className="arabic-ruqaa text-4xl sm:text-5xl font-bold text-slate-900" dir="rtl">
              {dars.arabicTitle}
            </h2>
            <p className="font-display text-2xl font-bold text-sky-800">{dars.indoTitle}</p>
            <p className="text-slate-700 leading-relaxed">{dars.shortDesc}</p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep('tujuan')}
                className="px-7 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Lihat Tujuan Pembelajaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => playArabicAudio(dars.arabicTitle, { slow: true, volume: progress.volume })}
                className="px-4 py-3.5 rounded-2xl bg-white border border-sky-200 hover:bg-sky-50 text-sky-800 font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Dengar Judul</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden bg-white border-2 border-amber-200 shadow-sm aspect-[4/3]">
              {!imgError ? (
                <img
                  src={dars.imagePath}
                  alt={dars.indoTitle}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sky-50">
                  <StudentRaisingHand variant="boy" className="w-28 h-28" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* STEP 2: TUJUAN PEMBELAJARAN */}
      {step === 'tujuan' && (
        <section className="bg-white border-2 border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-emerald-100">
            <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </span>
            <div>
              <h2 className="arabic-cairo text-2xl font-bold text-slate-900">أَهْدَافُ التَّعَلُّمِ</h2>
              <p className="text-sm font-semibold text-slate-600">Tujuan Pembelajaran Dars {dars.id}</p>
            </div>
          </div>

          <ul className="space-y-3">
            {dars.objectives.map((obj, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4"
              >
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                  {idx + 1}
                </span>
                <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">{obj}</p>
              </li>
            ))}
          </ul>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setStep('materi')}
              className="px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Masuk ke Materi Singkat (المَادَّةُ التَّعْلِيمِيَّةُ)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: MATERI SINGKAT */}
      {step === 'materi' && (
        <section className="space-y-6">
          {/* Intro Card */}
          <div className="bg-white border-2 border-sky-200 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="arabic-cairo text-2xl font-bold text-slate-900">المَادَّةُ التَّعْلِيمِيَّةُ</h2>
                  <p className="text-sm font-semibold text-slate-600">Kosakata & Penjelasan Singkat</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenHelp([
                    'Klik tombol speaker (Putar Audio) di setiap kartu kosakata untuk mendengar cara membacanya.',
                    'Perhatikan gambar kartun dan artinya dalam Bahasa Indonesia.',
                    'Pelajari bagian Kata Tunjuk / Urutan Kegiatan di bawah kartu kosakata sebelum mulai latihan.',
                  ])
                }
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Panduan Materi</span>
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{dars.materiIntroIndo}</p>

            {/* Mufradat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {dars.vocab.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border-2 border-amber-100 bg-gradient-to-b from-[#FFFDF7] to-amber-50/40 p-4 flex items-center justify-between gap-3 hover:border-sky-300 transition-colors"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white border border-amber-100 flex items-center justify-center shrink-0 p-1.5">
                    <VocabCartoon id={item.illustrationId} className="w-14 h-14" />
                  </div>

                  <div className="flex-1 text-right" dir="rtl">
                    {item.note && (
                      <span className="text-[11px] font-bold text-sky-700 block font-sans">{item.note}</span>
                    )}
                    <p className="arabic-amiri text-2xl font-bold text-slate-900">{item.arabic}</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 font-sans mt-0.5" dir="ltr">
                      {item.indonesian}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => playArabicAudio(item.arabic, { slow: true, volume: progress.volume })}
                    aria-label={`Putar pelafalan ${item.indonesian}`}
                    className="w-10 h-10 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar / Isim Isyarah / Daily Timeline */}
          <div className="bg-white border-2 border-violet-200 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </span>
              <h3 className="arabic-cairo text-xl font-bold text-slate-900">{dars.grammarTitle}</h3>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{dars.grammarExplanationIndo}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dars.grammarExamples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-violet-50/60 border border-violet-200 p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="arabic-amiri text-2xl font-bold text-slate-900" dir="rtl">
                      {ex.arabic}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1">{ex.indo}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => playArabicAudio(ex.audio, { slow: true, volume: progress.volume })}
                    aria-label="Putar contoh kalimat"
                    className="w-10 h-10 rounded-xl bg-white border border-violet-200 hover:bg-violet-100 text-violet-800 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Dars 1 Dialogue Examples */}
            {dars.dialogueExamples && (
              <div className="pt-2 space-y-3">
                <h4 className="font-display text-base font-bold text-slate-900">Contoh Ungkapan Tanya Jawab:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {dars.dialogueExamples.map((dlg, idx) => (
                    <div key={idx} className="rounded-2xl bg-sky-50/70 border border-sky-200 p-4 space-y-2">
                      <div dir="rtl" className="space-y-1 text-right">
                        <p className="arabic-cairo text-lg font-bold text-sky-900">{dlg.speakerA}</p>
                        <p className="arabic-cairo text-lg font-bold text-emerald-800">{dlg.speakerB}</p>
                      </div>
                      <p className="text-xs text-slate-600">{dlg.indo}</p>
                      <button
                        type="button"
                        onClick={() =>
                          playArabicAudio(`${dlg.speakerA} ${dlg.speakerB}`, {
                            slow: true,
                            volume: progress.volume,
                          })
                        }
                        className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dengar Dialog</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dars 2 Interactive Picture Recognition Mini-Practice */}
            {dars.id === 2 && (
              <div className="pt-3 border-t border-violet-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold text-slate-900">
                      Latihan Pengenalan Benda dari Gambar
                    </h4>
                    <p className="text-xs text-slate-600">Pilih kosakata Arab yang sesuai dengan gambar!</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setGuessItemIdx((i) => i + 1);
                      setGuessResult(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold cursor-pointer"
                  >
                    Ganti Gambar
                  </button>
                </div>

                <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200 p-4 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center shrink-0 p-2">
                    <VocabCartoon id={guessTarget.illustrationId} className="w-20 h-20" />
                  </div>
                  <div className="flex-1 flex flex-wrap gap-3 justify-center sm:justify-start" dir="rtl">
                    {guessOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleGuessPicture(opt.arabic, guessTarget.arabic)}
                        className={`px-5 py-3 rounded-2xl border-2 arabic-cairo text-xl font-bold transition-all cursor-pointer ${
                          guessResult?.picked === opt.arabic
                            ? guessResult.correct
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : 'bg-rose-100 text-rose-900 border-rose-400'
                            : 'bg-white border-slate-200 hover:border-emerald-400 text-slate-900'
                        }`}
                      >
                        {opt.arabic}
                      </button>
                    ))}
                  </div>
                </div>
                {guessResult && (
                  <p className={`text-xs font-bold ${guessResult.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {guessResult.correct
                      ? `أَحْسَنْتَ! Ini adalah ${guessTarget.arabic} (${guessTarget.indonesian}).`
                      : 'حَاوِلْ مَرَّةً أُخْرَى — Perhatikan gambarnya dan coba pilih lagi!'}
                  </p>
                )}
              </div>
            )}

            {/* Dars 3 Daily Order Timeline */}
            {dars.dailyOrder && (
              <div className="pt-3 border-t border-violet-100 space-y-3">
                <h4 className="font-display text-base font-bold text-slate-900">
                  Urutan Kegiatan Sehari-hari (Pagi Sampai Malam):
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {dars.dailyOrder.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => playArabicAudio(slot.arabic, { slow: true, volume: progress.volume })}
                      className="rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 p-3 text-center space-y-1.5 transition-colors cursor-pointer"
                    >
                      <span className="text-[11px] font-bold text-amber-800 block">{slot.timeLabel}</span>
                      <div className="w-12 h-12 mx-auto">
                        <VocabCartoon id={slot.illustrationId} className="w-12 h-12" />
                      </div>
                      <p className="arabic-cairo text-base font-bold text-slate-900">{slot.arabic}</p>
                      <p className="text-xs text-slate-600">{slot.indo}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep('istima')}
              className="px-7 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Headphones className="w-5 h-5" />
              <span>Mulai Maharah Istima&apos; (الاسْتِمَاعُ)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: MAHARAH ISTIMA' */}
      {step === 'istima' && (
        <IstimaSection
          darsId={dars.id}
          questions={dars.istimaQuestions}
          volume={progress.volume}
          soundEnabled={progress.soundEnabled}
          isCompleted={Boolean(progress.completedMaharah[`dars${dars.id}-istima`])}
          onRecordAnswer={onRecordAnswer}
          onCompleteMaharah={() => handleMaharahFinish('istima')}
          onTriggerCelebration={onTriggerCelebration}
          onNextStep={() => setStep('kalam')}
          onOpenHelp={onOpenHelp}
        />
      )}

      {/* STEP 5: MAHARAH KALAM */}
      {step === 'kalam' && (
        <KalamSection
          dars={dars}
          volume={progress.volume}
          soundEnabled={progress.soundEnabled}
          isCompleted={Boolean(progress.completedMaharah[`dars${dars.id}-kalam`])}
          onRecordAnswer={onRecordAnswer}
          onCompleteMaharah={() => handleMaharahFinish('kalam')}
          onTriggerCelebration={onTriggerCelebration}
          onNextStep={() => setStep('qiraah')}
          onOpenHelp={onOpenHelp}
        />
      )}

      {/* STEP 6: MAHARAH QIRA'AH */}
      {step === 'qiraah' && (
        <QiraahSection
          dars={dars}
          volume={progress.volume}
          soundEnabled={progress.soundEnabled}
          isCompleted={Boolean(progress.completedMaharah[`dars${dars.id}-qiraah`])}
          onRecordAnswer={onRecordAnswer}
          onCompleteMaharah={() => handleMaharahFinish('qiraah')}
          onTriggerCelebration={onTriggerCelebration}
          onNextStep={() => setStep('kitabah')}
          onOpenHelp={onOpenHelp}
        />
      )}

      {/* STEP 7: MAHARAH KITABAH */}
      {step === 'kitabah' && (
        <KitabahSection
          questions={dars.kitabahQuestions}
          volume={progress.volume}
          soundEnabled={progress.soundEnabled}
          isCompleted={Boolean(progress.completedMaharah[`dars${dars.id}-kitabah`])}
          onRecordAnswer={onRecordAnswer}
          onCompleteMaharah={() => handleMaharahFinish('kitabah')}
          onTriggerCelebration={onTriggerCelebration}
          onNextStep={() => setStep('evaluasi')}
          onOpenHelp={onOpenHelp}
        />
      )}

      {/* STEP 8: EVALUASI & PENGUMPULAN KOIN */}
      {step === 'evaluasi' && (
        <section className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </span>
              <div>
                <h2 className="arabic-cairo text-2xl font-bold text-slate-900">التَّقْيِيمُ وَجَمْعُ النُّقُودِ</h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Evaluasi Akhir Dars {dars.id} — Selesaikan semua soal untuk mendapat bonus +30 Koin!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2">
              <CoinIcon className="w-6 h-6" />
              <span className="text-sm font-extrabold text-amber-900 tabular-nums">{progress.coins} Koin</span>
            </div>
          </div>

          <div className="space-y-5">
            {dars.evaluasiQuestions.map((q, idx) => {
              const chosen = evalAnswers[q.id];
              const isRight = evalResults[q.id];
              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border-2 p-5 space-y-4 ${
                    isRight
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : chosen && !isRight
                        ? 'bg-rose-50/60 border-rose-300'
                        : 'bg-[#FFFDF7] border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="arabic-cairo text-xl font-bold text-slate-900 text-right flex-1" dir="rtl">
                      {idx + 1}. {q.questionArabic}
                    </p>
                    {q.illustrationId && (
                      <div className="w-16 h-16 rounded-2xl bg-white border border-amber-200 flex items-center justify-center shrink-0 p-1">
                        <VocabCartoon id={q.illustrationId} className="w-14 h-14" />
                      </div>
                    )}
                  </div>

                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    dir={q.options.some((o) => /[\u0600-\u06FF]/.test(o.arabic)) ? 'rtl' : 'ltr'}
                  >
                    {q.options.map((opt) => {
                      const active = chosen === opt.key;
                      const isArabicOpt = /[\u0600-\u06FF]/.test(opt.arabic);
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          dir={isArabicOpt ? 'rtl' : 'ltr'}
                          onClick={() => handleEvalSelect(q.id, opt.key, q.correctKey)}
                          className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all cursor-pointer flex items-center gap-3 ${
                            isArabicOpt ? 'text-right' : 'text-left'
                          } ${
                            active
                              ? isRight
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : 'bg-rose-100 text-rose-900 border-rose-400'
                              : 'bg-white border-slate-200 hover:border-sky-400 text-slate-900'
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-lg font-bold text-base flex items-center justify-center shrink-0 arabic-naskh ${
                              active
                                ? isRight
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-rose-200 text-rose-900'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {opt.key}
                          </span>
                          {isArabicOpt ? (
                            <span dir="rtl" className="arabic-naskh text-lg font-bold">
                              {opt.arabic}
                            </span>
                          ) : (
                            <span dir="ltr" className="font-sans text-base font-semibold">
                              {opt.arabic}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {chosen && (
                    <div className={`flex items-center gap-2 text-xs font-semibold ${isRight ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {isRight ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                      <span>
                        {isRight
                          ? `أَحْسَنْتَ! ${q.explanationIndo}`
                          : `حَاوِلْ مَرَّةً أُخْرَى — ${q.explanationIndo}`}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setEvalAnswers({});
                setEvalResults({});
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Evaluasi</span>
            </button>

            {(evalAllSolved || progress.completedDars[dars.id]) && (
              <button
                type="button"
                onClick={() => {
                  onCompleteDars(dars.id);
                  setStep('mahfuzhat');
                }}
                className="px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Lihat Mahfuzhat (Kata Mutiara)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* STEP 9: MAHFUZHAT / KATA MOTIVASI */}
      {step === 'mahfuzhat' && (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#FEF9C3] via-[#FFFDF7] to-[#E0F2FE] border-2 border-amber-300 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <AnimatedStar className="w-8 h-8 absolute top-6 left-8 pointer-events-none" />
          <AnimatedStar className="w-7 h-7 absolute top-10 right-10 pointer-events-none" color="#38BDF8" />
          <AnimatedStar className="w-6 h-6 absolute bottom-10 left-16 pointer-events-none" color="#C084FC" />

          <span className="text-xs font-extrabold tracking-widest uppercase text-amber-800">
            المَحْفُوظَاتُ · Kata Motivasi Dars {dars.id}
          </span>

          {/* Theme-specific required animations */}
          <div className="flex items-center justify-center gap-6 py-2">
            {dars.mahfuzhat.theme === 'stars-book' && (
              <>
                <AnimatedStar className="w-10 h-10" />
                <AnimatedOpenBook className="w-28 h-20" />
                <AnimatedStar className="w-10 h-10" color="#FB923C" />
              </>
            )}
            {dars.mahfuzhat.theme === 'lamp-book' && (
              <>
                <GlowingLampCartoon className="w-24 h-24" />
                <AnimatedOpenBook className="w-28 h-20" />
              </>
            )}
            {dars.mahfuzhat.theme === 'reading-stars' && (
              <>
                <AnimatedStar className="w-9 h-9" />
                <StudentRaisingHand variant="girl" className="w-24 h-28" />
                <AnimatedOpenBook className="w-24 h-20" />
                <AnimatedStar className="w-9 h-9" color="#A78BFA" />
              </>
            )}
          </div>

          <div dir="rtl" className="space-y-3">
            <h2 className="arabic-ruqaa text-4xl sm:text-5xl font-bold text-slate-900">
              {dars.mahfuzhat.arabic}
            </h2>
            <p dir="ltr" className="text-lg sm:text-xl font-bold text-sky-900 max-w-xl mx-auto">
              &ldquo;{dars.mahfuzhat.meaningIndo}&rdquo;
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() =>
                playArabicAudio(dars.mahfuzhat.arabic, { slow: true, volume: progress.volume })
              }
              className="px-5 py-2.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan Mahfuzhat</span>
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onBackDashboard}
              className="px-6 py-3.5 rounded-2xl bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-sm cursor-pointer"
            >
              Kembali ke Beranda
            </button>
            <button
              type="button"
              onClick={onGoNextDarsOrClosing}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>
                {dars.id < 3 ? `Lanjut ke Dars ${dars.id + 1}` : 'Buka Halaman Apresiasi Akhir'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
