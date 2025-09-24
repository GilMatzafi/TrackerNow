export interface Problem {
  id: number;
  name: string;
  topics: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVISIT';
  link?: string;
  time_minutes?: number;
  notes?: string;
  created_at: string;
}

export interface ProblemFormData {
  name: string;
  topics: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVISIT';
  link?: string;
  time_minutes?: number;
  notes?: string;
}
