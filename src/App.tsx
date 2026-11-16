import React, { useState } from 'react';
import { BookOpen, Home, HelpCircle, Volume2, Menu, X, Award } from 'lucide-react';
import { AppPage } from './types/learning';
import { DARS_LIST } from './data/curriculum';
import { useLearningProgress } from './hooks/useLearningProgress';
import { CoverPage } from './components/CoverPage';
import { DashboardPage } from './components/DashboardPage';
import { DarsWorkspace } from './components/DarsWorkspace';
import { CoinsPage } from './components/CoinsPage';
import { ClosingPage } from './components/ClosingPage';
import { Footer } from './components/Footer';
import { CoinCelebrationOverlay } from './components/CoinCelebrationOverlay';
import { HelpModal, SoundSettingsModal } from './components/Modals';
import { CoinIcon } from './components/CartoonIllustrations';

const DEFAULT_HELP_STEPS = [
  'Mulai belajar dengan memilih Dars 1, Dars 2, atau Dars 3 dari halaman Beranda.',
  'Ikuti tahapan belajar secara berurutan: Materi Singkat, Istima\' (Menyimak), Kalam (Berbicara), Qira\'ah (Membaca), Kitabah (Menulis), Evaluasi, hingga Mahfuzhat.',
  'Setiap jawaban benar memberimu +10 Koin! Menyelesaikan 1 Maharah memberi bonus +10 Koin, dan menuntaskan 1 Dars memberi bonus +30 Koin.',
  'Jangan khawatir jika salah—koinmu tidak akan berkurang dan kamu bisa mencoba lagi sepuasnya!',
];

export default function App() {
  const [page, setPage] = useState<AppPage>('cover');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpSteps, setHelpSteps] = useState<string[]>(DEFAULT_HELP_STEPS);
  const [soundOpen, setSoundOpen] = useState(false);

  const [celebrationState, setCelebrationState] = useState<{
    key: number;
    msgArabic: string;
    subIndo: string;
    withConfetti: boolean;
  }>({
    key: 0,
    msgArabic: '',
    subIndo: '',
    withConfetti: false,
  });

  const {
    progress,
    recordAnswer,
    completeMaharah,
    completeDars,
    setSoundEnabled,
    setVolume,
    resetProgress,
    getDarsProgressPercent,
    overallPercent,
    allDarsCompleted,
    accuracyPercent,
  } = useLearningProgress();

  const triggerCelebration = (msgArabic: string, subIndo: string, withConfetti = false) => {
    setCelebrationState((prev) => ({
      key: prev.key + 1,
      msgArabic,
      subIndo,
      withConfetti,
    }));
  };

  const navigateTo = (target: AppPage) => {
    setPage(target);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openHelpWithSteps = (steps: string[]) => {
    setHelpSteps(steps);
    setHelpOpen(true);
  };

  const activeDars =
    page === 'dars1'
      ? DARS_LIST[0]
      : page === 'dars2'
        ? DARS_LIST[1]
        : page === 'dars3'
          ? DARS_LIST[2]
          : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-slate-800">
      {/* Top Navigation Bar (clean 3-zone header when inside app, compact on cover) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-sky-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={() => navigateTo(page === 'cover' ? 'cover' : 'dashboard')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="arabic-cairo text-xl font-bold text-slate-900">هَيَّا نَتَعَلَّمُ!</span>
          </button>

          {/* Zone 2: Concise Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => navigateTo('dashboard')}
              className={`hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                page === 'dashboard' ? 'text-sky-700 underline underline-offset-4' : ''
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('dars1')}
              className={`hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                page === 'dars1' ? 'text-sky-700 underline underline-offset-4' : ''
              }`}
            >
              Dars 1
            </button>
            <button
              type="button"
              onClick={() => navigateTo('dars2')}
              className={`hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                page === 'dars2' ? 'text-sky-700 underline underline-offset-4' : ''
              }`}
            >
              Dars 2
            </button>
            <button
              type="button"
              onClick={() => navigateTo('dars3')}
              className={`hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                page === 'dars3' ? 'text-sky-700 underline underline-offset-4' : ''
              }`}
            >
              Dars 3
            </button>
            {allDarsCompleted && (
              <button
                type="button"
                onClick={() => navigateTo('closing')}
                className={`hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
                  page === 'closing' ? 'text-amber-700 underline underline-offset-4' : ''
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Apresiasi</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Coins & Utility Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('coins')}
              title="Lihat Total Koin & Progres"
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CoinIcon className="w-5 h-5" />
              <span className="text-xs font-extrabold text-amber-900 tabular-nums whitespace-nowrap">
                {progress.coins} Koin
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSoundOpen(true)}
              aria-label="Pengaturan suara"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hidden sm:flex items-center justify-center transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => openHelpWithSteps(DEFAULT_HELP_STEPS)}
              aria-label="Bantuan"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hidden sm:flex items-center justify-center transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Menu navigasi"
              className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex md:hidden items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sky-100 bg-white px-4 py-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigateTo('dashboard')}
                className="px-3 py-2.5 rounded-xl bg-sky-50 text-sky-900 text-xs font-bold text-left cursor-pointer"
              >
                Beranda
              </button>
              <button
                type="button"
                onClick={() => navigateTo('coins')}
                className="px-3 py-2.5 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold text-left cursor-pointer"
              >
                Total Koin ({overallPercent}%)
              </button>
              <button
                type="button"
                onClick={() => navigateTo('dars1')}
                className="px-3 py-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold text-left cursor-pointer"
              >
                Dars 1: التَّعَارُفُ
              </button>
              <button
                type="button"
                onClick={() => navigateTo('dars2')}
                className="px-3 py-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold text-left cursor-pointer"
              >
                Dars 2: الأَدَوَاتُ
              </button>
              <button
                type="button"
                onClick={() => navigateTo('dars3')}
                className="px-3 py-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold text-left cursor-pointer"
              >
                Dars 3: يَوْمِيَّاتُنَا
              </button>
              {allDarsCompleted && (
                <button
                  type="button"
                  onClick={() => navigateTo('closing')}
                  className="px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-bold text-left cursor-pointer"
                >
                  Halaman Apresiasi
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSoundOpen(true);
                }}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Suara</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openHelpWithSteps(DEFAULT_HELP_STEPS);
                }}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Bantuan</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {page === 'cover' && (
          <CoverPage onStartLearning={() => navigateTo('dashboard')} volume={progress.volume} />
        )}

        {page === 'dashboard' && (
          <DashboardPage
            coins={progress.coins}
            overallPercent={overallPercent}
            getDarsProgressPercent={getDarsProgressPercent}
            completedDars={progress.completedDars}
            allDarsCompleted={allDarsCompleted}
            volume={progress.volume}
            onNavigate={navigateTo}
            onOpenHelp={() => openHelpWithSteps(DEFAULT_HELP_STEPS)}
            onOpenSound={() => setSoundOpen(true)}
          />
        )}

        {activeDars && (
          <DarsWorkspace
            key={activeDars.id}
            dars={activeDars}
            progress={progress}
            darsProgressPercent={getDarsProgressPercent(activeDars.id)}
            onRecordAnswer={recordAnswer}
            onCompleteMaharah={completeMaharah}
            onCompleteDars={completeDars}
            onTriggerCelebration={triggerCelebration}
            onBackDashboard={() => navigateTo('dashboard')}
            onGoNextDarsOrClosing={() => {
              if (activeDars.id === 1) navigateTo('dars2');
              else if (activeDars.id === 2) navigateTo('dars3');
              else navigateTo('closing');
            }}
            onOpenHelp={openHelpWithSteps}
          />
        )}

        {page === 'coins' && (
          <CoinsPage
            progress={progress}
            accuracyPercent={accuracyPercent}
            overallPercent={overallPercent}
            getDarsProgressPercent={getDarsProgressPercent}
            onBackDashboard={() => navigateTo('dashboard')}
            onResetProgress={resetProgress}
          />
        )}

        {page === 'closing' && (
          <ClosingPage
            coins={progress.coins}
            overallPercent={overallPercent}
            volume={progress.volume}
            onReturnHome={() => navigateTo('dashboard')}
          />
        )}
      </main>

      {/* Elegant Author Footer */}
      <Footer />

      {/* Overlays & Modals */}
      <CoinCelebrationOverlay
        triggerKey={celebrationState.key}
        messageArabic={celebrationState.msgArabic}
        subMessageIndo={celebrationState.subIndo}
        withConfetti={celebrationState.withConfetti}
      />

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} steps={helpSteps} />

      <SoundSettingsModal
        isOpen={soundOpen}
        onClose={() => setSoundOpen(false)}
        soundEnabled={progress.soundEnabled}
        onToggleSound={setSoundEnabled}
        volume={progress.volume}
        onChangeVolume={setVolume}
      />
    </div>
  );
}
