import { ApiService } from './base/ApiService';

export interface PomodoroSession {
  id: number;
  user_id: number;
  date: string; // YYYY-MM-DD format
  duration: number; // in minutes
  type: 'work' | 'break';
  completed: boolean;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePomodoroSession {
  date: string;
  duration: number;
  type: 'work' | 'break';
  completed: boolean;
}

export interface UpdatePomodoroSession {
  date?: string;
  duration?: number;
  type?: 'work' | 'break';
  completed?: boolean;
}

export interface PomodoroStats {
  total_work_time_minutes: number;
}

export interface TodayWorkTimeStats {
  today_work_time_minutes: number;
}

class PomodoroSessionsService extends ApiService {
  async getSessions(): Promise<PomodoroSession[]> {
    return this.get<PomodoroSession[]>('/pomodoro-sessions/');
  }

  async getWeeklySessions(): Promise<PomodoroSession[]> {
    return this.get<PomodoroSession[]>('/pomodoro-sessions/weekly');
  }

  async getTodaySessions(): Promise<PomodoroSession[]> {
    return this.get<PomodoroSession[]>('/pomodoro-sessions/today');
  }

  async getTodayWorkSessions(): Promise<PomodoroSession[]> {
    return this.get<PomodoroSession[]>('/pomodoro-sessions/today/work');
  }

  async getTotalWorkTime(): Promise<PomodoroStats> {
    return this.get<PomodoroStats>('/pomodoro-sessions/stats/total-work-time');
  }

  async getTodayWorkTime(): Promise<TodayWorkTimeStats> {
    return this.get<TodayWorkTimeStats>('/pomodoro-sessions/stats/today-work-time');
  }

  async createSession(sessionData: CreatePomodoroSession): Promise<PomodoroSession> {
    return this.post<PomodoroSession>('/pomodoro-sessions/', sessionData);
  }

  async getSession(sessionId: number): Promise<PomodoroSession> {
    return this.get<PomodoroSession>(`/pomodoro-sessions/${sessionId}`);
  }

  async updateSession(sessionId: number, sessionData: UpdatePomodoroSession): Promise<PomodoroSession> {
    return this.put<PomodoroSession>(`/pomodoro-sessions/${sessionId}`, sessionData);
  }

  async deleteSession(sessionId: number): Promise<void> {
    return this.delete<void>(`/pomodoro-sessions/${sessionId}`);
  }
}

export const pomodoroSessionsService = new PomodoroSessionsService();
