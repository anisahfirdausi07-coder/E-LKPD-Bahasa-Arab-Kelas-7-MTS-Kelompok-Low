import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Volume2 } from 'lucide-react';
import {
  AnimatedOpenBook,
  AnimatedStar,
  CoinIcon,
  StudentRaisingHand,
  TrophyCartoon,
} from './CartoonIllustrations';
import { playArabicAudio } from '../utils/audio';

interface ClosingPageProps {
  coins: number;
  overallPercent: number;
  volume: number;
  onReturnHome: () => void;
}

export const ClosingPage: React.FC<ClosingPageProps> = ({
  coins,
  overallPercent,
  volume,
  onReturnHome,
}) => {
  useEffect(() => {
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.55 },
      colors: ['#38BDF8', '#FACC15', '#4ADE80', '#FB923C', '#C084FC'],
    });
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#FEF9C3] via-[#FFFDF7] to-[#DCFCE7] py-12 px-4 sm:px-6 min-h-[calc(100vh-140px)] flex items-center">
      <AnimatedStar className="w-9 h-9 absolute top-10 left-12 pointer-events-none" />
      <AnimatedStar className="w-7 h-7 absolute top-20 right-16 pointer-events-none" color="#38BDF8" />
      <AnimatedStar className="w-8 h-8 absolute bottom-16 left-20 pointer-events-none" color="#C084FC" />

      <div className="max-w-3xl mx-auto w-full bg-white/95 border-2 border-amber-300 rounded-3xl p-8 sm:p-10 text-center shadow-md space-y-6 relative z-10">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <StudentRaisingHand variant="boy" className="w-20 h-24 sm:w-24 sm:h-28" />
          <TrophyCartoon className="w-24 h-24 sm:w-28 sm:h-28" />
          <AnimatedOpenBook className="w-20 h-16 sm:w-24 sm:h-20" />
          <StudentRaisingHand variant="girl" className="w-20 h-24 sm:w-24 sm:h-28" />
        </div>

        <div dir="rtl" className="space-y-3">
          <h1 className="arabic-ruqaa text-4xl sm:text-5xl font-bold text-amber-600">
            مُبَارَكٌ!
          </h1>
          <p className="arabic-cairo text-2xl sm:text-3xl font-bold text-slate-900">
            لَقَدْ أَكْمَلْتَ جَمِيعَ الدُّرُوسِ!
          </p>
          <p className="arabic-amiri text-2xl sm:text-3xl font-bold text-emerald-700">
            أَنْتَ بَطَلٌ فِي تَعَلُّمِ اللُّغَةِ الْعَرَبِيَّةِ!
          </p>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() =>
              playArabicAudio(
                'مُبَارَكٌ! لَقَدْ أَكْمَلْتَ جَمِيعَ الدُّرُوسِ! أَنْتَ بَطَلٌ فِي تَعَلُّمِ اللُّغَةِ الْعَرَبِيَّةِ!',
                { volume },
              )
            }
            className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Dengarkan Ucapan Selamat</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col items-center">
            <CoinIcon className="w-9 h-9 mb-1" spinning />
            <p className="text-xs font-semibold text-amber-800">Total Koin</p>
            <p className="text-2xl font-extrabold text-amber-900 tabular-nums">{coins}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex flex-col items-center justify-center">
            <p className="text-xs font-semibold text-emerald-800">Penyelesaian</p>
            <p className="text-3xl font-extrabold text-emerald-700 tabular-nums mt-1">{overallPercent}%</p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onReturnHome}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white font-bold shadow-md flex items-center justify-center gap-3 mx-auto transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="arabic-cairo text-xl">إِعَادَةُ التَّعَلُّمِ</span>
            <span className="text-sm text-sky-100">(Kembali belajar)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
