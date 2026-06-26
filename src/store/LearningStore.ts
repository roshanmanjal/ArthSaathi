import { useState, useCallback } from 'react';
import { load, save } from './storeHelpers';

export interface LessonProgress {
  completedIds: number[];
  xp: number;
  streak: number;
  lastStudied: string | null;
}

export const DEFAULT_LESSON_PROGRESS: LessonProgress = {
  completedIds: [],
  xp: 0,
  streak: 0,
  lastStudied: null,
};

export function useLearning() {
  const [progress, setProgressState] = useState<LessonProgress>(() =>
    load('lessonProgress', DEFAULT_LESSON_PROGRESS)
  );

  const setProgress = useCallback((updater: Partial<LessonProgress> | ((p: LessonProgress) => LessonProgress)) => {
    setProgressState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      save('lessonProgress', next);
      return next;
    });
  }, []);

  const completeLesson = useCallback((id: number, xpReward: number) => {
    setProgress(prev => {
      if (prev.completedIds.includes(id)) return prev;
      
      // Update streak if studied today/yesterday
      const today = new Date().toISOString().split('T')[0];
      let newStreak = prev.streak;
      if (prev.lastStudied) {
        const lastDate = new Date(prev.lastStudied);
        const diffTime = Math.abs(new Date(today).getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      return {
        ...prev,
        completedIds: [...prev.completedIds, id],
        xp: prev.xp + xpReward,
        streak: newStreak,
        lastStudied: today,
      };
    });
  }, [setProgress]);

  const addXP = useCallback((amount: number) => {
    setProgress(prev => ({ ...prev, xp: prev.xp + amount }));
  }, [setProgress]);

  // Dynamic Level Calculation: Level = Math.floor(XP / 200) + 1
  const level = Math.floor(progress.xp / 200) + 1;
  const xpInCurrentLevel = progress.xp % 200;
  const xpNeededForNextLevel = 200;

  // Dynamic Badges List based on progress state
  const getBadges = useCallback(() => {
    const badges = [
      { emoji: '🎯', name: 'First Goal', earned: true }, // Default earned or check goals length
      { emoji: '🛡️', name: 'Scam Free', earned: true },
      { emoji: '📊', name: 'Budgeter', earned: true },
      { emoji: '🔥', name: '7 Day Streak', earned: progress.streak >= 7 },
      { emoji: '📚', name: 'Scholar', earned: progress.completedIds.length >= 4 },
      { emoji: '💎', name: 'Expert', earned: progress.xp >= 400 },
    ];
    return badges;
  }, [progress]);

  return { progress, setProgress, completeLesson, addXP, level, xpInCurrentLevel, xpNeededForNextLevel, getBadges };
}
