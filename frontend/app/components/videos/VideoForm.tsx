"use client";

import { useState, useEffect } from 'react';
import { Video, VideoFormData, ResourceStatus, ResourcePriority, ResourceCategory } from '../../types/resource';

interface VideoFormProps {
  video?: Video | null;
  onSubmit: (video: Omit<Video, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export default function VideoForm({ video, onSubmit, onCancel }: VideoFormProps) {
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    creator: '',
    channel: '',
    platform: '',
    category: undefined,
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    duration_minutes: undefined,
    video_url: '',
    thumbnail_url: '',
    video_id: '',
    current_time_minutes: undefined,
    progress_percentage: undefined,
    start_date: '',
    completion_date: '',
    watch_count: 0,
    description: '',
    notes: '',
    rating: undefined,
    tags: [],
    playlist: '',
    difficulty_level: ''
  });

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        creator: video.creator,
        channel: video.channel || '',
        platform: video.platform || '',
        category: video.category,
        status: video.status,
        priority: video.priority,
        duration_minutes: video.duration_minutes,
        video_url: video.video_url || '',
        thumbnail_url: video.thumbnail_url || '',
        video_id: video.video_id || '',
        current_time_minutes: video.current_time_minutes,
        progress_percentage: video.progress_percentage,
        start_date: video.start_date || '',
        completion_date: video.completion_date || '',
        watch_count: video.watch_count,
        description: video.description || '',
        notes: video.notes || '',
        rating: video.rating,
        tags: video.tags || [],
        playlist: video.playlist || '',
        difficulty_level: video.difficulty_level || ''
      });
    }
  }, [video]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_minutes' || name === 'current_time_minutes' || name === 'watch_count' || name === 'rating'
        ? value ? parseInt(value) : undefined
        : name === 'progress_percentage'
        ? value ? parseFloat(value) : undefined
        : value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-scale-in">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#111827' }}>
        {video ? 'Edit Video' : 'Add New Video'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="Enter video title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Creator *
            </label>
            <input
              type="text"
              name="creator"
              value={formData.creator}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="Enter creator name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Channel
            </label>
            <input
              type="text"
              name="channel"
              value={formData.channel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="Channel name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            >
              <option value="">Select Platform</option>
              <option value="YouTube">YouTube</option>
              <option value="Udemy">Udemy</option>
              <option value="Coursera">Coursera</option>
              <option value="Pluralsight">Pluralsight</option>
              <option value="LinkedIn Learning">LinkedIn Learning</option>
              <option value="Vimeo">Vimeo</option>
              <option value="Twitch">Twitch</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Difficulty Level
            </label>
            <select
              name="difficulty_level"
              value={formData.difficulty_level}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            >
              <option value="">Select Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            >
              <option value="">Select Category</option>
              <option value="PROGRAMMING">Programming</option>
              <option value="ALGORITHMS">Algorithms</option>
              <option value="DATA_STRUCTURES">Data Structures</option>
              <option value="SYSTEM_DESIGN">System Design</option>
              <option value="DATABASE">Database</option>
              <option value="WEB_DEVELOPMENT">Web Development</option>
              <option value="MOBILE_DEVELOPMENT">Mobile Development</option>
              <option value="DEVOPS">DevOps</option>
              <option value="MACHINE_LEARNING">Machine Learning</option>
              <option value="CYBERSECURITY">Cybersecurity</option>
              <option value="SOFT_SKILLS">Soft Skills</option>
              <option value="CAREER_DEVELOPMENT">Career Development</option>
              <option value="INTERVIEW_PREP">Interview Prep</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAUSED">Paused</option>
              <option value="ABANDONED">Abandoned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* Video Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration_minutes"
              value={formData.duration_minutes || ''}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="45"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Current Time (minutes)
            </label>
            <input
              type="number"
              name="current_time_minutes"
              value={formData.current_time_minutes || ''}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Progress (%)
            </label>
            <input
              type="number"
              name="progress_percentage"
              value={formData.progress_percentage || ''}
              onChange={handleInputChange}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="33.3"
            />
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Video URL
            </label>
            <input
              type="url"
              name="video_url"
              value={formData.video_url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="https://youtube.com/watch?v=example"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Video ID
            </label>
            <input
              type="text"
              name="video_id"
              value={formData.video_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="dQw4w9WgXcQ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Playlist
            </label>
            <input
              type="text"
              name="playlist"
              value={formData.playlist}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="System Design Course"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Completion Date
            </label>
            <input
              type="date"
              name="completion_date"
              value={formData.completion_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
        </div>

        {/* Rating and Watch Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Rating (1-5 stars)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating || ''}
              onChange={handleInputChange}
              min="1"
              max="5"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="4.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Watch Count
            </label>
            <input
              type="number"
              name="watch_count"
              value={formData.watch_count || ''}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="3"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Tags
          </label>
          <input
            type="text"
            value={formData.tags?.join(', ') || ''}
            onChange={handleTagsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
            style={{ color: '#111827' }}
            placeholder="system design, interview, distributed systems"
          />
          <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
            Separate tags with commas
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
            style={{ color: '#111827' }}
            placeholder="Brief description of the video..."
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
            style={{ color: '#111827' }}
            placeholder="Your personal notes about this video..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 cursor-pointer"
            style={{ color: '#374151' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
            style={{ 
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: '2px solid #000000',
              fontWeight: '600',
              fontSize: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333333';
              e.currentTarget.style.borderColor = '#333333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.borderColor = '#000000';
            }}
          >
            {video ? 'Update Video' : 'Add Video'}
          </button>
        </div>
      </form>
    </div>
  );
}
