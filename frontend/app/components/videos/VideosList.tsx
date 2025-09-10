"use client";

import { useState } from 'react';
import { Video, ResourceStatus, ResourcePriority, ResourceCategory } from '../../types/resource';

interface VideosListProps {
  videos: Video[];
  onEdit: (video: Video) => void;
  onDelete: (id: number) => void;
}

export default function VideosList({ videos, onEdit, onDelete }: VideosListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<ResourcePriority | 'All'>('All');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'title' | 'creator' | 'status' | 'date'>('date');

  console.log('VideosList render:', { videos: videos.length, videos });

  const getStatusColor = (status: ResourceStatus) => {
    const colors = {
      'NOT_STARTED': 'bg-gray-100 text-gray-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'PAUSED': 'bg-yellow-100 text-yellow-800',
      'ABANDONED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: ResourcePriority) => {
    const colors = {
      'LOW': 'bg-gray-100 text-gray-800',
      'MEDIUM': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatStatus = (status: ResourceStatus) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCategory = (category: ResourceCategory) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPriority = (priority: ResourcePriority) => {
    return priority.charAt(0) + priority.slice(1).toLowerCase();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Get unique platforms for filter
  const platforms = Array.from(new Set(videos.map(video => video.platform).filter(Boolean)));

  // Filter and sort videos
  const filteredAndSortedVideos = videos
    .filter(video => {
      const matchesSearch = 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (video.channel && video.channel.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'All' || video.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || video.category === categoryFilter;
      const matchesPriority = priorityFilter === 'All' || video.priority === priorityFilter;
      const matchesPlatform = platformFilter === 'All' || video.platform === platformFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesPlatform;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'creator':
          return a.creator.localeCompare(b.creator);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ResourceStatus | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="All">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAUSED">Paused</option>
              <option value="ABANDONED">Abandoned</option>
            </select>
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ResourceCategory | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="All">All Categories</option>
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
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as ResourcePriority | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="All">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="All">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'creator' | 'status' | 'date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="creator">Sort by Creator</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      {filteredAndSortedVideos.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium" style={{ color: '#111827' }}>No videos found</h3>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            {searchTerm || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All' || platformFilter !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first video.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedVideos.map((video, index) => (
            <div 
              key={video.id} 
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ color: '#111827' }}>{video.title}</h3>
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}>
                      {formatStatus(video.status)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(video.priority)}`}>
                      {formatPriority(video.priority)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(video)}
                    className="p-2 text-gray-400 hover:text-primary transition-all duration-200 hover:scale-110 cursor-pointer"
                    title="Edit video"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(video.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-all duration-200 hover:scale-110 cursor-pointer"
                    title="Delete video"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Creator and Platform */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {video.creator}
                  </span>
                  {video.platform && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {video.platform}
                    </span>
                  )}
                  {video.difficulty_level && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {video.difficulty_level}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress */}
              {video.progress_percentage !== undefined && video.progress_percentage > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: '#6B7280' }}>Progress</span>
                    <span style={{ color: '#6B7280' }}>{video.progress_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${video.progress_percentage}%` }}
                    ></div>
                  </div>
                  {video.current_time_minutes && video.duration_minutes && (
                    <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                      {formatDuration(video.current_time_minutes)} / {formatDuration(video.duration_minutes)}
                    </div>
                  )}
                </div>
              )}

              {/* Details */}
              <div className="space-y-2 text-sm" style={{ color: '#4B5563' }}>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Added {formatDate(video.created_at)}
                </div>
                {video.duration_minutes && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDuration(video.duration_minutes)}
                  </div>
                )}
                {video.watch_count > 0 && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Watched {video.watch_count} time{video.watch_count > 1 ? 's' : ''}
                  </div>
                )}
                {video.rating && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {video.rating}/5 stars
                  </div>
                )}
                {video.video_url && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate cursor-pointer"
                    >
                      Watch Video
                    </a>
                  </div>
                )}
              </div>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-1">
                    {video.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {video.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm line-clamp-2" style={{ color: '#4B5563' }}>{video.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-slide-in-bottom">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#111827' }}>{videos.length}</div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Total Videos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {videos.filter(video => video.status === 'IN_PROGRESS').length}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {videos.filter(video => video.status === 'COMPLETED').length}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {videos.reduce((total, video) => total + (video.duration_minutes || 0), 0)}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Total Minutes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
