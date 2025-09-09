"use client";

import { User } from '../services/auth';

interface AvatarProps {
  user?: User | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnlineIndicator?: boolean;
  className?: string;
}

export default function Avatar({ 
  user, 
  size = 'md', 
  showOnlineIndicator = false,
  className = ''
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-8 h-8'
  };

  const indicatorSizes = {
    sm: 'w-2 h-2 -bottom-0.5 -right-0.5',
    md: 'w-3 h-3 -bottom-0.5 -right-0.5',
    lg: 'w-3 h-3 -bottom-0.5 -right-0.5',
    xl: 'w-4 h-4 -bottom-1 -right-1'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center relative ${className}`}>
      {user?.first_name && user?.last_name ? (
        <span className="text-white font-semibold">
          {user.first_name[0]}{user.last_name[0]}
        </span>
      ) : (
        <svg className={`${iconSizes[size]} text-white`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )}
      {/* Online indicator */}
      {showOnlineIndicator && (
        <div className={`absolute ${indicatorSizes[size]} bg-green-500 border-2 border-white rounded-full`}></div>
      )}
    </div>
  );
}
