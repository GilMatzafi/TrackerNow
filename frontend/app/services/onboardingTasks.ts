import { ApiService } from './base/ApiService';

export interface OnboardingTask {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateOnboardingTask {
  title: string;
  description?: string;
  due_date?: string;
  completed?: boolean;
}

export interface UpdateOnboardingTask {
  title?: string;
  description?: string;
  due_date?: string;
  completed?: boolean;
}

class OnboardingTasksService extends ApiService {
  private baseUrl = '/onboarding-tasks';

  async getTasks(): Promise<OnboardingTask[]> {
    return this.get<OnboardingTask[]>(this.baseUrl);
  }

  async getTask(id: number): Promise<OnboardingTask> {
    return this.get<OnboardingTask>(`${this.baseUrl}/${id}`);
  }

  async createTask(taskData: CreateOnboardingTask): Promise<OnboardingTask> {
    return this.post<OnboardingTask>(this.baseUrl, taskData);
  }

  async updateTask(id: number, taskData: UpdateOnboardingTask): Promise<OnboardingTask> {
    return this.put<OnboardingTask>(`${this.baseUrl}/${id}`, taskData);
  }

  async deleteTask(id: number): Promise<void> {
    return this.delete(`${this.baseUrl}/${id}`);
  }

  async toggleTaskCompletion(id: number): Promise<OnboardingTask> {
    return this.patch<OnboardingTask>(`${this.baseUrl}/${id}/toggle`);
  }
}

export const onboardingTasksService = new OnboardingTasksService();
