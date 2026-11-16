import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CoinIcon } from './CartoonIllustrations';

interface CoinCelebrationOverlayProps {
  triggerKey: number;
  messageArabic?: string;
  subMessageIndo?: string;
  withConfetti?: boolean;
}

export const CoinCelebrationOverlay: React.FC<CoinCelebrationOverlayProps> = ({
  triggerKey,
  messageArabic = 'أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ',
  subMessageIndo = '+10 Koin ditambahkan!',
  withConfetti = false,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggerKey <= 0) return;
    setVisible(true);

    if (withConfetti) {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#38BDF8', '#FACC15', '#4ADE80', '#FB923C', '#C084FC'],
      });
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [triggerKey, withConfetti]);

  if (!visible) return null;

  const coinPositions = [10, 22, 35, 48, 62, 74, 88];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Falling Coins */}
      {coinPositions.map((left, idx) => (
        <div
          key={`${triggerKey}-${idx}`}
          className="absolute top-0 animate-fall-coin"
          style={{
            left: `${left}%`,
            animationDelay: `${idx * 90}ms`,
          }}
        >
          <CoinIcon className="w-9 h-9 drop-shadow-md" spinning />
        </div>
      ))}

      {/* Toast celebration banner */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-emerald-50 border-2 border-emerald-400 shadow-lg rounded-2xl px-6 py-3 flex items-center gap-3">
        <CoinIcon className="w-8 h-8 shrink-0" spinning />
        <div className="text-center">
          <p className="arabic-cairo text-xl font-bold text-emerald-800">{messageArabic}</p>
          <p className="text-xs font-semibold text-emerald-700">{subMessageIndo}</p>
        </div>
      </div>
    </div>
  );
};
