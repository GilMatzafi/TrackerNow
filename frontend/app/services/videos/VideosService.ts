import { ApiService } from '../base/ApiService';
import { Video } from '../../types/resource';

// For now, we'll use the existing Video interface from resource.ts
// and create a simplified form data interface for the API
export interface VideoFormData {
  title: string;
  creator: string;
  channel?: string;
  platform?: string;
  video_url?: string;
  duration_minutes?: number;
  current_time_minutes?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'PROGRAMMING' | 'SYSTEM_DESIGN' | 'ALGORITHMS' | 'DATABASE' | 'NETWORKING' | 'SECURITY' | 'SOFTWARE_ENGINEERING' | 'OTHER';
  rating?: number;
  description?: string;
  tags?: string[];
  watch_count?: number;
}

export interface VideoStats {
  total_videos: number;
  completed_videos: number;
  in_progress_videos: number;
  total_watch_time: number;
  average_rating: number;
}

class VideosService extends ApiService {
  // Get all videos
  async getVideos(): Promise<Video[]> {
    return this.get<Video[]>('/videos/');
  }

  // Get a specific video
  async getVideo(id: number): Promise<Video> {
    return this.get<Video>(`/videos/${id}/`);
  }

  // Create a new video
  async createVideo(videoData: VideoFormData): Promise<Video> {
    return this.post<Video>('/videos/', videoData);
  }

  // Update a video
  async updateVideo(id: number, videoData: Partial<VideoFormData>): Promise<Video> {
    return this.put<Video>(`/videos/${id}/`, videoData);
  }

  // Delete a video
  async deleteVideo(id: number): Promise<void> {
    return this.delete<void>(`/videos/${id}/`);
  }

  // Get videos statistics
  async getVideosStats(): Promise<VideoStats> {
    return this.get<VideoStats>('/videos/stats/');
  }
}

export const videosService = new VideosService();
