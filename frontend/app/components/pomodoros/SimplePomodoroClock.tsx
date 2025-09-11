"use client";

import { useState, useEffect, useRef } from 'react';
import { Pomodoro } from '../../types/pomodoro';

interface SimplePomodoroClockProps {
  activePomodoro: Pomodoro | null;
  onStart: (id: number) => void;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

export default function SimplePomodoroClock({
  activePomodoro,
  onStart,
  onPause,
  onResume,
  onComplete,
  onCancel
}: SimplePomodoroClockProps) {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentType, setCurrentType] = useState<'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'>('WORK');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for notifications
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioRef.current = audioContext as unknown as HTMLAudioElement;
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audioContext = audioRef.current as unknown as AudioContext;
      if (audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch {
      console.log('Audio not available');
    }
  };

  // Update timer based on active pomodoro
  useEffect(() => {
    if (activePomodoro) {
      const totalSeconds = activePomodoro.duration_minutes * 60;
      const pausedSeconds = activePomodoro.paused_duration_seconds;
      
      if (activePomodoro.status === 'RUNNING' && activePomodoro.started_at) {
        const startTime = new Date(activePomodoro.started_at);
        const now = new Date();
        const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const remaining = Math.max(0, totalSeconds - elapsedSeconds - pausedSeconds);
        setTimeRemaining(remaining);
        setIsRunning(true);
        setIsPaused(false);
      } else if (activePomodoro.status === 'PAUSED') {
        const remaining = Math.max(0, totalSeconds - pausedSeconds);
        setTimeRemaining(remaining);
        setIsRunning(false);
        setIsPaused(true);
      } else {
        setTimeRemaining(totalSeconds);
        setIsRunning(false);
        setIsPaused(false);
      }
      
      setCurrentType(activePomodoro.pomodoro_type);
    } else {
      // Default to 25-minute work session
      setTimeRemaining(25 * 60);
      setIsRunning(false);
      setIsPaused(false);
      setCurrentType('WORK');
    }
  }, [activePomodoro]);

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            playNotificationSound();
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
    const totalSeconds = activePomodoro ? activePomodoro.duration_minutes * 60 : 25 * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'WORK':
        return 'text-red-500';
      case 'SHORT_BREAK':
        return 'text-green-500';
      case 'LONG_BREAK':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTypeDisplayName = (type: string): string => {
    switch (type) {
      case 'WORK':
        return 'Work';
      case 'SHORT_BREAK':
        return 'Break';
      case 'LONG_BREAK':
        return 'Long Break';
      default:
        return type;
    }
  };

  const handleClockClick = () => {
    if (!activePomodoro) {
      // Start a local timer without creating a pomodoro in the database
      setIsRunning(true);
      setTimeRemaining(currentType === 'WORK' ? 25 * 60 : currentType === 'SHORT_BREAK' ? 5 * 60 : 15 * 60);
    } else if (activePomodoro.status === 'PENDING') {
      onStart(activePomodoro.id);
    } else if (activePomodoro.status === 'RUNNING') {
      onPause();
    } else if (activePomodoro.status === 'PAUSED') {
      onResume();
    }
  };

  const handleTypeChange = (type: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK') => {
    if (!isRunning && !isPaused) {
      setCurrentType(type);
      const duration = type === 'WORK' ? 25 : type === 'SHORT_BREAK' ? 5 : 15;
      setTimeRemaining(duration * 60);
    }
  };

  const handleStop = () => {
    if (activePomodoro) {
      onCancel();
    } else {
      setIsRunning(false);
      setIsPaused(false);
      setTimeRemaining(currentType === 'WORK' ? 25 * 60 : currentType === 'SHORT_BREAK' ? 5 * 60 : 15 * 60);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      {/* Type Selector */}
      {!isRunning && !isPaused && (
        <div className="mb-8">
          <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
            {(['WORK', 'SHORT_BREAK', 'LONG_BREAK'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentType === type
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {getTypeDisplayName(type)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Clock */}
      <div className="relative">
        <button
          onClick={handleClockClick}
          className="relative w-80 h-80 rounded-full border-8 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
          style={{
            borderColor: isRunning ? '#ef4444' : isPaused ? '#f59e0b' : '#e5e7eb'
          }}
        >
          {/* Progress Circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 46}`}
              strokeDashoffset={`${2 * Math.PI * 46 * (1 - getProgressPercentage() / 100)}`}
              className={`transition-all duration-1000 ${
                currentType === 'WORK' ? 'text-red-500' :
                currentType === 'SHORT_BREAK' ? 'text-green-500' :
                'text-blue-500'
              }`}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-gray-900 mb-2">
                {formatTime(timeRemaining)}
              </div>
              <div className={`text-lg font-medium ${getTypeColor(currentType)}`}>
                {getTypeDisplayName(currentType)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {isRunning ? 'Running' : isPaused ? 'Paused' : 'Click to Start'}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Controls */}
      {(isRunning || isPaused) && (
        <div className="mt-8 flex space-x-4">
          {isRunning ? (
            <button
              onClick={onPause}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={onResume}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Resume
            </button>
          )}
          <button
            onClick={handleStop}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Stop
          </button>
        </div>
      )}
    </div>
  );
}
