export type ResourceType = 
  | 'BOOK'
  | 'VIDEO'
  | 'ARTICLE'
  | 'COURSE'
  | 'PODCAST'
  | 'TUTORIAL'
  | 'DOCUMENTATION'
  | 'OTHER';

export type ResourceStatus = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PAUSED'
  | 'ABANDONED';

export type ResourcePriority = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export type ResourceCategory = 
  | 'PROGRAMMING'
  | 'ALGORITHMS'
  | 'DATA_STRUCTURES'
  | 'SYSTEM_DESIGN'
  | 'DATABASE'
  | 'WEB_DEVELOPMENT'
  | 'MOBILE_DEVELOPMENT'
  | 'DEVOPS'
  | 'MACHINE_LEARNING'
  | 'CYBERSECURITY'
  | 'SOFT_SKILLS'
  | 'CAREER_DEVELOPMENT'
  | 'INTERVIEW_PREP'
  | 'OTHER';

// Book Types
export interface Book {
  id: number;
  user_id: number;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  pages?: number;
  resource_type: ResourceType;
  category?: ResourceCategory;
  status: ResourceStatus;
  priority: ResourcePriority;
  current_page?: number;
  total_pages?: number;
  progress_percentage?: number;
  start_date?: string;
  completion_date?: string;
  description?: string;
  notes?: string;
  rating?: number;
  tags?: string[];
  purchase_url?: string;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  pages?: number;
  category?: ResourceCategory;
  status: ResourceStatus;
  priority: ResourcePriority;
  current_page?: number;
  total_pages?: number;
  progress_percentage?: number;
  start_date?: string;
  completion_date?: string;
  description?: string;
  notes?: string;
  rating?: number;
  tags?: string[];
  purchase_url?: string;
  cover_image_url?: string;
}

// Video Types
export interface Video {
  id: number;
  user_id: number;
  title: string;
  creator: string;
  channel?: string;
  platform?: string;
  resource_type: ResourceType;
  category?: ResourceCategory;
  status: ResourceStatus;
  priority: ResourcePriority;
  duration_minutes?: number;
  video_url?: string;
  thumbnail_url?: string;
  video_id?: string;
  current_time_minutes?: number;
  progress_percentage?: number;
  start_date?: string;
  completion_date?: string;
  watch_count: number;
  description?: string;
  notes?: string;
  rating?: number;
  tags?: string[];
  playlist?: string;
  difficulty_level?: string;
  created_at: string;
  updated_at: string;
}

export interface VideoFormData {
  title: string;
  creator: string;
  channel?: string;
  platform?: string;
  category?: ResourceCategory;
  status: ResourceStatus;
  priority: ResourcePriority;
  duration_minutes?: number;
  video_url?: string;
  thumbnail_url?: string;
  video_id?: string;
  current_time_minutes?: number;
  progress_percentage?: number;
  start_date?: string;
  completion_date?: string;
  watch_count?: number;
  description?: string;
  notes?: string;
  rating?: number;
  tags?: string[];
  playlist?: string;
  difficulty_level?: string;
}

// Statistics Types
export interface BookStatistics {
  total_books: number;
  status_counts: Record<ResourceStatus, number>;
  category_counts: Record<ResourceCategory, number>;
  average_rating: number;
}

export interface VideoStatistics {
  total_videos: number;
  status_counts: Record<ResourceStatus, number>;
  category_counts: Record<ResourceCategory, number>;
  platform_counts: Record<string, number>;
  average_rating: number;
  total_watch_time_minutes: number;
}
