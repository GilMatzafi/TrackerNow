"use client";

import { useState, useEffect, useRef } from 'react';
import { Pomodoro } from '../../types/pomodoro';

interface PomodoroTimerProps {
  pomodoro: Pomodoro;
  onComplete: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

export default function PomodoroTimer({ 
  pomodoro, 
  onComplete, 
  onPause, 
  onResume, 
  onCancel 
}: PomodoroTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Calculate initial time remaining
  useEffect(() => {
    const totalSeconds = pomodoro.duration_minutes * 60;
    const pausedSeconds = pomodoro.paused_duration_seconds;
    
    if (pomodoro.status === 'RUNNING' && pomodoro.started_at) {
      const startTime = new Date(pomodoro.started_at);
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const remaining = Math.max(0, totalSeconds - elapsedSeconds - pausedSeconds);
      setTimeRemaining(remaining);
      setIsRunning(true);
    } else if (pomodoro.status === 'PAUSED') {
      const totalPaused = pausedSeconds;
      const remaining = Math.max(0, totalSeconds - totalPaused);
      setTimeRemaining(remaining);
      setIsPaused(true);
    } else {
      setTimeRemaining(totalSeconds);
    }
  }, [pomodoro]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, onComplete]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    const totalSeconds = pomodoro.duration_minutes * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'WORK':
        return 'text-red-600';
      case 'SHORT_BREAK':
        return 'text-green-600';
      case 'LONG_BREAK':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeDisplayName = (type: string): string => {
    switch (type) {
      case 'WORK':
        return 'Work Session';
      case 'SHORT_BREAK':
        return 'Short Break';
      case 'LONG_BREAK':
        return 'Long Break';
      default:
        return type;
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
    onPause();
  };

  const handleResume = () => {
    setIsRunning(true);
    setIsPaused(false);
    onResume();
  };

  const handleCancel = () => {
    setIsRunning(false);
    setIsPaused(false);
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold ${getTypeColor(pomodoro.pomodoro_type)}`}>
          {getTypeDisplayName(pomodoro.pomodoro_type)}
        </h2>
        <p className="text-gray-600 mt-2">{pomodoro.title}</p>
      </div>

      {/* Timer Circle */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
            className={`transition-all duration-1000 ${
              pomodoro.pomodoro_type === 'WORK' ? 'text-red-500' :
              pomodoro.pomodoro_type === 'SHORT_BREAK' ? 'text-green-500' :
              'text-blue-500'
            }`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Timer text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-gray-900">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {isRunning ? 'Running' : isPaused ? 'Paused' : 'Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {!isRunning && !isPaused && (
          <button
            onClick={() => {
              setIsRunning(true);
              onResume();
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Start
          </button>
        )}
        
        {isRunning && (
          <button
            onClick={handlePause}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Pause
          </button>
        )}
        
        {isPaused && (
          <button
            onClick={handleResume}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Resume
          </button>
        )}
        
        {(isRunning || isPaused) && (
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Description */}
      {pomodoro.description && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">{pomodoro.description}</p>
        </div>
      )}
    </div>
  );
}
