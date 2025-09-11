"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVideos } from '../hooks/useVideos';
import ProtectedRoute from '../components/ProtectedRoute';
import TopNavbar from '../components/dashboard/TopNavbar';
import VideosList from '../components/videos/VideosList';
import VideoForm from '../components/videos/VideoForm';
import { Video } from '../types/resource';

export default function VideosPage() {
  const { user, logout } = useAuth();
  const { videos, loading, error, addVideo, updateVideo, deleteVideo } = useVideos();
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  console.log('VideosPage render:', { videos: videos.length, loading, error, user: !!user });


  const handleAddVideo = async (video: Omit<Video, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const success = await addVideo(video);
    if (success) {
      setShowForm(false);
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setShowForm(true);
  };

  const handleUpdateVideo = async (updatedVideo: Video) => {
    const { id, ...updateData } = updatedVideo;
    const success = await updateVideo(id, updateData);
    if (success) {
      setShowForm(false);
      setEditingVideo(null);
    }
  };

  const handleDeleteVideo = async (id: number) => {
    await deleteVideo(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingVideo(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{background: 'linear-gradient(90deg, #EDEDED 0%, #FDF5D6 100%)'}}>
        <TopNavbar user={user} onLogout={logout} />
        <main className="py-8">
          <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold" style={{ color: '#111827' }}>Videos</h1>
                      <p className="mt-2" style={{ color: '#6B7280' }}>
                        Track your video learning progress and manage your video collection
                      </p>
                    </div>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-all duration-200 hover:scale-105 cursor-pointer"
                      style={{ 
                        backgroundColor: '#000000',
                        border: '2px solid #000000'
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
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Video
                    </button>
                  </div>
                </div>

                {/* Content */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2" style={{ color: '#6B7280' }}>Loading videos...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading videos</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : showForm ? (
                  <VideoForm
                    video={editingVideo}
                    onSubmit={editingVideo ? handleUpdateVideo : handleAddVideo}
                    onCancel={handleCancelForm}
                  />
                ) : (
                  <VideosList
                    videos={videos}
                    onEdit={handleEditVideo}
                    onDelete={handleDeleteVideo}
                  />
                )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
