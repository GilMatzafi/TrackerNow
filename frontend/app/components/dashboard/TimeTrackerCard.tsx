"use client";

import { useState, useEffect, useRef } from 'react';

// Custom launch animation styles
const launchModalStyles = `
  @keyframes launchModal {
    0% {
      transform: scale(0.2) translateY(80px) rotateX(15deg);
      opacity: 0;
      filter: blur(4px);
    }
    30% {
      transform: scale(0.8) translateY(20px) rotateX(5deg);
      opacity: 0.6;
      filter: blur(1px);
    }
    60% {
      transform: scale(1.08) translateY(-8px) rotateX(-2deg);
      opacity: 0.9;
      filter: blur(0px);
    }
    80% {
      transform: scale(0.98) translateY(2px) rotateX(1deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) translateY(0) rotateX(0deg);
      opacity: 1;
    }
  }
`;

export default function TimeTrackerCard() {
  const [timeRemaining, setTimeRemaining] = useState(2 * 60 + 35); // 2:35 in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState<'work' | 'break'>('work');
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'duration' | 'notifications'>('duration');
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [settings, setSettings] = useState({
    focusSession: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakAfter: 4,
    soundEnabled: true,
    notificationsEnabled: true
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Inject custom styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = launchModalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Switch between work and break
            setCurrentMode(prev => prev === 'work' ? 'break' : 'work');
            return prev === 'work' ? settings.shortBreak * 60 : settings.focusSession * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    const totalDuration = currentMode === 'work' ? settings.focusSession * 60 : settings.shortBreak * 60;
    return ((totalDuration - timeRemaining) / totalDuration) * 100;
  };

  const getModeColor = (): string => {
    return currentMode === 'work' ? '#FACC15' : '#10B981'; // Yellow-400 for work, green for break
  };

  const getModeText = (): string => {
    return currentMode === 'work' ? 'Work Time' : 'Break Time';
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(currentMode === 'work' ? settings.focusSession * 60 : settings.shortBreak * 60);
  };

  const progress = getProgress();
  const modeColor = getModeColor();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Time tracker</h3>
        <button 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setButtonPosition({
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2
            });
            setShowSettings(true);
          }}
          className="w-13 h-13 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Circular Timer */}
      <div className="flex justify-center mb-4">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
              strokeDasharray="5,5"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={modeColor}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Timer content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900 mb-2 font-mono">
              {formatTime(timeRemaining)}
            </div>
            <div 
              className="text-lg font-medium"
              style={{ color: currentMode === 'work' ? '#000000' : modeColor }}
            >
              {getModeText()}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-between items-center">
        {/* Left side - Play/Pause buttons */}
        <div className="flex space-x-3">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="w-13 h-13 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              <svg className="w-5 h-5 text-gray-700 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="w-13 h-13 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="w-13 h-13 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Right side - History/Settings button */}
        <button className="w-13 h-13 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-all duration-200 shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50">
          <div 
            onClick={() => setShowSettings(false)}
            className="absolute inset-0"
          ></div>
          <div 
            className="absolute bg-gray-900 rounded-3xl p-8 w-96 max-w-full shadow-2xl"
            style={{
              left: `${buttonPosition.x - 350}px`, // More to the left
              top: `${buttonPosition.y - 50}px`, // More down
              animation: 'launchModal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-200"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-800 rounded-2xl p-1 mb-8">
              <button
                onClick={() => setActiveTab('duration')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'duration'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                DURATION
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'notifications'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                NOTIFICATIONS
              </button>
            </div>

            {/* Content */}
            {activeTab === 'duration' && (
              <div className="space-y-6">
                {/* Focus Session */}
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg">Focus Session</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-2xl font-bold">{settings.focusSession}</span>
                    <span className="text-white text-sm">min</span>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Short break */}
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg">Short break</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-2xl font-bold">{settings.shortBreak.toString().padStart(2, '0')}</span>
                    <span className="text-white text-sm">min</span>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Long break */}
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg">Long break</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-2xl font-bold">{settings.longBreak}</span>
                    <span className="text-white text-sm">min</span>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Long break after */}
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg">Long break after</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-2xl font-bold">{settings.longBreakAfter}</span>
                    <span className="text-white text-sm">Sess.</span>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg">Sound Alerts</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-2xl font-bold">{settings.soundEnabled ? 'ON' : 'OFF'}</span>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white text-lg">Push Notifications</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-2xl font-bold">{settings.notificationsEnabled ? 'ON' : 'OFF'}</span>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
