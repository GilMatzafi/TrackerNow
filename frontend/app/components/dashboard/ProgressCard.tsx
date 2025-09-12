"use client";

import { useState, useEffect } from 'react';
import { usePomodoro } from '../../contexts/PomodoroContext';

export default function ProgressCard() {
  const { getWeeklySessions, getTotalWorkTime } = usePomodoro();
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [totalTime, setTotalTime] = useState(0);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  // Get current week dates (Sunday to Saturday)
  const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek); // Go back to Sunday
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  // Get day names for current week
  const getDayNames = () => {
    const weekDates = getCurrentWeekDates();
    return weekDates.map(date => {
      const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      return dayNames[date.getDay()];
    });
  };

  // Update data when Pomodoro sessions change
  useEffect(() => {
    const sessions = getWeeklySessions();
    const weekDates = getCurrentWeekDates();
    const dailyMinutes = [0, 0, 0, 0, 0, 0, 0];
    let totalMinutes = 0;

    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const dayIndex = weekDates.findIndex(weekDate => 
        weekDate.toDateString() === sessionDate.toDateString()
      );
      
      if (dayIndex !== -1 && session.type === 'work' && session.completed) {
        dailyMinutes[dayIndex] += session.duration;
        totalMinutes += session.duration;
      }
    });

    setWeeklyData(dailyMinutes);
    setTotalTime(totalMinutes);

    // Set current day as expanded by default
    const today = new Date();
    const currentDayIndex = weekDates.findIndex(weekDate => 
      weekDate.toDateString() === today.toDateString()
    );
    if (currentDayIndex !== -1) {
      setExpandedDays(new Set([currentDayIndex]));
    }
  }, [getWeeklySessions, getTotalWorkTime]);

  // Calculate bar heights (max height = 80, scale based on max daily time)
  const maxDailyTime = Math.max(...weeklyData, 1);
  const barHeights = weeklyData.map((minutes, index) => {
    const baseHeight = Math.max(8, (minutes / maxDailyTime) * 80);
    // Make expanded bars taller
    return expandedDays.has(index) ? baseHeight + 20 : baseHeight;
  });

  // Toggle day expansion (only one day can be expanded at a time)
  const toggleDay = (dayIndex: number) => {
    setExpandedDays(prev => {
      if (prev.has(dayIndex)) {
        // If clicking the same day, close it
        return new Set();
      } else {
        // If clicking a different day, close all others and open this one
        return new Set([dayIndex]);
      }
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const dayNames = getDayNames();

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-200 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Progress</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatTime(totalTime)}
            </span>
            <span className="text-sm text-gray-600">Work Time this week</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {/* Bar chart - bars going upward */}
        <div className="flex items-end justify-between h-32 mb-4">
          {barHeights.map((height, index) => (
            <div key={index} className="flex flex-col items-center w-8">
              {/* Time label above bar */}
              {weeklyData[index] > 0 && expandedDays.has(index) && (
                <div className="mb-2 bg-yellow-400 text-yellow-800 px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-sm">
                  {formatTime(weeklyData[index])}
                </div>
              )}
              
              {/* Bar */}
              <div
                className={`w-3 rounded-full relative cursor-pointer transition-all duration-300 hover:opacity-80 ${
                  weeklyData[index] > 0 
                    ? (expandedDays.has(index) ? 'bg-yellow-400' : 'bg-gray-800')
                    : 'bg-gray-200'
                }`}
                style={{ height: `${height}px` }}
                onClick={() => weeklyData[index] > 0 && toggleDay(index)}
              />
              
              {/* Dot below bar */}
              <div 
                className={`w-2 h-2 rounded-full mt-2 ${
                  weeklyData[index] > 0 
                    ? (expandedDays.has(index) ? 'bg-yellow-400' : 'bg-gray-800')
                    : 'bg-gray-300'
                }`}
              />
            </div>
          ))}
        </div>
        
        {/* Day labels */}
        <div className="flex justify-between text-lg font-medium text-gray-600">
          {dayNames.map((day, index) => (
            <span key={index} className="w-8 text-center">{day}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
