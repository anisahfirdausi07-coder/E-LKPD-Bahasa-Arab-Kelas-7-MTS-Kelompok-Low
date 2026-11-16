import React from 'react';

export const AnimatedCloud: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 120 70" className={`animate-drift-cloud ${className}`} aria-hidden="true">
    <path
      d="M28 56h64a16 16 0 0 0 2-32 22 22 0 0 0-42-6 18 18 0 0 0-24 14 14 14 0 0 0 0 24z"
      fill="#FFFFFF"
      fillOpacity="0.9"
      stroke="#BAE6FD"
      strokeWidth="2"
    />
  </svg>
);

export const AnimatedStar: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#FACC15',
}) => (
  <svg viewBox="0 0 40 40" className={`animate-twinkle-star ${className}`} aria-hidden="true">
    <path
      d="M20 3l4.9 10.6L36 15.2l-8.1 7.9 2 11.4L20 29l-9.9 5.5 2-11.4L4 15.2l11.1-1.6z"
      fill={color}
      stroke="#EAB308"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const AnimatedButterfly: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 64 56" className={`animate-fly-butterfly ${className}`} aria-hidden="true">
    <ellipse cx="20" cy="22" rx="14" ry="11" transform="rotate(-20 20 22)" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1.5" />
    <ellipse cx="44" cy="22" rx="14" ry="11" transform="rotate(20 44 22)" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1.5" />
    <ellipse cx="22" cy="36" rx="10" ry="8" transform="rotate(15 22 36)" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
    <ellipse cx="42" cy="36" rx="10" ry="8" transform="rotate(-15 42 36)" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
    <rect x="30" y="16" width="4" height="24" rx="2" fill="#475569" />
    <path d="M31 16c-3-6-7-7-9-5M33 16c3-6 7-7 9-5" stroke="#475569" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

export const AnimatedBalloon: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#7DD3FC',
}) => (
  <svg viewBox="0 0 60 95" className={`animate-float-balloon ${className}`} aria-hidden="true">
    <ellipse cx="30" cy="30" rx="22" ry="26" fill={color} stroke="#0284C7" strokeWidth="2" />
    <ellipse cx="22" cy="22" rx="5" ry="9" fill="#FFFFFF" fillOpacity="0.45" transform="rotate(-18 22 22)" />
    <polygon points="30,56 25,62 35,62" fill={color} stroke="#0284C7" strokeWidth="1.5" />
    <path d="M30 62c-4 10 5 16 0 28" stroke="#94A3B8" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

export const AnimatedOpenBook: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 110 80" className={`animate-sway-book ${className}`} aria-hidden="true">
    <path d="M12 18c16-6 33-3 43 6v44c-10-7-27-10-43-4z" fill="#FEF9C3" stroke="#0284C7" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M98 18c-16-6-33-3-43 6v44c10-7 27-10 43-4z" fill="#FFFBEB" stroke="#0284C7" strokeWidth="2.5" strokeLinejoin="round" />
    <line x1="22" y1="30" x2="45" y2="33" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="22" y1="40" x2="45" y2="43" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="22" y1="50" x2="40" y2="52" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="65" y1="33" x2="88" y2="30" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="65" y1="43" x2="88" y2="40" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="70" y1="52" x2="88" y2="50" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const AnimatedPencil: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 80 80" className={`animate-write-pencil ${className}`} aria-hidden="true">
    <g transform="rotate(35 40 40)">
      <rect x="31" y="10" width="18" height="44" rx="3" fill="#FACC15" stroke="#B45309" strokeWidth="2" />
      <rect x="31" y="8" width="18" height="9" rx="3" fill="#FDA4AF" stroke="#BE123C" strokeWidth="2" />
      <rect x="31" y="16" width="18" height="4" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
      <polygon points="31,54 49,54 40,70" fill="#FDE68A" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="37,64 43,64 40,70" fill="#334155" />
    </g>
  </svg>
);

export const GlowingLampCartoon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 90 100" className={`animate-lamp-glow ${className}`} aria-hidden="true">
    <circle cx="45" cy="38" r="28" fill="#FEF08A" fillOpacity="0.65" />
    <path d="M27 38a18 18 0 1 1 36 0c0 8-5 13-8 19H35c-3-6-8-11-8-19z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
    <rect x="35" y="57" width="20" height="8" rx="2" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
    <rect x="38" y="65" width="14" height="6" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
    <path d="M40 42l5-10 5 10" stroke="#B45309" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CoinIcon: React.FC<{ className?: string; spinning?: boolean }> = ({
  className = 'w-6 h-6',
  spinning = false,
}) => (
  <svg viewBox="0 0 40 40" className={`${spinning ? 'animate-spin-coin' : ''} ${className}`} aria-hidden="true">
    <circle cx="20" cy="20" r="17" fill="#FACC15" stroke="#B45309" strokeWidth="2.5" />
    <circle cx="20" cy="20" r="12" fill="#FEF08A" stroke="#D97706" strokeWidth="1.5" />
    <path d="M20 11l2.4 5 5.6.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.6-.8z" fill="#D97706" />
  </svg>
);

export const TrophyCartoon: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <path d="M26 24H14c0 16 6 24 16 25" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
    <path d="M74 24h12c0 16-6 24-16 25" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
    <path d="M26 18h48v20c0 15-10 25-24 25S26 53 26 38V18z" fill="#FACC15" stroke="#B45309" strokeWidth="3" strokeLinejoin="round" />
    <rect x="44" y="63" width="12" height="14" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
    <rect x="30" y="77" width="40" height="10" rx="4" fill="#B45309" />
    <path d="M50 28l3 6.5 7 1-5 5 1.2 7-6.2-3.3-6.2 3.3 1.2-7-5-5 7-1z" fill="#FEF9C3" />
  </svg>
);

export const StudentRaisingHand: React.FC<{ variant?: 'boy' | 'girl'; className?: string }> = ({
  variant = 'boy',
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 100 110" className={className} aria-hidden="true">
    {/* Raised arm */}
    <path d="M72 68c10-12 13-25 11-36" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" fill="none" />
    <circle cx="83" cy="30" r="5" fill="#FDBA74" />
    {/* Torso */}
    <path d="M28 66h44l5 36H23z" fill={variant === 'boy' ? '#38BDF8' : '#C084FC'} stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Book in left hand */}
    <rect x="14" y="66" width="24" height="28" rx="3" fill="#FEF08A" stroke="#B45309" strokeWidth="2" />
    <line x1="20" y1="74" x2="32" y2="74" stroke="#B45309" strokeWidth="2" />
    <line x1="20" y1="81" x2="32" y2="81" stroke="#B45309" strokeWidth="2" />
    {/* Head */}
    {variant === 'girl' && (
      <path d="M26 42c0-18 11-28 24-28s24 10 24 28v24H26z" fill="#F9A8D4" stroke="#334155" strokeWidth="2.5" />
    )}
    <circle cx="50" cy="42" r="18" fill="#FDBA74" stroke="#334155" strokeWidth="2.5" />
    {variant === 'boy' && (
      <path d="M32 30c2-11 10-16 18-16s16 5 18 16H32z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
    )}
    {/* Eyes & smile */}
    <circle cx="43" cy="41" r="2.3" fill="#1E293B" />
    <circle cx="57" cy="41" r="2.3" fill="#1E293B" />
    <path d="M43 49c3 4 11 4 14 0" stroke="#9A3412" strokeWidth="2.3" fill="none" strokeLinecap="round" />
  </svg>
);

export const VocabCartoon: React.FC<{ id: string; className?: string }> = ({ id, className = 'w-16 h-16' }) => {
  switch (id) {
    case 'kitab':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="16" y="12" width="48" height="56" rx="6" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="2.5" />
          <rect x="22" y="12" width="8" height="56" fill="#2563EB" />
          <rect x="34" y="24" width="22" height="12" rx="3" fill="#FEF9C3" />
          <line x1="36" y1="46" x2="54" y2="46" stroke="#DBEAFE" strokeWidth="3" strokeLinecap="round" />
          <line x1="36" y1="54" x2="50" y2="54" stroke="#DBEAFE" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'qalam':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <g transform="rotate(35 40 40)">
            <rect x="33" y="12" width="14" height="44" rx="4" fill="#FBBF24" stroke="#92400E" strokeWidth="2.5" />
            <rect x="33" y="12" width="14" height="12" rx="3" fill="#F87171" stroke="#991B1B" strokeWidth="2" />
            <polygon points="33,56 47,56 40,70" fill="#FDE68A" stroke="#92400E" strokeWidth="2" />
            <polygon points="38,65 42,65 40,70" fill="#1E293B" />
          </g>
        </svg>
      );
    case 'daftar':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="18" y="12" width="46" height="56" rx="5" fill="#A7F3D0" stroke="#065F46" strokeWidth="2.5" />
          <circle cx="18" cy="22" r="4" fill="#475569" />
          <circle cx="18" cy="34" r="4" fill="#475569" />
          <circle cx="18" cy="46" r="4" fill="#475569" />
          <circle cx="18" cy="58" r="4" fill="#475569" />
          <rect x="28" y="24" width="26" height="10" rx="2" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
        </svg>
      );
    case 'mistarah':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <g transform="rotate(-25 40 40)">
            <rect x="10" y="28" width="60" height="22" rx="4" fill="#FDE047" stroke="#A16207" strokeWidth="2.5" />
            {[18, 26, 34, 42, 50, 58, 64].map((x) => (
              <line key={x} x1={x} y1="28" x2={x} y2="36" stroke="#A16207" strokeWidth="2" />
            ))}
          </g>
        </svg>
      );
    case 'haqibah':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <path d="M30 18c0-6 20-6 20 0" fill="none" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" />
          <rect x="18" y="20" width="44" height="48" rx="12" fill="#38BDF8" stroke="#0369A1" strokeWidth="2.5" />
          <rect x="25" y="42" width="30" height="18" rx="6" fill="#BAE6FD" stroke="#0369A1" strokeWidth="2" />
          <circle cx="40" cy="48" r="3" fill="#FACC15" />
        </svg>
      );
    case 'mimhah':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <g transform="rotate(-15 40 40)">
            <rect x="16" y="26" width="32" height="28" rx="5" fill="#F9A8D4" stroke="#9D174D" strokeWidth="2.5" />
            <rect x="44" y="26" width="20" height="28" rx="4" fill="#93C5FD" stroke="#1E40AF" strokeWidth="2.5" />
          </g>
        </svg>
      );
    case 'mibrah':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="18" y="22" width="44" height="36" rx="8" fill="#C4B5FD" stroke="#5B21B6" strokeWidth="2.5" />
          <circle cx="34" cy="40" r="8" fill="#475569" />
          <rect x="46" y="30" width="10" height="20" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
        </svg>
      );
    case 'sabburah':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="10" y="16" width="60" height="42" rx="4" fill="#15803D" stroke="#92400E" strokeWidth="4" />
          <line x1="22" y1="30" x2="54" y2="30" stroke="#FEF9C3" strokeWidth="3" strokeLinecap="round" />
          <line x1="22" y1="42" x2="44" y2="42" stroke="#FEF9C3" strokeWidth="3" strokeLinecap="round" />
          <rect x="34" y="58" width="12" height="5" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
        </svg>
      );
    case 'kursi':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="24" y="14" width="32" height="24" rx="4" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.5" />
          <rect x="20" y="42" width="40" height="8" rx="3" fill="#FB923C" stroke="#9A3412" strokeWidth="2.5" />
          <line x1="25" y1="50" x2="25" y2="68" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
          <line x1="55" y1="50" x2="55" y2="68" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
          <line x1="26" y1="38" x2="26" y2="42" stroke="#9A3412" strokeWidth="3" />
          <line x1="54" y1="38" x2="54" y2="42" stroke="#9A3412" strokeWidth="3" />
        </svg>
      );
    case 'maktab':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="10" y="24" width="60" height="10" rx="3" fill="#FBBF24" stroke="#78350F" strokeWidth="2.5" />
          <rect x="16" y="34" width="48" height="12" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
          <line x1="18" y1="46" x2="18" y2="66" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <line x1="62" y1="46" x2="62" y2="66" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'wake-up':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <circle cx="40" cy="40" r="26" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" />
          <circle cx="24" cy="18" r="7" fill="#F87171" stroke="#991B1B" strokeWidth="2" />
          <circle cx="56" cy="18" r="7" fill="#F87171" stroke="#991B1B" strokeWidth="2" />
          <circle cx="40" cy="40" r="20" fill="#FFFFFF" />
          <line x1="40" y1="40" x2="40" y2="26" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="40" x2="50" y2="44" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'bath':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <path d="M14 42h52v8c0 10-8 16-26 16S14 60 14 50z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2.5" />
          <circle cx="30" cy="28" r="7" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="44" cy="22" r="9" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="56" cy="30" r="6" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" />
        </svg>
      );
    case 'breakfast':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <circle cx="36" cy="46" r="22" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2.5" />
          <circle cx="36" cy="46" r="14" fill="#FDE68A" />
          <ellipse cx="36" cy="46" rx="7" ry="5" fill="#FB923C" />
          <rect x="56" y="24" width="14" height="24" rx="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
        </svg>
      );
    case 'go-school':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <polygon points="40,12 14,32 66,32" fill="#F87171" stroke="#991B1B" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="18" y="32" width="44" height="34" fill="#FEF3C7" stroke="#B45309" strokeWidth="2.5" />
          <rect x="34" y="44" width="12" height="22" rx="2" fill="#60A5FA" stroke="#1E40AF" strokeWidth="2" />
          <circle cx="40" cy="24" r="4" fill="#FEF08A" />
        </svg>
      );
    case 'study':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <path d="M12 24c14-5 24-2 28 5v32c-6-6-16-8-28-3z" fill="#FEF9C3" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M68 24c-14-5-24-2-28 5v32c6-6 16-8 28-3z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <circle cx="56" cy="20" r="8" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
        </svg>
      );
    case 'read':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="16" y="18" width="48" height="44" rx="6" fill="#DDD6FE" stroke="#6D28D9" strokeWidth="2.5" />
          <line x1="40" y1="18" x2="40" y2="62" stroke="#6D28D9" strokeWidth="2" />
          <line x1="22" y1="30" x2="34" y2="30" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="38" x2="34" y2="38" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="30" x2="58" y2="30" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="38" x2="58" y2="38" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'play':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <circle cx="40" cy="40" r="24" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
          <polygon points="40,26 48,32 45,42 35,42 32,32" fill="#059669" />
          <line x1="40" y1="16" x2="40" y2="26" stroke="#059669" strokeWidth="2" />
          <line x1="48" y1="32" x2="62" y2="30" stroke="#059669" strokeWidth="2" />
          <line x1="32" y1="32" x2="18" y2="30" stroke="#059669" strokeWidth="2" />
        </svg>
      );
    case 'sleep':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <circle cx="40" cy="40" r="26" fill="#312E81" />
          <path d="M44 22a16 16 0 1 0 16 24 14 14 0 0 1-16-24z" fill="#FEF08A" />
          <circle cx="56" cy="24" r="2.5" fill="#FDE047" />
          <circle cx="24" cy="28" r="2" fill="#FDE047" />
        </svg>
      );
    case 'name-tag':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="12" y="22" width="56" height="36" rx="8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="18" y="36" width="44" height="16" rx="4" fill="#FFFFFF" />
          <circle cx="40" cy="28" r="3" fill="#0284C7" />
        </svg>
      );
    case 'map-pin':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <path d="M40 12c-12 0-20 9-20 20 0 15 20 36 20 36s20-21 20-36c0-11-8-20-20-20z" fill="#FDA4AF" stroke="#BE123C" strokeWidth="2.5" />
          <circle cx="40" cy="32" r="8" fill="#FFFFFF" stroke="#BE123C" strokeWidth="2" />
        </svg>
      );
    case 'house':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <polygon points="40,14 12,38 68,38" fill="#FB923C" stroke="#9A3412" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="20" y="38" width="40" height="28" fill="#FEF3C7" stroke="#9A3412" strokeWidth="2.5" />
          <rect x="34" y="48" width="12" height="18" fill="#93C5FD" stroke="#1E40AF" strokeWidth="2" />
        </svg>
      );
    case 'classroom':
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="14" y="16" width="52" height="30" rx="4" fill="#34D399" stroke="#065F46" strokeWidth="2.5" />
          <text x="40" y="37" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">٧</text>
          <rect x="24" y="52" width="32" height="14" rx="3" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
        </svg>
      );
    case 'girl-student':
    case 'this-girl':
      return <StudentRaisingHand variant="girl" className={className} />;
    default:
      return <StudentRaisingHand variant="boy" className={className} />;
  }
};
