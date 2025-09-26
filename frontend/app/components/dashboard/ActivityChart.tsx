"use client";

import { useState } from 'react';
import { Problem } from '../../types/problem';

interface ActivityChartProps {
  problems: Problem[];
}

type TimePeriod = 'daily' | 'weekly' | 'monthly';

interface ActivityData {
  period: string;
  count: number;
  date: Date;
}

export default function ActivityChart({ problems }: ActivityChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('weekly');

  // Process problems data based on selected period
  const processActivityData = (period: TimePeriod): ActivityData[] => {
    const activityMap = new Map<string, number>();

    problems.forEach(problem => {
      if (!problem.created_at) return;
      
      const date = new Date(problem.created_at);
      let key: string;
      
      switch (period) {
        case 'daily':
          key = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'weekly':
          // Get start of week (Monday)
          const startOfWeek = new Date(date);
          const day = startOfWeek.getDay();
          const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
          startOfWeek.setDate(diff);
          key = startOfWeek.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }
      
      activityMap.set(key, (activityMap.get(key) || 0) + 1);
    });

    // Convert to array and sort by date
    return Array.from(activityMap.entries())
      .map(([period, count]) => ({
        period,
        count,
        date: new Date(period + (period.includes('-') && period.length === 7 ? '-01' : ''))
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const activityData = processActivityData(selectedPeriod);
  const maxCount = Math.max(...activityData.map(d => d.count), 1);

  // Show empty state if no problems
  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Problems Yet</h3>
          <p className="text-lg text-gray-500">Start adding problems to see your activity patterns</p>
        </div>
      </div>
    );
  }

  // Show message if no activity data (problems exist but no creation dates)
  if (activityData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Activity Data</h3>
          <p className="text-lg text-gray-500">Problems exist but no creation dates available</p>
        </div>
      </div>
    );
  }

  const formatPeriodLabel = (period: string, timePeriod: TimePeriod): string => {
    const date = new Date(period + (period.includes('-') && period.length === 7 ? '-01' : ''));
    
    switch (timePeriod) {
      case 'daily':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'weekly':
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + 6);
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { day: 'numeric' })}`;
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      default:
        return period;
    }
  };

  const getTotalProblems = () => activityData.reduce((sum, item) => sum + item.count, 0);
  const getAveragePerPeriod = () => activityData.length > 0 ? Math.round(getTotalProblems() / activityData.length * 10) / 10 : 0;
  const getMostActivePeriod = () => {
    const maxItem = activityData.reduce((max, item) => item.count > max.count ? item : max, activityData[0]);
    return maxItem ? formatPeriodLabel(maxItem.period, selectedPeriod) : 'N/A';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-4xl font-semibold text-gray-900">Activity Chart</h3>
          <p className="text-xl text-gray-500">Problems solved over time</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Time Period Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['daily', 'weekly', 'monthly'] as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-md text-lg font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-900 mb-1">{getTotalProblems()}</div>
          <div className="text-lg text-blue-700">Total Problems</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-900 mb-1">{getAveragePerPeriod()}</div>
          <div className="text-lg text-green-700">Avg per {selectedPeriod.slice(0, -2)}</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-900 mb-1">{activityData.length}</div>
          <div className="text-lg text-purple-700">Active {selectedPeriod}s</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-8">
        <div className="space-y-4">
          {activityData.map((item, index) => {
            const height = (item.count / maxCount) * 100;
            const isRecent = index === activityData.length - 1;
            
            return (
              <div key={item.period} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium text-gray-900">
                    {formatPeriodLabel(item.period, selectedPeriod)}
                    {isRecent && <span className="ml-2 text-sm text-blue-600 font-semibold">Latest</span>}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                    <div className="text-sm text-gray-500">problems</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80 ${
                      isRecent 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}
                    style={{ width: `${height}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 text-lg">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Most active:</span>
              <span className="font-medium text-gray-900">{getMostActivePeriod()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Consistency:</span>
              <span className="font-medium text-gray-900">
                {activityData.length > 0 ? Math.round((activityData.filter(item => item.count > 0).length / activityData.length) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="space-y-3 text-lg">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Peak activity:</span>
              <span className="font-medium text-gray-900">
                {Math.max(...activityData.map(d => d.count))} problems
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Current streak:</span>
              <span className="font-medium text-gray-900">
                {(() => {
                  let streak = 0;
                  for (let i = activityData.length - 1; i >= 0; i--) {
                    if (activityData[i].count > 0) streak++;
                    else break;
                  }
                  return streak;
                })()} {selectedPeriod}s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
