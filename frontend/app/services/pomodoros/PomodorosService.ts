import { ApiService } from '../base/ApiService';
import { Pomodoro, PomodoroFormData, PomodoroStatsResponse } from '../../types/pomodoro';

class PomodorosService extends ApiService {
  // Get all pomodoros
  async getPomodoros(): Promise<Pomodoro[]> {
    return this.get<Pomodoro[]>('/pomodoros');
  }

  // Get a specific pomodoro
  async getPomodoro(id: number): Promise<Pomodoro> {
    return this.get<Pomodoro>(`/pomodoros/${id}`);
  }

  // Create a new pomodoro
  async createPomodoro(pomodoroData: PomodoroFormData): Promise<Pomodoro> {
    return this.post<Pomodoro>('/pomodoros', pomodoroData);
  }

  // Update a pomodoro
  async updatePomodoro(id: number, pomodoroData: Partial<PomodoroFormData>): Promise<Pomodoro> {
    return this.put<Pomodoro>(`/pomodoros/${id}`, pomodoroData);
  }

  // Delete a pomodoro
  async deletePomodoro(id: number): Promise<void> {
    return this.delete<void>(`/pomodoros/${id}`);
  }

  // Get active pomodoro
  async getActivePomodoro(): Promise<Pomodoro | null> {
    try {
      return await this.get<Pomodoro>('/pomodoros/active');
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null; // No active pomodoro
      }
      throw error;
    }
  }

  // Get pomodoro statistics
  async getPomodoroStats(): Promise<PomodoroStatsResponse> {
    return this.get<PomodoroStatsResponse>('/pomodoros/stats');
  }

  // Start a pomodoro
  async startPomodoro(id: number): Promise<Pomodoro> {
    return this.post<Pomodoro>(`/pomodoros/${id}/start`, {});
  }

  // Pause a pomodoro
  async pausePomodoro(id: number): Promise<Pomodoro> {
    return this.post<Pomodoro>(`/pomodoros/${id}/pause`, {});
  }

  // Resume a pomodoro
  async resumePomodoro(id: number): Promise<Pomodoro> {
    return this.post<Pomodoro>(`/pomodoros/${id}/resume`, {});
  }

  // Complete a pomodoro
  async completePomodoro(id: number): Promise<Pomodoro> {
    return this.post<Pomodoro>(`/pomodoros/${id}/complete`, {});
  }

  // Cancel a pomodoro
  async cancelPomodoro(id: number): Promise<Pomodoro> {
    return this.post<Pomodoro>(`/pomodoros/${id}/cancel`, {});
  }
}

export const pomodorosService = new PomodorosService();
