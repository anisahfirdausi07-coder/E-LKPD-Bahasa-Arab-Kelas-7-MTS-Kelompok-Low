import React from 'react';
import { Award, CheckCircle2, Lock, RotateCcw, ArrowLeft } from 'lucide-react';
import { BADGES, DARS_LIST } from '../data/curriculum';
import { LearningProgress, MaharahKey } from '../types/learning';
import { CoinIcon, AnimatedStar } from './CartoonIllustrations';

interface CoinsPageProps {
  progress: LearningProgress;
  accuracyPercent: number;
  overallPercent: number;
  getDarsProgressPercent: (id: number) => number;
  onBackDashboard: () => void;
  onResetProgress: () => void;
}

const MAHARAH_LABELS: Record<MaharahKey, { arabic: string; indo: string }> = {
  istima: { arabic: 'الاسْتِمَاعُ', indo: "Istima' (Menyimak)" },
  kalam: { arabic: 'الْكَلَامُ', indo: 'Kalam (Berbicara)' },
  qiraah: { arabic: 'الْقِرَاءَةُ', indo: "Qira'ah (Membaca)" },
  kitabah: { arabic: 'الْكِتَابَةُ', indo: 'Kitabah (Menulis)' },
};

export const CoinsPage: React.FC<CoinsPageProps> = ({
  progress,
  accuracyPercent,
  overallPercent,
  getDarsProgressPercent,
  onBackDashboard,
  onResetProgress,
}) => {
  const completedMaharahCount = Object.values(progress.completedMaharah).filter(Boolean).length;
  const completedDarsCount = Object.values(progress.completedDars).filter(Boolean).length;

  const isBadgeUnlocked = (badge: (typeof BADGES)[number]): boolean => {
    if (badge.requirementType === 'coins') return progress.coins >= badge.threshold;
    if (badge.requirementType === 'maharah') return completedMaharahCount >= badge.threshold;
    return completedDarsCount >= badge.threshold;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#FEF9C3] via-[#FFF7ED] to-[#E0F2FE] border-2 border-amber-300 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center shrink-0">
            <CoinIcon className="w-11 h-11" spinning />
          </div>
          <div>
            <h1 className="arabic-cairo text-3xl font-bold text-slate-900">مَجْمُوعُ النُّقُودِ</h1>
            <p className="text-sm text-slate-700 font-medium">
              Rekap Koin, Progres Belajar, dan Lencana Penghargaan Siswa
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackDashboard}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500">Total Koin</p>
          <p className="mt-1 text-3xl font-extrabold text-amber-600 tabular-nums">{progress.coins}</p>
          <p className="mt-1 text-xs text-slate-600">Koin terkumpul</p>
        </div>

        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500">Persentase Jawaban Benar</p>
          <p className="mt-1 text-3xl font-extrabold text-emerald-600 tabular-nums">{accuracyPercent}%</p>
          <p className="mt-1 text-xs text-slate-600 tabular-nums">
            {progress.correctAnswersCount} dari {progress.totalAttemptsCount} percobaan
          </p>
        </div>

        <div className="bg-white border-2 border-sky-200 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500">Latihan Diselesaikan</p>
          <p className="mt-1 text-3xl font-extrabold text-sky-600 tabular-nums">
            {progress.rewardedQuestionIds.length}
          </p>
          <p className="mt-1 text-xs text-slate-600">Soal terjawab benar</p>
        </div>

        <div className="bg-white border-2 border-violet-200 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500">Total Progres Belajar</p>
          <p className="mt-1 text-3xl font-extrabold text-violet-600 tabular-nums">{overallPercent}%</p>
          <p className="mt-1 text-xs text-slate-600 tabular-nums">{completedDarsCount} / 3 Dars tuntas</p>
        </div>
      </div>

      {/* Progress per Dars & Maharah */}
      <section className="bg-white border-2 border-sky-100 rounded-3xl p-6 space-y-5">
        <h2 className="font-display text-xl font-bold text-slate-900">Progres Setiap Dars & Maharah</h2>
        <div className="space-y-5">
          {DARS_LIST.map((dars) => {
            const pct = getDarsProgressPercent(dars.id);
            return (
              <div key={dars.id} className="rounded-2xl bg-slate-50/80 border border-slate-200 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800">
                      Dars {dars.id}
                    </span>
                    <span className="arabic-cairo text-lg font-bold text-slate-900">{dars.arabicTitle}</span>
                    <span className="text-sm text-slate-600">({dars.indoTitle})</span>
                  </div>
                  <span className="text-sm font-bold text-sky-700 tabular-nums">{pct}%</span>
                </div>

                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {(['istima', 'kalam', 'qiraah', 'kitabah'] as MaharahKey[]).map((mKey) => {
                    const done = Boolean(progress.completedMaharah[`dars${dars.id}-${mKey}`]);
                    return (
                      <div
                        key={mKey}
                        className={`rounded-xl px-3 py-2 border text-xs flex items-center justify-between gap-2 ${
                          done
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                            : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        <div>
                          <p className="arabic-cairo text-sm font-bold">{MAHARAH_LABELS[mKey].arabic}</p>
                          <p>{MAHARAH_LABELS[mKey].indo}</p>
                        </div>
                        {done && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Award Badges */}
      <section className="bg-white border-2 border-amber-200 rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-2.5">
          <Award className="w-6 h-6 text-amber-600" />
          <h2 className="font-display text-xl font-bold text-slate-900">Badge Penghargaan (الأَوْسِمَةُ)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const unlocked = isBadgeUnlocked(badge);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl border-2 p-5 text-center space-y-2 transition-all ${
                  unlocked
                    ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-70'
                }`}
              >
                <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center bg-white border border-amber-200">
                  {unlocked ? (
                    <AnimatedStar className="w-8 h-8" color="#FACC15" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <p className="arabic-cairo text-xl font-bold text-slate-900">{badge.arabic}</p>
                <p className="text-sm font-bold text-amber-800">{badge.indo}</p>
                <p className="text-xs text-slate-600">{badge.desc}</p>
                <p className="text-xs font-bold pt-1">
                  {unlocked ? (
                    <span className="text-emerald-700">Terbuka!</span>
                  ) : (
                    <span className="text-slate-500">Belum terbuka</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safe Progress Reset Option */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            onResetProgress();
          }}
          className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Semua Progres & Koin</span>
        </button>
      </div>
    </div>
  );
};
