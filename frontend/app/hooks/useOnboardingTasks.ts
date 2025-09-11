import { useState, useEffect, useCallback } from 'react';
import { onboardingTasksService, OnboardingTask, CreateOnboardingTask, UpdateOnboardingTask } from '../services';

export const useOnboardingTasks = () => {
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await onboardingTasksService.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('Error fetching onboarding tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: CreateOnboardingTask) => {
    try {
      setError(null);
      const newTask = await onboardingTasksService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: number, taskData: UpdateOnboardingTask) => {
    try {
      setError(null);
      const updatedTask = await onboardingTasksService.updateTask(id, taskData);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      setError(null);
      await onboardingTasksService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    }
  }, []);

  const toggleTaskCompletion = useCallback(async (id: number) => {
    try {
      setError(null);
      const updatedTask = await onboardingTasksService.toggleTaskCompletion(id);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task');
      console.error('Error toggling task:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const completedCount = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return {
    tasks,
    loading,
    error,
    completedCount,
    totalTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refetch: fetchTasks
  };
};
