export interface Problem {
  id: number;
  name: string;
  topics: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link?: string;
  time_minutes?: number;
  notes?: string;
  created_at: string;
}

export interface ProblemFormData {
  name: string;
  topics: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link?: string;
  time_minutes?: number;
  notes?: string;
}
