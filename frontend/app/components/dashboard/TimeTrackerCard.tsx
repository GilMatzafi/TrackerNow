"use client";

import { useState, useEffect, useRef } from 'react';
import { usePomodoro } from '../../contexts/PomodoroContext';
import { useTimerSettings } from '../../hooks/useTimerSettings';

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
  const { addSession, getTodaySessions, refreshSessions } = usePomodoro();
  const { settings: backendSettings, updateSettings, loading: settingsLoading } = useTimerSettings();
  
  // Local settings state (will be synced with backend)
  const [settings, setSettings] = useState({
    focusSession: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakAfter: 4,
    soundEnabled: true,
    pauseStartSound: true,
    focusBreakSound: true
  });
  const [currentMode, setCurrentMode] = useState<'work' | 'break'>('work');
  const [timeRemaining, setTimeRemaining] = useState(settings.focusSession * 60); // Start with focus session duration
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'duration' | 'sounds'>('duration');
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Inject custom styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = launchModalStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Sync backend settings with local state
  useEffect(() => {
    if (backendSettings) {
      setSettings({
        focusSession: backendSettings.focus_session,
        shortBreak: backendSettings.short_break,
        longBreak: backendSettings.long_break,
        longBreakAfter: backendSettings.long_break_after,
        soundEnabled: backendSettings.sound_enabled,
        pauseStartSound: backendSettings.pause_start_sound,
        focusBreakSound: backendSettings.focus_break_sound
      });
    }
  }, [backendSettings]);

  // Get today's pomodoro count from backend (based on actual completed sessions, not current settings)
  const todayPomodoros = getTodaySessions().filter(session => 
    session.type === 'work' && session.completed
  ).length;

  // Update settings in backend
  const updateBackendSettings = async (updates: any) => {
    try {
      await updateSettings(updates);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  // Helper functions for settings updates
  const updateFocusSession = (newValue: number) => {
    setSettings(prev => ({ ...prev, focusSession: newValue }));
    updateBackendSettings({ focus_session: newValue });
  };

  const updateShortBreak = (newValue: number) => {
    setSettings(prev => ({ ...prev, shortBreak: newValue }));
    updateBackendSettings({ short_break: newValue });
  };

  const updateLongBreak = (newValue: number) => {
    setSettings(prev => ({ ...prev, longBreak: newValue }));
    updateBackendSettings({ long_break: newValue });
  };

  const updateLongBreakAfter = (newValue: number) => {
    setSettings(prev => ({ ...prev, longBreakAfter: newValue }));
    updateBackendSettings({ long_break_after: newValue });
  };

  const updatePauseStartSound = (newValue: boolean) => {
    setSettings(prev => ({ ...prev, pauseStartSound: newValue }));
    updateBackendSettings({ pause_start_sound: newValue });
  };

  const updateFocusBreakSound = (newValue: boolean) => {
    setSettings(prev => ({ ...prev, focusBreakSound: newValue }));
    updateBackendSettings({ focus_break_sound: newValue });
  };

  // Play sound function
  const playSound = (type: 'focusEnd' | 'breakEnd' | 'pauseStart') => {
    if (!settings.soundEnabled) return;
    
    // Create audio context for sound generation
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different sounds
    let frequency = 800; // Default frequency
    let duration = 0.3; // Default duration
    
    switch (type) {
      case 'focusEnd':
        if (!settings.focusBreakSound) return;
        frequency = 1000; // Higher pitch for focus end
        duration = 0.5;
        break;
      case 'breakEnd':
        if (!settings.focusBreakSound) return;
        frequency = 600; // Lower pitch for break end
        duration = 0.4;
        break;
      case 'pauseStart':
        if (!settings.pauseStartSound) return;
        frequency = 800; // Medium pitch for pause/start
        duration = 0.2;
        break;
    }
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Set volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  // Update timer when mode changes or settings change
  useEffect(() => {
    const expectedDuration = currentMode === 'work' ? settings.focusSession : settings.shortBreak;
    const expectedTime = expectedDuration * 60;
    
    // Always update timer when not running (paused or stopped)
    if (!isRunning) {
      setTimeRemaining(expectedTime);
    }
    // If running, only update if timer is at the expected full duration
    else if (timeRemaining === expectedTime) {
      setTimeRemaining(expectedTime);
    }
  }, [currentMode, settings.focusSession, settings.shortBreak, isRunning]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            
            // Save completed session (async)
            const sessionDuration = currentMode === 'work' ? settings.focusSession : 
                                  currentMode === 'break' ? settings.shortBreak : settings.longBreak;
            
            addSession({
              date: new Date().toISOString().split('T')[0],
              duration: sessionDuration,
              type: currentMode,
              completed: true
            }).catch(error => {
              console.error('Error saving session:', error);
            });

            // Refresh sessions to update the counter
            if (currentMode === 'work') {
              refreshSessions();
            }

            // Play appropriate sound
            if (currentMode === 'work') {
              playSound('focusEnd');
            } else {
              playSound('breakEnd');
            }

            // Switch between work and break
            setCurrentMode(prev => prev === 'work' ? 'break' : 'work');
            return currentMode === 'work' ? settings.shortBreak * 60 : settings.focusSession * 60;
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
  }, [isRunning, timeRemaining, currentMode, settings, addSession]);

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
    playSound('pauseStart');
  };

  const pauseTimer = () => {
    setIsRunning(false);
    playSound('pauseStart');
  };

  const skipMode = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    
    // If skipping a work session, count it as completed and save to history
    if (currentMode === 'work') {
      const sessionDuration = settings.focusSession;
      
      // Save completed session
      addSession({
        date: new Date().toISOString().split('T')[0],
        duration: sessionDuration,
        type: 'work',
        completed: true
      }).catch(error => {
        console.error('Error saving skipped session:', error);
      });

      // Refresh sessions to update the counter
      refreshSessions();
    }
    
    const nextMode = currentMode === 'work' ? 'break' : 'work';
    setCurrentMode(nextMode);
    const nextDuration = nextMode === 'work' ? settings.focusSession : settings.shortBreak;
    setTimeRemaining(nextDuration * 60);
  };

  const progress = getProgress();
  const modeColor = getModeColor();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-900">Time Tracker</h3>
        <button 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setButtonPosition({
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2
            });
            setShowSettings(true);
          }}
          className="w-13 h-13 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>


      {/* Circular Timer */}
      <div className="flex justify-center">
        <div className="relative w-56 h-56">
          <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 100 100">
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
            <div className="text-sm text-gray-500 mt-1">
              #{todayPomodoros}
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
              className="w-13 h-13 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5 text-gray-700 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="w-13 h-13 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            </button>
          )}
          
          <button
            onClick={skipMode}
            className="w-13 h-13 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Right side - History/Settings button */}
        <button className="w-13 h-13 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-all duration-200 shadow-sm cursor-pointer">
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
            className="absolute bg-gray-900 rounded-3xl p-10 w-[500px] h-[600px] max-w-full shadow-2xl"
            style={{
              left: `${buttonPosition.x - 450}px`, // More to the left
              top: `${buttonPosition.y - 50}px`, // More down
              animation: 'launchModal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-200 cursor-pointer"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-800 rounded-2xl p-1 mb-8">
              <button
                onClick={() => setActiveTab('duration')}
                className={`flex-1 py-4 px-6 rounded-xl text-lg font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === 'duration'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                DURATION
              </button>
              <button
                onClick={() => setActiveTab('sounds')}
                className={`flex-1 py-4 px-6 rounded-xl text-lg font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === 'sounds'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                SOUNDS
              </button>
            </div>

            {/* Content */}
            {activeTab === 'duration' && (
              <div className="space-y-8 mt-14">
                {/* Focus Session */}
                <div className="flex justify-between items-center">
                  <span className="text-white text-2xl">Focus Session</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateFocusSession(Math.max(5, settings.focusSession - 5))}
                      className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <span className="text-white text-xl">-</span>
                    </button>
                    <span className="text-white text-3xl font-bold w-16 text-center">{settings.focusSession}</span>
                    <button
                      onClick={() => updateFocusSession(Math.min(60, settings.focusSession + 5))}
                      className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <span className="text-white text-xl">+</span>
                    </button>
                    <span className="text-white text-lg ml-2 w-8 text-left">min</span>
                  </div>
                </div>

                {/* Short break */}
                <div className="flex justify-between items-center">
                  <span className="text-white text-2xl">Short break</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateShortBreak(Math.max(1, settings.shortBreak - 1))}
                      className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <span className="text-white text-xl">-</span>
                    </button>
                    <span className="text-white text-3xl font-bold w-16 text-center">{settings.shortBreak.toString().padStart(2, '0')}</span>
                    <button
                      onClick={() => updateShortBreak(Math.min(30, settings.shortBreak + 1))}
                      className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <span className="text-white text-xl">+</span>
                    </button>
                    <span className="text-white text-lg ml-2 w-8 text-left">min</span>
                  </div>
                </div>

                {/* Long break */}
                <div className="flex justify-between items-center">
                  <span className="text-white text-2xl">Long break</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateLongBreak(Math.max(5, settings.longBreak - 5))}
                      className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <span className="text-white text-xl">-</span>
                    </button>
                    <span className="text-white text-3xl font-bold w-16 text-center">{settings.longBreak}</span>
                    <button
                      onClick={() => updateLongBreak(Math.min(60, settings.longBreak + 5))}
                      className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <span className="text-white text-xl">+</span>
                    </button>
                    <span className="text-white text-lg ml-2 w-8 text-left">min</span>
                  </div>
                </div>

                {/* Long break after */}
                <div className="flex justify-between items-center">
                  <span className="text-white text-2xl">Long break after</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateLongBreakAfter(Math.max(2, settings.longBreakAfter - 1))}
                      className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <span className="text-white text-xl">-</span>
                    </button>
                    <span className="text-white text-3xl font-bold w-16 text-center">{settings.longBreakAfter.toString()}</span>
                    <button
                      onClick={() => updateLongBreakAfter(Math.min(10, settings.longBreakAfter + 1))}
                      className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <span className="text-white text-xl">+</span>
                    </button>
                    <span className="text-white text-lg ml-2 w-8 text-left">Sess.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sounds' && (
              <div className="space-y-8 mt-10">
                <div className="flex justify-between items-center">
                  <span className="text-white text-2xl">Pause/Start Sound</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-white text-3xl font-bold">{settings.pauseStartSound ? 'ON' : 'OFF'}</span>
                    <button
                      onClick={() => updatePauseStartSound(!settings.pauseStartSound)}
                      className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white text-2xl">Focus/Break Sound</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-white text-3xl font-bold">{settings.focusBreakSound ? 'ON' : 'OFF'}</span>
                    <button
                      onClick={() => updateFocusBreakSound(!settings.focusBreakSound)}
                      className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
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
