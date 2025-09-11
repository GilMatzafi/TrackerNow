export type PomodoroType = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';
export type PomodoroStatus = 'PENDING' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface Pomodoro {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  pomodoro_type: PomodoroType;
  duration_minutes: number;
  status: PomodoroStatus;
  started_at?: string;
  completed_at?: string;
  paused_duration_seconds: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PomodoroFormData {
  title: string;
  description?: string;
  pomodoro_type: PomodoroType;
  duration_minutes: number;
}

export interface PomodoroStats {
  total_pomodoros: number;
  completed_pomodoros: number;
  work_pomodoros: number;
  completion_rate: number;
}

export interface PomodoroTimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number; // in seconds
  totalDuration: number; // in seconds
  startTime?: Date;
  pauseStartTime?: Date;
  totalPausedTime: number; // in seconds
}

export interface PomodoroSession {
  pomodoro: Pomodoro;
  timerState: PomodoroTimerState;
}
