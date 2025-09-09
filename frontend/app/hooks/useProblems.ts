import { useState, useEffect, useCallback } from 'react';
import { Problem } from '../types/problem';
import { authService } from '../services/auth';

export interface UseProblemsReturn {
  problems: Problem[];
  loading: boolean;
  error: string | null;
  addProblem: (problem: Omit<Problem, 'id'>) => Promise<boolean>;
  updateProblem: (id: number, problem: Partial<Problem>) => Promise<boolean>;
  deleteProblem: (id: number) => Promise<boolean>;
  refreshProblems: () => Promise<void>;
}

export function useProblems(): UseProblemsReturn {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.getProblems();
      setProblems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProblem = useCallback(async (problem: Omit<Problem, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      const data = await authService.createProblem(problem);
      setProblems(prev => [...prev, data]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create problem');
      return false;
    }
  }, []);

  const updateProblem = useCallback(async (id: number, problem: Partial<Problem>): Promise<boolean> => {
    try {
      setError(null);
      const data = await authService.updateProblem(id, problem);
      setProblems(prev => 
        prev.map(p => p.id === id ? data : p)
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update problem');
      return false;
    }
  }, []);

  const deleteProblem = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await authService.deleteProblem(id);
      setProblems(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete problem');
      return false;
    }
  }, []);

  const refreshProblems = useCallback(async () => {
    await fetchProblems();
  }, [fetchProblems]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return {
    problems,
    loading,
    error,
    addProblem,
    updateProblem,
    deleteProblem,
    refreshProblems,
  };
}
