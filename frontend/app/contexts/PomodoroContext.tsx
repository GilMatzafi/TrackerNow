"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pomodoroSessionsService, PomodoroSession, CreatePomodoroSession } from '../services';

interface PomodoroContextType {
  sessions: PomodoroSession[];
  loading: boolean;
  error: string | null;
  addSession: (session: CreatePomodoroSession) => Promise<void>;
  getWeeklySessions: () => PomodoroSession[];
  getTotalWorkTime: () => number;
  getTodayWorkTime: () => number;
  refreshSessions: () => Promise<void>;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};

interface PomodoroProviderProps {
  children: ReactNode;
}

export const PomodoroProvider: React.FC<PomodoroProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sessions from backend on mount
  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const weeklySessions = await pomodoroSessionsService.getWeeklySessions();
      setSessions(weeklySessions);
    } catch (err) {
      console.error('Error loading Pomodoro sessions:', err);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const addSession = async (sessionData: CreatePomodoroSession) => {
    try {
      const newSession = await pomodoroSessionsService.createSession(sessionData);
      setSessions(prev => [...prev, newSession]);
    } catch (err) {
      console.error('Error creating Pomodoro session:', err);
      setError('Failed to create session');
    }
  };

  const refreshSessions = async () => {
    await loadSessions();
  };

  const getWeeklySessions = (): PomodoroSession[] => {
    // Sessions are already filtered by the backend for the current week
    return sessions;
  };

  const getTotalWorkTime = (): number => {
    return sessions
      .filter(session => session.type === 'work' && session.completed)
      .reduce((total, session) => total + session.duration, 0);
  };

  const getTodayWorkTime = (): number => {
    const today = new Date().toISOString().split('T')[0];
    return sessions
      .filter(session => 
        session.date === today && 
        session.type === 'work' && 
        session.completed
      )
      .reduce((total, session) => total + session.duration, 0);
  };

  const value: PomodoroContextType = {
    sessions,
    loading,
    error,
    addSession,
    getWeeklySessions,
    getTotalWorkTime,
    getTodayWorkTime,
    refreshSessions,
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
};
