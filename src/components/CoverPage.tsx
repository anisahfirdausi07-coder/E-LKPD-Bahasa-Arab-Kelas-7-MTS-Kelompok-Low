import React, { useState } from 'react';
import { BookOpen, ArrowRight, Volume2 } from 'lucide-react';
import {
  AnimatedBalloon,
  AnimatedButterfly,
  AnimatedCloud,
  AnimatedOpenBook,
  AnimatedPencil,
  AnimatedStar,
  StudentRaisingHand,
} from './CartoonIllustrations';
import { playArabicAudio } from '../utils/audio';

interface CoverPageProps {
  onStartLearning: () => void;
  volume: number;
}

export const CoverPage: React.FC<CoverPageProps> = ({ onStartLearning, volume }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#E0F2FE] via-[#FFFDF7] to-[#FEF3C7] min-h-[calc(100vh-140px)] flex items-center py-10 px-4 sm:px-6 lg:px-10">
      {/* Animated Floating Decorations */}
      <AnimatedCloud className="w-28 sm:w-36 absolute top-6 left-6 opacity-85 pointer-events-none" />
      <AnimatedCloud className="w-24 sm:w-32 absolute top-14 right-10 opacity-80 pointer-events-none" />
      <AnimatedStar className="w-7 h-7 absolute top-24 left-[28%] pointer-events-none" />
      <AnimatedStar className="w-6 h-6 absolute bottom-20 left-[14%] pointer-events-none" color="#FB923C" />
      <AnimatedStar className="w-8 h-8 absolute top-20 right-[26%] pointer-events-none" color="#A78BFA" />
      <AnimatedButterfly className="w-12 h-12 absolute bottom-14 right-12 pointer-events-none hidden sm:block" />
      <AnimatedBalloon className="w-12 h-20 absolute top-1/3 left-4 pointer-events-none hidden lg:block" color="#BAE6FD" />
      <AnimatedBalloon className="w-10 h-16 absolute bottom-12 left-[42%] pointer-events-none hidden md:block" color="#FBCFE8" />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
        {/* Left/Top Column: Arabic Titles & Start CTA */}
        <div className="lg:col-span-6 text-center lg:text-right space-y-5 bg-white/80 backdrop-blur-xs border-2 border-sky-200/80 rounded-3xl p-6 sm:p-9 shadow-sm">
          {/* Small animated icons row */}
          <div className="flex items-center justify-center lg:justify-end gap-4">
            <AnimatedPencil className="w-11 h-11" />
            <AnimatedOpenBook className="w-14 h-11" />
            <button
              type="button"
              onClick={() =>
                playArabicAudio(
                  'هَيَّا نَتَعَلَّمُ! الْكِتَابُ الإِضَافِيُّ الإِلِكْتُرُونِيُّ لِتَعْلِيمِ اللُّغَةِ الْعَرَبِيَّةِ لِلصَّفِّ السَّابِعِ بِالْمَدْرَسَةِ الْمُتَوَسِّطَةِ',
                  { volume },
                )
              }
              title="Dengarkan judul"
              className="w-11 h-11 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Putar audio judul"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Exact required Arabic titles with distinct fonts */}
          <div className="space-y-3" dir="rtl">
            <h1 className="arabic-ruqaa text-4xl sm:text-5xl lg:text-6xl font-bold text-sky-700 py-1 drop-shadow-xs">
              هَيَّا نَتَعَلَّمُ!
            </h1>

            <p className="arabic-amiri text-2xl sm:text-3xl font-bold text-slate-900">
              الْكِتَابُ الإِضَافِيُّ الإِلِكْتُرُونِيُّ
            </p>

            <p className="arabic-tajawal text-xl sm:text-2xl font-bold text-emerald-700 py-0.5">
              لِتَعْلِيمِ اللُّغَةِ الْعَرَبِيَّةِ
            </p>

            <p className="arabic-naskh text-lg sm:text-xl font-semibold text-slate-700">
              لِلصَّفِّ السَّابِعِ بِالْمَدْرَسَةِ الْمُتَوَسِّطَةِ
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mr-0 lg:ml-auto">
            Petualangan belajar Bahasa Arab interaktif untuk siswa Kelas VII Madrasah Tsanawiyah.
            Dilengkapi audio pelafalan, latihan berbicara, permainan soal, dan koleksi koin!
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3">
            <button
              type="button"
              onClick={onStartLearning}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span dir="rtl" className="arabic-naskh text-2xl font-bold py-0.5">
                اِبْدَأِ التَّعَلُّمَ
              </span>
              <span className="text-sm font-semibold text-sky-100">(Mulai Belajar)</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Cartoon Illustration Frame */}
        <div className="lg:col-span-6 relative">
          <div className="relative bg-gradient-to-br from-[#FEF9C3] via-[#DCFCE7] to-[#E0F2FE] p-3 sm:p-4 rounded-3xl border-2 border-amber-200 shadow-md">
            <div className="relative overflow-hidden rounded-2xl bg-white aspect-[4/3]">
              {!imgError ? (
                <img
                  src="/src/assets/images/cover_students_1794836422285.jpg"
                  alt="Dua siswa Madrasah Tsanawiyah belajar Bahasa Arab bersama dengan buku dan pensil"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-sky-50 to-amber-50 p-6">
                  <div className="flex items-center gap-6">
                    <StudentRaisingHand variant="boy" className="w-28 h-28" />
                    <StudentRaisingHand variant="girl" className="w-28 h-28" />
                  </div>
                  <div className="flex items-center gap-2 text-sky-800 font-bold">
                    <BookOpen className="w-6 h-6" />
                    <span className="arabic-amiri text-2xl">اللُّغَةُ الْعَرَبِيَّةُ</span>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Chalkboard & Mascot Strip */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/90 rounded-2xl py-2 px-3 border border-sky-100">
                <p className="arabic-cairo text-base font-bold text-sky-800">٣ دُرُوسٍ</p>
                <p className="text-xs text-slate-600">3 Bab Lengkap</p>
              </div>
              <div className="bg-white/90 rounded-2xl py-2 px-3 border border-emerald-100">
                <p className="arabic-cairo text-base font-bold text-emerald-700">٤ مَهَارَاتٍ</p>
                <p className="text-xs text-slate-600">4 Maharah Aktif</p>
              </div>
              <div className="bg-white/90 rounded-2xl py-2 px-3 border border-amber-100">
                <p className="arabic-cairo text-base font-bold text-amber-700">جَمْعُ النُّقُودِ</p>
                <p className="text-xs text-slate-600">Kumpulkan Koin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
