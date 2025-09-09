"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Background from './components/Background';
import Button from './components/Button';
import Avatar from './components/Avatar';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: '#161316' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: '#161316' }}>
        <div className="text-white text-xl">Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#161316' }}>
      <Background />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main headline */}
          <h1 
            className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold mb-8 leading-tight"
            style={{ color: '#FFFFFF' }}
          >
            Track and Manage Your{" "}
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(to right, #936DFF, #54A388)'
              }}
            >
              Coding Interviews
            </span>{" "}
            Like a Pro
          </h1>

          {/* Sub headline */}
          <p 
            className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-16 max-w-4xl mx-auto leading-relaxed"
            style={{ color: '#A6A3AD' }}
          >
            A clean, secure platform to track problems and applications. 
            Organize your coding journey with powerful tools designed for developers.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button variant="primary">
                Sign Up
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
