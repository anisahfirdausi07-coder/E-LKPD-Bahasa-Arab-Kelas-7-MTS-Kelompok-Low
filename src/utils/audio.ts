// Client-side audio engine: Gemini TTS via /api/tts + Web Speech API fallback + Web Audio SFX

const clientAudioUrlCache = new Map<string, string>();
let activeAudioEl: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

export interface PlayArabicOptions {
  slow?: boolean;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export function stopArabicAudio(): void {
  if (activeAudioEl) {
    activeAudioEl.pause();
    activeAudioEl.currentTime = 0;
    activeAudioEl = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function pauseArabicAudio(): void {
  if (activeAudioEl && !activeAudioEl.paused) {
    activeAudioEl.pause();
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}

export function resumeArabicAudio(): boolean {
  if (activeAudioEl && activeAudioEl.paused && activeAudioEl.currentTime > 0 && !activeAudioEl.ended) {
    void activeAudioEl.play();
    return true;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    return true;
  }
  return false;
}

function playViaSpeechSynthesis(text: string, opts: PlayArabicOptions): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    opts.onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = opts.slow ? 0.65 : 0.85;
  utterance.volume = opts.volume ?? 0.9;

  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ar'));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  utterance.onstart = () => opts.onStart?.();
  utterance.onend = () => {
    activeUtterance = null;
    opts.onEnd?.();
  };
  utterance.onerror = () => {
    activeUtterance = null;
    opts.onEnd?.();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export async function playArabicAudio(text: string, opts: PlayArabicOptions = {}): Promise<void> {
  const cleanText = text.trim();
  if (!cleanText) return;

  stopArabicAudio();

  const slow = Boolean(opts.slow);
  const volume = opts.volume ?? 0.9;
  const cacheKey = `${slow ? 'slow' : 'norm'}:${cleanText}`;

  let blobUrl = clientAudioUrlCache.get(cacheKey);

  if (!blobUrl) {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, slow }),
      });

      if (res.ok) {
        const data = (await res.json()) as { audioBase64?: string; mimeType?: string };
        if (data.audioBase64) {
          const byteChars = atob(data.audioBase64);
          const byteNumbers = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: data.mimeType || 'audio/wav' });
          blobUrl = URL.createObjectURL(blob);
          clientAudioUrlCache.set(cacheKey, blobUrl);
        }
      }
    } catch {
      // Fallback to browser SpeechSynthesis below
    }
  }

  if (blobUrl) {
    try {
      const audio = new Audio(blobUrl);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.onplay = () => opts.onStart?.();
      audio.onended = () => {
        if (activeAudioEl === audio) activeAudioEl = null;
        opts.onEnd?.();
      };
      audio.onerror = () => {
        if (activeAudioEl === audio) activeAudioEl = null;
        playViaSpeechSynthesis(cleanText, opts);
      };
      activeAudioEl = audio;
      await audio.play();
      return;
    } catch {
      // Autoplay or decode issue -> fallback
    }
  }

  playViaSpeechSynthesis(cleanText, opts);
}

// Gentle Web Audio SFX for gamification feedback
export function playVictorySfx(enabled: boolean, volume = 0.8): void {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const start = ctx.currentTime + idx * 0.08;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.18 * volume, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.26);
    });
  } catch {
    // Ignore audio context blocked
  }
}

export function playRetrySfx(enabled: boolean, volume = 0.8): void {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.12 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Ignore
  }
}
