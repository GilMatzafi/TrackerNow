"use client";

import { useState, useEffect } from 'react';
import { User, authService } from '../../services';

interface UserProfileCardProps {
  user: User | null;
  onRefreshUser: () => Promise<void>;
}

export default function UserProfileCard({ user, onRefreshUser }: UserProfileCardProps) {
  const [avatarSeed, setAvatarSeed] = useState(user?.avatar_seed || user?.first_name || 'User');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Update avatar seed when user data changes
  useEffect(() => {
    if (user?.avatar_seed) {
      setAvatarSeed(user.avatar_seed);
    } else if (user?.first_name) {
      setAvatarSeed(user.first_name);
    }
  }, [user]);

  const generateNewAvatar = async () => {
    if (isGeneratingAvatar) return; // Prevent multiple clicks
    
    setIsGeneratingAvatar(true);
    
    try {
      // Generate new seed
      const newSeed = Math.random().toString(36).substring(7);
      
      // Update UI immediately for smooth experience
      setAvatarSeed(newSeed);
      
      // Update backend in background
      await authService.updateUser({ avatar_seed: newSeed });
      
      // Refresh user data to sync with backend
      await onRefreshUser();
      
      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 1000);
    } catch (error) {
      console.error('Failed to update avatar seed:', error);
      // Revert to previous seed on error
      setAvatarSeed(user?.avatar_seed || user?.first_name || 'User');
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  return (
    <div className="relative rounded-3xl p-10 shadow-sm border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group hover:shadow-lg transition-shadow duration-300">
      {/* Background Avatar */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ease-in-out avatar-glow ${
          !isGeneratingAvatar ? 'animate-avatar-dance group-hover:animate-float-fast' : ''
        }`}
        style={{
          backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=400)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isGeneratingAvatar ? 0.7 : 1,
          transform: isGeneratingAvatar ? 'scale(1.05)' : 'scale(1)'
        }}
      ></div>
      
      {/* Loading Overlay */}
      {isGeneratingAvatar && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-15 transition-opacity duration-300">
          <div className="bg-white bg-opacity-90 rounded-full p-3 shadow-lg">
            <svg className="w-6 h-6 text-gray-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center z-15 transition-opacity duration-300">
          <div className="bg-white bg-opacity-90 rounded-full p-3 shadow-lg animate-bounce">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full">
        <div className="text-left">
          <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
            {user?.first_name && user?.last_name 
              ? `${user.first_name} ${user.last_name}` 
              : user?.first_name || 'User'
            }
          </h3>
        </div>
        
        {/* Refresh button */}
        <button 
          onClick={generateNewAvatar}
          disabled={isGeneratingAvatar}
          className={`absolute top-4 right-4 w-8 h-8 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-full shadow-lg border-2 border-white flex items-center justify-center transition-all duration-300 z-20 ${
            isGeneratingAvatar 
              ? 'cursor-not-allowed opacity-70' 
              : 'hover:bg-opacity-100 hover:scale-110 active:scale-95 cursor-pointer'
          }`}
          title={isGeneratingAvatar ? "Generating..." : "Generate new avatar"}
        >
          <svg 
            className={`w-4 h-4 text-white transition-transform duration-300 ${
              isGeneratingAvatar ? 'animate-spin' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
