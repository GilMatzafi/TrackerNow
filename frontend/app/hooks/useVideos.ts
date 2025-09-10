import { useState, useEffect } from 'react';
import { Video } from '../types/resource';
import { authService } from '../services/auth';

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.getVideos();
        setVideos(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const addVideo = async (videoData: Omit<Video, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newVideo = await authService.createVideo({
        title: videoData.title,
        creator: videoData.creator,
        channel: videoData.channel,
        platform: videoData.platform,
        video_url: videoData.url,
        duration_minutes: videoData.duration_minutes,
        current_time_minutes: videoData.watched_minutes,
        status: videoData.status,
        priority: videoData.priority,
        category: videoData.category,
        rating: videoData.rating,
        description: videoData.description,
        tags: videoData.tags,
        watch_count: videoData.watch_count,
      });
      
      setVideos(prev => [...prev, newVideo]);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to add video');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateVideo = async (id: number, videoData: Partial<Omit<Video, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedVideo = await authService.updateVideo(id, {
        title: videoData.title,
        creator: videoData.creator,
        channel: videoData.channel,
        platform: videoData.platform,
        video_url: videoData.url,
        duration_minutes: videoData.duration_minutes,
        current_time_minutes: videoData.watched_minutes,
        status: videoData.status,
        priority: videoData.priority,
        category: videoData.category,
        rating: videoData.rating,
        description: videoData.description,
        tags: videoData.tags,
        watch_count: videoData.watch_count,
      });
      
      setVideos(prev => prev.map(video => video.id === id ? updatedVideo : video));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update video');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await authService.deleteVideo(id);
      setVideos(prev => prev.filter(video => video.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete video');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const incrementWatchCount = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const video = videos.find(v => v.id === id);
      if (video) {
        const updatedVideo = await authService.updateVideo(id, {
          watch_count: (video.watch_count || 0) + 1
        });
        setVideos(prev => prev.map(v => v.id === id ? updatedVideo : v));
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to increment watch count');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { 
    videos, 
    loading, 
    error, 
    addVideo, 
    updateVideo, 
    deleteVideo,
    incrementWatchCount
  };
};