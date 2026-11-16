import { useCallback, useEffect, useRef, useState } from 'react';
import { LearningProgress, MaharahKey } from '../types/learning';

const STORAGE_KEY = 'e_lkpd_arab_mts7_v1';

const DEFAULT_PROGRESS: LearningProgress = {
  coins: 0,
  correctAnswersCount: 0,
  totalAttemptsCount: 0,
  rewardedQuestionIds: [],
  completedMaharah: {},
  completedDars: {},
  soundEnabled: true,
  volume: 0.9,
};

function loadProgress(): LearningProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      rewardedQuestionIds: Array.isArray(parsed.rewardedQuestionIds) ? parsed.rewardedQuestionIds : [],
      completedMaharah: parsed.completedMaharah ?? {},
      completedDars: parsed.completedDars ?? {},
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useLearningProgress() {
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);
  const progressRef = useRef<LearningProgress>(progress);

  useEffect(() => {
    progressRef.current = progress;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  // Award +10 coins only once per unique questionId, never subtract coins
  const recordAnswer = useCallback((questionId: string, isCorrect: boolean): { coinEarned: number } => {
    const current = progressRef.current;
    const alreadyRewarded = current.rewardedQuestionIds.includes(questionId);
    const earned = isCorrect && !alreadyRewarded ? 10 : 0;

    setProgress((prev) => {
      const prevRewarded = prev.rewardedQuestionIds.includes(questionId);
      const safeEarned = isCorrect && !prevRewarded ? 10 : 0;
      const updated: LearningProgress = {
        ...prev,
        coins: prev.coins + safeEarned,
        correctAnswersCount: prev.correctAnswersCount + (isCorrect ? 1 : 0),
        totalAttemptsCount: prev.totalAttemptsCount + 1,
        rewardedQuestionIds:
          isCorrect && !prevRewarded
            ? [...prev.rewardedQuestionIds, questionId]
            : prev.rewardedQuestionIds,
      };
      progressRef.current = updated;
      return updated;
    });

    return { coinEarned: earned };
  }, []);

  // Award +10 bonus coins when completing a maharah for the first time
  const completeMaharah = useCallback((darsId: number, maharah: MaharahKey): { bonusEarned: number } => {
    const key = `dars${darsId}-${maharah}`;
    const alreadyDone = Boolean(progressRef.current.completedMaharah[key]);
    const bonus = alreadyDone ? 0 : 10;

    setProgress((prev) => {
      if (prev.completedMaharah[key]) return prev;
      const updated: LearningProgress = {
        ...prev,
        coins: prev.coins + 10,
        completedMaharah: { ...prev.completedMaharah, [key]: true },
      };
      progressRef.current = updated;
      return updated;
    });

    return { bonusEarned: bonus };
  }, []);

  // Award +30 bonus coins when completing a dars for the first time
  const completeDars = useCallback((darsId: number): { bonusEarned: number } => {
    const alreadyDone = Boolean(progressRef.current.completedDars[darsId]);
    const bonus = alreadyDone ? 0 : 30;

    setProgress((prev) => {
      if (prev.completedDars[darsId]) return prev;
      const updated: LearningProgress = {
        ...prev,
        coins: prev.coins + 30,
        completedDars: { ...prev.completedDars, [darsId]: true },
      };
      progressRef.current = updated;
      return updated;
    });

    return { bonusEarned: bonus };
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setProgress((prev) => ({ ...prev, soundEnabled: enabled }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setProgress((prev) => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const resetProgress = useCallback(() => {
    progressRef.current = DEFAULT_PROGRESS;
    setProgress(DEFAULT_PROGRESS);
  }, []);

  const getDarsProgressPercent = useCallback(
    (darsId: number) => {
      const keys: MaharahKey[] = ['istima', 'kalam', 'qiraah', 'kitabah'];
      const doneMaharah = keys.filter((k) => progress.completedMaharah[`dars${darsId}-${k}`]).length;
      const doneEval = progress.completedDars[darsId] ? 1 : 0;
      return Math.round(((doneMaharah + doneEval) / 5) * 100);
    },
    [progress.completedDars, progress.completedMaharah],
  );

  const overallPercent = Math.round(
    (getDarsProgressPercent(1) + getDarsProgressPercent(2) + getDarsProgressPercent(3)) / 3,
  );

  const allDarsCompleted = Boolean(
    progress.completedDars[1] && progress.completedDars[2] && progress.completedDars[3],
  );

  const accuracyPercent =
    progress.totalAttemptsCount > 0
      ? Math.min(100, Math.round((progress.correctAnswersCount / progress.totalAttemptsCount) * 100))
      : 0;

  return {
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
  };
}
