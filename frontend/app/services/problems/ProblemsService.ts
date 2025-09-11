import { ApiService } from '../base/ApiService';
import { Problem, ProblemFormData } from '../../types/problem';

class ProblemsService extends ApiService {
  // Get all problems
  async getProblems(skip = 0, limit = 100): Promise<Problem[]> {
    return this.get<Problem[]>(`/problems?skip=${skip}&limit=${limit}`);
  }

  // Get a specific problem
  async getProblem(id: number): Promise<Problem> {
    return this.get<Problem>(`/problems/${id}`);
  }

  // Create a new problem
  async createProblem(problemData: ProblemFormData): Promise<Problem> {
    return this.post<Problem>('/problems', problemData);
  }

  // Update a problem
  async updateProblem(id: number, problemData: Partial<ProblemFormData>): Promise<Problem> {
    return this.put<Problem>(`/problems/${id}`, problemData);
  }

  // Delete a problem
  async deleteProblem(id: number): Promise<void> {
    return this.delete<void>(`/problems/${id}`);
  }
}

export const problemsService = new ProblemsService();
