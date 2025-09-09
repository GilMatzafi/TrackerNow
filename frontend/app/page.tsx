"use client";

import Link from 'next/link';
import Background from './components/Background';
import Button from './components/Button';
import Avatar from './components/Avatar';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: '#161316' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="relative min-h-screen" style={{ backgroundColor: '#161316' }}>
        <Background />

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Welcome message */}
            <h1 
              className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold mb-8 leading-tight"
              style={{ color: '#FFFFFF' }}
            >
              Welcome Back,{" "}
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(to right, #936DFF, #54A388)'
                }}
              >
                {user.first_name}
              </span>!
            </h1>

            {/* Sub headline */}
            <p 
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-16 max-w-4xl mx-auto leading-relaxed"
              style={{ color: '#A6A3AD' }}
            >
              Ready to continue your coding interview journey? 
              Track your progress and manage your applications with ease.
            </p>

            {/* User info and Dashboard buttons */}
            <div className="flex flex-col items-center space-y-6">
              {/* User Avatar */}
              <div className="flex items-center space-x-4">
                <Avatar user={user} size="xl" showOnlineIndicator={true} />
                <div className="text-left">
                  <p className="text-lg font-medium text-white">
                    {user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : 'User'
                    }
                  </p>
                  <p className="text-sm text-gray-300">Ready to code!</p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/dashboard">
                  <Button variant="primary">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button variant="secondary" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
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
