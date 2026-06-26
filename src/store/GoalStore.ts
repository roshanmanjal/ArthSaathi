import { useState, useCallback } from 'react';
import { load, save } from './storeHelpers';

export interface Goal {
  id: number;
  name: string;
  target: number;
  saved: number;
  emoji: string;
  deadline: string;
  monthlyNeeded: number;
  category?: string;
}

export const DEFAULT_GOALS: Goal[] = [];

export function useGoals() {
  const [goals, setGoalsState] = useState<Goal[]>(() => load('goals', DEFAULT_GOALS));

  const setGoals = useCallback((updater: Goal[] | ((prev: Goal[]) => Goal[])) => {
    setGoalsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      save('goals', next);
      return next;
    });
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now() }]);
  }, [setGoals]);

  const updateGoal = useCallback((id: number, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, [setGoals]);

  const deleteGoal = useCallback((id: number) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, [setGoals]);

  return { goals, setGoals, addGoal, updateGoal, deleteGoal };
}
