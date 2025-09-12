import { ApiService } from './base/ApiService';

export interface TimerSettings {
  id: number;
  user_id: number;
  focus_session: number;
  short_break: number;
  long_break: number;
  long_break_after: number;
  sound_enabled: boolean;
  pause_start_sound: boolean;
  focus_break_sound: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UpdateTimerSettings {
  focus_session?: number;
  short_break?: number;
  long_break?: number;
  long_break_after?: number;
  sound_enabled?: boolean;
  pause_start_sound?: boolean;
  focus_break_sound?: boolean;
}

export interface DefaultTimerSettings {
  focus_session: number;
  short_break: number;
  long_break: number;
  long_break_after: number;
  sound_enabled: boolean;
  pause_start_sound: boolean;
  focus_break_sound: boolean;
}

class TimerSettingsService extends ApiService {
  async getSettings(): Promise<TimerSettings> {
    return this.get<TimerSettings>('/timer-settings/');
  }

  async updateSettings(settings: UpdateTimerSettings): Promise<TimerSettings> {
    return this.put<TimerSettings>('/timer-settings/', settings);
  }

  async getDefaultSettings(): Promise<DefaultTimerSettings> {
    return this.get<DefaultTimerSettings>('/timer-settings/defaults');
  }
}

export const timerSettingsService = new TimerSettingsService();
