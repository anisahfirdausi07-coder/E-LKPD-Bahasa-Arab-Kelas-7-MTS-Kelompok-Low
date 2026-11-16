import React from 'react';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-amber-200/80 bg-gradient-to-r from-[#FFF7E6] via-[#F0F9FF] to-[#F3E8FF] py-8 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-sky-800">
          <BookOpen className="w-5 h-5" />
          <p className="arabic-amiri text-2xl font-bold tracking-wide">
            الْكِتَابُ الإِضَافِيُّ الإِلِكْتُرُونِيُّ
          </p>
        </div>

        <div className="pt-2">
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">AUTHOR:</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm font-semibold text-slate-800">
            <span>Prof. Dr. Muflihah, S. Ag., MA</span>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">•</span>
            <span>Dr. H. Taufik, S. Ag., M. Pd. I.</span>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">•</span>
            <span>Anisah Firdausi Nuzula</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
