"use client";

import { PomodoroStats as PomodoroStatsType } from '../../types/pomodoro';

interface PomodoroStatsProps {
  stats: PomodoroStatsType;
  loading?: boolean;
}

export default function PomodoroStats({ stats, loading = false }: PomodoroStatsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pomodoro Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="text-center">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pomodoro Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total_pomodoros}</div>
          <div className="text-sm text-gray-600">Total Pomodoros</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed_pomodoros}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.work_pomodoros}</div>
          <div className="text-sm text-gray-600">Work Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(stats.completion_rate)}%
          </div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Completion Rate</span>
          <span>{Math.round(stats.completion_rate)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(stats.completion_rate, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
