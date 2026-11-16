import React, { useState } from 'react';
import { BookOpen, ArrowRight, CheckCircle2, Trophy, HelpCircle, Volume2, Award } from 'lucide-react';
import { DARS_LIST } from '../data/curriculum';
import { AppPage } from '../types/learning';
import {
  AnimatedCloud,
  AnimatedOpenBook,
  AnimatedStar,
  CoinIcon,
  StudentRaisingHand,
} from './CartoonIllustrations';
import { playArabicAudio } from '../utils/audio';

interface DashboardPageProps {
  coins: number;
  overallPercent: number;
  getDarsProgressPercent: (id: number) => number;
  completedDars: Record<number, boolean>;
  allDarsCompleted: boolean;
  volume: number;
  onNavigate: (page: AppPage) => void;
  onOpenHelp: () => void;
  onOpenSound: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  coins,
  overallPercent,
  getDarsProgressPercent,
  completedDars,
  allDarsCompleted,
  volume,
  onNavigate,
  onOpenHelp,
  onOpenSound,
}) => {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const accentMap = {
    blue: {
      cardBg: 'bg-gradient-to-b from-[#EFF8FF] to-white border-sky-200',
      numBg: 'bg-sky-100 text-sky-800',
      btn: 'bg-sky-600 hover:bg-sky-700 text-white',
      bar: 'bg-sky-500',
    },
    mint: {
      cardBg: 'bg-gradient-to-b from-[#ECFDF5] to-white border-emerald-200',
      numBg: 'bg-emerald-100 text-emerald-800',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      bar: 'bg-emerald-500',
    },
    lavender: {
      cardBg: 'bg-gradient-to-b from-[#F5F3FF] to-white border-violet-200',
      numBg: 'bg-violet-100 text-violet-800',
      btn: 'bg-violet-600 hover:bg-violet-700 text-white',
      bar: 'bg-violet-500',
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E0F2FE] via-[#FEF9C3] to-[#DCFCE7] border-2 border-sky-200 p-6 sm:p-8 shadow-xs">
        <AnimatedCloud className="w-24 absolute top-3 right-6 opacity-70 pointer-events-none" />
        <AnimatedStar className="w-6 h-6 absolute bottom-4 right-20 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-sky-200 flex items-center justify-center text-sky-700 shadow-xs shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div dir="rtl" className="text-right">
                <h1 className="arabic-cairo text-2xl sm:text-3xl font-bold text-slate-900">
                  مَرْحَبًا بِكَ يَا بَطَلُ!
                </h1>
                <p className="arabic-amiri text-xl sm:text-2xl font-bold text-sky-800">
                  هَيَّا نَتَعَلَّمُ اللُّغَةَ الْعَرَبِيَّةَ.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  playArabicAudio('مَرْحَبًا بِكَ يَا بَطَلُ! هَيَّا نَتَعَلَّمُ اللُّغَةَ الْعَرَبِيَّةَ.', {
                    volume,
                  })
                }
                aria-label="Putar sapaan"
                className="w-10 h-10 rounded-xl bg-white/90 hover:bg-white text-sky-700 border border-sky-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-700 max-w-2xl">
              Pilih salah satu pelajaran (Dars) di bawah ini untuk mulai menyimak, berbicara, membaca, menulis,
              dan mengumpulkan koin sebanyak-banyaknya!
            </p>

            {/* Quick Progress & Coins Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="bg-white/90 border border-sky-200 rounded-2xl px-4 py-2.5 flex items-center gap-3 min-w-[210px] flex-1 sm:flex-none">
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Progres Belajar</span>
                    <span className="tabular-nums text-sky-700">{overallPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${overallPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('coins')}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <CoinIcon className="w-7 h-7" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-amber-800">Total Koin</p>
                  <p className="text-base font-extrabold text-amber-900 tabular-nums">{coins} Koin</p>
                </div>
              </button>

              <button
                type="button"
                onClick={onOpenHelp}
                className="bg-white/90 hover:bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>Panduan</span>
              </button>

              <button
                type="button"
                onClick={onOpenSound}
                className="bg-white/90 hover:bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Suara</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center gap-3">
            <StudentRaisingHand variant="boy" className="w-24 h-28" />
            <AnimatedOpenBook className="w-24 h-20" />
            <StudentRaisingHand variant="girl" className="w-24 h-28" />
          </div>
        </div>
      </section>

      {/* Appreciation Unlocked Banner when all 3 Dars completed */}
      {allDarsCompleted && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-100 via-yellow-50 to-emerald-100 border-2 border-amber-300 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <p className="arabic-cairo text-xl font-bold text-slate-900">
                مُبَارَكٌ! لَقَدْ أَكْمَلْتَ جَمِيعَ الدُّرُوسِ!
              </p>
              <p className="text-sm text-slate-700">
                Kamu sudah menyelesaikan ketiga Dars! Lihat piala dan sertifikat pencapaianmu.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('closing')}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Award className="w-4 h-4" />
            <span>Lihat Apresiasi</span>
          </button>
        </div>
      )}

      {/* Three Main Dars Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Pilih Pelajaran (الدُّرُوسُ)</h2>
            <p className="text-sm text-slate-600">Pelajari secara berurutan dari Dars 1 hingga Dars 3</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DARS_LIST.map((dars) => {
            const theme = accentMap[dars.accentColor];
            const pct = getDarsProgressPercent(dars.id);
            const isDone = Boolean(completedDars[dars.id]);
            const targetPage = (`dars${dars.id}` as AppPage);

            return (
              <article
                key={dars.id}
                className={`rounded-3xl border-2 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all ${theme.cardBg}`}
              >
                <div className="space-y-4">
                  {/* Card Illustration */}
                  <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-100 aspect-[4/3]">
                    {!imgErrors[dars.id] ? (
                      <img
                        src={dars.imagePath}
                        alt={`Ilustrasi Dars ${dars.id}: ${dars.indoTitle}`}
                        referrerPolicy="no-referrer"
                        onError={() => setImgErrors((prev) => ({ ...prev, [dars.id]: true }))}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-sky-50">
                        <BookOpen className="w-12 h-12 text-sky-400" />
                      </div>
                    )}
                  </div>

                  {/* Metadata & Titles */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={`px-2.5 py-1 rounded-lg ${theme.numBg}`}>DARS {dars.id}</span>
                      {isDone ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          Selesai
                        </span>
                      ) : (
                        <span className="text-slate-500 tabular-nums">{pct}% Selesai</span>
                      )}
                    </div>

                    <div dir="rtl" className="text-right">
                      <h3 className="arabic-cairo text-2xl font-bold text-slate-900">{dars.arabicTitle}</h3>
                    </div>
                    <p className="font-display text-lg font-bold text-slate-800">{dars.indoTitle}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{dars.shortDesc}</p>
                  </div>
                </div>

                {/* Progress Bar & CTA */}
                <div className="pt-5 space-y-3">
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${theme.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate(targetPage)}
                    className={`w-full py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${theme.btn}`}
                  >
                    <span dir="rtl" className="arabic-naskh text-lg font-bold">
                      اِبْدَأِ الدَّرْسَ
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
