"use client";

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthErrorHandlerProps {
  children: React.ReactNode;
}

export default function AuthErrorHandler({ children }: AuthErrorHandlerProps) {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Listen for authentication errors
    const handleAuthError = (event: CustomEvent) => {
      if (event.detail?.message?.includes('Authentication failed')) {
        // Redirect to login page
        window.location.href = '/auth/login';
      }
    };

    window.addEventListener('auth-error', handleAuthError as EventListener);
    
    return () => {
      window.removeEventListener('auth-error', handleAuthError as EventListener);
    };
  }, []);

  return <>{children}</>;
}
