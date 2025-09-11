import { useState, useEffect, useCallback } from 'react';
import { Pomodoro, PomodoroFormData, PomodoroStats } from '../types/pomodoro';
import { pomodorosService } from '../services';

export interface UsePomodorosReturn {
  pomodoros: Pomodoro[];
  loading: boolean;
  error: string | null;
  addPomodoro: (pomodoro: PomodoroFormData) => Promise<boolean>;
  updatePomodoro: (id: number, pomodoro: Partial<PomodoroFormData>) => Promise<boolean>;
  deletePomodoro: (id: number) => Promise<boolean>;
  refreshPomodoros: () => Promise<void>;
}

export function usePomodoros(): UsePomodorosReturn {
  const [pomodoros, setPomodoros] = useState<Pomodoro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPomodoros = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pomodorosService.getPomodoros();
      setPomodoros(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pomodoros');
    } finally {
      setLoading(false);
    }
  }, []);

  const addPomodoro = useCallback(async (pomodoro: PomodoroFormData): Promise<boolean> => {
    try {
      setError(null);
      const data = await pomodorosService.createPomodoro(pomodoro);
      setPomodoros(prev => [...prev, data]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pomodoro');
      return false;
    }
  }, []);

  const updatePomodoro = useCallback(async (id: number, pomodoro: Partial<PomodoroFormData>): Promise<boolean> => {
    try {
      setError(null);
      const data = await pomodorosService.updatePomodoro(id, pomodoro);
      setPomodoros(prev => 
        prev.map(p => p.id === id ? data : p)
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update pomodoro');
      return false;
    }
  }, []);

  const deletePomodoro = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await pomodorosService.deletePomodoro(id);
      setPomodoros(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pomodoro');
      return false;
    }
  }, []);

  const refreshPomodoros = useCallback(async () => {
    await fetchPomodoros();
  }, [fetchPomodoros]);

  useEffect(() => {
    fetchPomodoros();
  }, [fetchPomodoros]);

  return {
    pomodoros,
    loading,
    error,
    addPomodoro,
    updatePomodoro,
    deletePomodoro,
    refreshPomodoros,
  };
}

export interface UsePomodoroTimerReturn {
  activePomodoro: Pomodoro | null;
  loading: boolean;
  error: string | null;
  startPomodoro: (id: number) => Promise<boolean>;
  pausePomodoro: (id: number) => Promise<boolean>;
  resumePomodoro: (id: number) => Promise<boolean>;
  completePomodoro: (id: number) => Promise<boolean>;
  cancelPomodoro: (id: number) => Promise<boolean>;
  refreshActivePomodoro: () => Promise<void>;
}

export function usePomodoroTimer(): UsePomodoroTimerReturn {
  const [activePomodoro, setActivePomodoro] = useState<Pomodoro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivePomodoro = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pomodorosService.getActivePomodoro();
      setActivePomodoro(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active pomodoro');
    } finally {
      setLoading(false);
    }
  }, []);

  const startPomodoro = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const data = await pomodorosService.startPomodoro(id);
      setActivePomodoro(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start pomodoro');
      return false;
    }
  }, []);

  const pausePomodoro = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const data = await pomodorosService.pausePomodoro(id);
      setActivePomodoro(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause pomodoro');
      return false;
    }
  }, []);

  const resumePomodoro = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const data = await pomodorosService.resumePomodoro(id);
      setActivePomodoro(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume pomodoro');
      return false;
    }
  }, []);

  const completePomodoro = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const data = await pomodorosService.completePomodoro(id);
      setActivePomodoro(null); // Clear active pomodoro after completion
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete pomodoro');
      return false;
    }
  }, []);

  const cancelPomodoro = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const data = await pomodorosService.cancelPomodoro(id);
      setActivePomodoro(null); // Clear active pomodoro after cancellation
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel pomodoro');
      return false;
    }
  }, []);

  const refreshActivePomodoro = useCallback(async () => {
    await fetchActivePomodoro();
  }, [fetchActivePomodoro]);

  useEffect(() => {
    fetchActivePomodoro();
  }, [fetchActivePomodoro]);

  return {
    activePomodoro,
    loading,
    error,
    startPomodoro,
    pausePomodoro,
    resumePomodoro,
    completePomodoro,
    cancelPomodoro,
    refreshActivePomodoro,
  };
}

export interface UsePomodoroStatsReturn {
  stats: PomodoroStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

export function usePomodoroStats(): UsePomodoroStatsReturn {
  const [stats, setStats] = useState<PomodoroStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pomodorosService.getPomodoroStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pomodoro stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats,
  };
}
