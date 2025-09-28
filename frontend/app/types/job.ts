export interface Job {
  id: number;
  company: string;
  position: string;
  status: JobStatus;
  location?: string;
  salary?: string;
  job_link?: string;
  description?: string;
  notes?: string;
  tags?: string[];
  applied_date?: string;
  interview_time?: string;
  company_logo?: string;
  is_referral?: boolean;
  referrer_name?: string;
  company_description?: string;
  position_description?: string;
  cv?: string;
  cover_letter?: string;
  application_url?: string;
  completion_method?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  contacts?: Contact[];
}

export interface Contact {
  id: number;
  job_id: number;
  type: string;
  name: string;
  email?: string;
  linkedin?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type JobStatus = 'saved' | 'applied' | 'interview' | 'rejected' | 'offered';

export interface JobCreate {
  company: string;
  position: string;
  status?: JobStatus;
  location?: string;
  salary?: string;
  job_link?: string;
  description?: string;
  notes?: string;
  tags?: string[];
  applied_date?: string;
  interview_time?: string;
  company_logo?: string;
  is_referral?: boolean;
  referrer_name?: string;
  company_description?: string;
  position_description?: string;
  cv?: string;
  cover_letter?: string;
  application_url?: string;
  completion_method?: string;
  contacts?: ContactCreate[];
}

export interface JobUpdate {
  company?: string;
  position?: string;
  status?: JobStatus;
  location?: string;
  salary?: string;
  job_link?: string;
  description?: string;
  notes?: string;
  tags?: string[];
  applied_date?: string;
  interview_time?: string;
  company_logo?: string;
  is_referral?: boolean;
  referrer_name?: string;
  company_description?: string;
  position_description?: string;
  cv?: string;
  cover_letter?: string;
  application_url?: string;
  completion_method?: string;
  contacts?: ContactCreate[];
}

export interface ContactCreate {
  type: string;
  name: string;
  email?: string;
  linkedin?: string;
  notes?: string;
}

export interface JobBulkUpdate {
  job_ids: number[];
  status: JobStatus;
}

export interface JobStats {
  total_jobs: number;
  jobs_by_status: Record<JobStatus, number>;
  jobs_by_company: Record<string, number>;
  recent_applications_count: number;
  most_active_day?: string;
  average_time_to_apply?: number;
  interview_rate?: number;
  offer_rate?: number;
}

export interface KanbanColumn {
  id: JobStatus;
  title: string;
  color: string;
  icon: React.ReactNode;
  jobs: Job[];
}

export interface DragDropState {
  draggedColumnIndex: number | null;
  dragOverIndex: number | null;
  draggedJobId: number | null;
  jobDropZone: { columnId: JobStatus; position: number } | null;
}
