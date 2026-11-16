import React from 'react';
import { Volume2, VolumeX, X, HelpCircle, CheckCircle2 } from 'lucide-react';
import { playArabicAudio } from '../utils/audio';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  steps: string[];
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, title, steps }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Petunjuk Pengerjaan'}
        className="bg-[#FFFDF7] border-2 border-sky-200 rounded-3xl max-w-lg w-full p-6 shadow-xl"
      >
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-sky-100">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                {title || 'Petunjuk Pengerjaan'}
              </h3>
              <p className="text-xs text-slate-500">Panduan belajar mudah untuk siswa</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup bantuan"
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ul className="mt-4 space-y-3">
          {steps.map((step, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mengerti, Ayo Lanjut!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
}

export const SoundSettingsModal: React.FC<SoundSettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  volume,
  onChangeVolume,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pengaturan Suara"
        className="bg-[#FFFDF7] border-2 border-emerald-200 rounded-3xl max-w-md w-full p-6 shadow-xl"
      >
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Pengaturan Suara</h3>
              <p className="text-xs text-slate-500">Atur volume audio dan efek kemenangan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pengaturan suara"
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
            <div>
              <p className="font-semibold text-sm text-slate-900">Efek Suara Kemenangan</p>
              <p className="text-xs text-slate-600">Bunyi ceria saat menjawab benar</p>
            </div>
            <button
              type="button"
              onClick={() => onToggleSound(!soundEnabled)}
              className={`px-4 py-2 rounded-xl font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap ${
                soundEnabled
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {soundEnabled ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>

          <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="volume-slider" className="font-semibold text-sm text-slate-900">
                Volume Pelafalan Arab
              </label>
              <span className="text-xs font-bold text-sky-700 tabular-nums">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              id="volume-slider"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => playArabicAudio('السَّلَامُ عَلَيْكُمْ، هَيَّا نَتَعَلَّمُ!', { volume })}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-white border border-sky-200 hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Tes Audio Bahasa Arab</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
