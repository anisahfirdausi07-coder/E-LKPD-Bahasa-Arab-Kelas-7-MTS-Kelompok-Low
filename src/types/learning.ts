export type AppPage = 'cover' | 'dashboard' | 'dars1' | 'dars2' | 'dars3' | 'coins' | 'closing';

export type DarsStep =
  | 'intro'
  | 'tujuan'
  | 'materi'
  | 'istima'
  | 'kalam'
  | 'qiraah'
  | 'kitabah'
  | 'evaluasi'
  | 'mahfuzhat';

export type MaharahKey = 'istima' | 'kalam' | 'qiraah' | 'kitabah';

export interface VocabItem {
  id: string;
  arabic: string;
  indonesian: string;
  illustrationId: string;
  note?: string;
}

export interface IstimaQuestion {
  id: string;
  audioText: string; // Spoken by TTS, NEVER shown to student before answering
  questionAudioPrompt: string; // Also spoken in audio
  options: Array<{
    key: string; // أ, ب, ج, د
    arabic: string;
    illustrationId?: string;
  }>;
  correctKey: string;
  explanationIndo: string;
}

export interface MatchingItem {
  id: string;
  questionArabic: string;
  correctAnswerArabic: string;
}

export interface QiraahMcQuestion {
  id: string;
  questionArabic: string;
  options: Array<{ key: string; arabic: string }>;
  correctKey: string;
  explanationIndo: string;
}

export interface KitabahQuestion {
  id: string;
  type: 'fill-blank' | 'picture-sentence';
  promptIndo: string;
  sentenceBefore?: string;
  sentenceAfter?: string;
  illustrationId?: string;
  wordChips: string[];
  acceptedKeywords: string[]; // Normalized tokens/variants accepted
  sampleAnswer: string;
  explanationIndo: string;
}

export interface EvaluasiQuestion {
  id: string;
  questionArabic: string;
  illustrationId?: string;
  options: Array<{ key: string; arabic: string }>;
  correctKey: string;
  explanationIndo: string;
}

export interface DarsData {
  id: 1 | 2 | 3;
  arabicTitle: string;
  indoTitle: string;
  shortDesc: string;
  imagePath: string;
  accentColor: 'blue' | 'mint' | 'lavender';
  objectives: string[];
  materiIntroIndo: string;
  vocab: VocabItem[];
  grammarTitle: string;
  grammarExplanationIndo: string;
  grammarExamples: Array<{ arabic: string; indo: string; audio: string }>;
  dialogueExamples?: Array<{ speakerA: string; speakerB: string; indo: string }>;
  dailyOrder?: Array<{ timeLabel: string; arabic: string; indo: string; illustrationId: string }>;
  istimaQuestions: IstimaQuestion[];
  kalamStarter: {
    greeting: string;
    firstQuestion: string;
    turns: Array<{ prompt: string; hintArabic: string; hintIndo: string }>;
  };
  qiraah: {
    titleArabic: string;
    passageArabic: string;
    passageIndoHint: string;
    matchingPairs: MatchingItem[];
    mcQuestions?: QiraahMcQuestion[];
  };
  kitabahQuestions: KitabahQuestion[];
  evaluasiQuestions: EvaluasiQuestion[];
  mahfuzhat: {
    arabic: string;
    meaningIndo: string;
    theme: 'stars-book' | 'lamp-book' | 'reading-stars';
  };
}

export interface LearningProgress {
  coins: number;
  correctAnswersCount: number;
  totalAttemptsCount: number;
  rewardedQuestionIds: string[];
  completedMaharah: Record<string, boolean>; // e.g., "dars1-istima": true
  completedDars: Record<number, boolean>; // e.g., 1: true
  soundEnabled: boolean;
  volume: number; // 0 to 1
}
