export type ApplicationStatus = 
  | 'DRAFT'
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'PHONE_SCREENING'
  | 'TECHNICAL_INTERVIEW'
  | 'HR_INTERVIEW'
  | 'FINAL_INTERVIEW'
  | 'OFFER_RECEIVED'
  | 'OFFER_ACCEPTED'
  | 'OFFER_DECLINED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type ApplicationSource = 
  | 'LINKEDIN'
  | 'COMPANY_WEBSITE'
  | 'REFERRAL'
  | 'JOB_BOARD'
  | 'RECRUITER'
  | 'NETWORKING'
  | 'OTHER';

export type InterviewStage = 
  | 'Phone Screening'
  | 'Technical Assessment'
  | 'Coding Challenge'
  | 'Technical Interview'
  | 'System Design'
  | 'HR Interview'
  | 'Behavioral Interview'
  | 'Final Interview'
  | 'Panel Interview'
  | 'Other';

export interface InterviewStageDetail {
  stage: InterviewStage;
  date?: string;
  notes?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Passed' | 'Failed';
}

export interface Application {
  id: number;
  job_title: string;
  company_name: string;
  role_position?: string;
  industry?: string;
  location?: string;
  application_status: ApplicationStatus;
  application_date?: string;
  job_link?: string;
  notes?: string;
  submitted_resume: boolean;
  contact_person_name?: string;
  contact_person_email?: string;
  application_source?: ApplicationSource;
  source_details?: string;
  interview_stages: InterviewStageDetail[];
  created_at: string;
  updated_at: string;
}

export interface ApplicationFormData {
  job_title: string;
  company_name: string;
  role_position?: string;
  industry?: string;
  location?: string;
  application_status: ApplicationStatus;
  application_date?: string;
  job_link?: string;
  notes?: string;
  submitted_resume: boolean;
  contact_person_name?: string;
  contact_person_email?: string;
  application_source?: ApplicationSource;
  source_details?: string;
  interview_stages: InterviewStageDetail[];
}

export interface ApplicationStats {
  total_applications: number;
  recent_applications: number;
  status_breakdown: Record<ApplicationStatus, number>;
  industry_breakdown: Record<string, number>;
}
