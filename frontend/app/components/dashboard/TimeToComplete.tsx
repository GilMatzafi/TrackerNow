"use client";

import { Problem } from '../../types/problem';

interface TimeToCompleteProps {
  problems: Problem[];
}

export default function TimeToComplete({ problems }: TimeToCompleteProps) {
  // Process problems data to calculate average time by difficulty
  const difficultyStats = {
    EASY: { totalTime: 0, count: 0, problems: [] as Problem[] },
    MEDIUM: { totalTime: 0, count: 0, problems: [] as Problem[] },
    HARD: { totalTime: 0, count: 0, problems: [] as Problem[] }
  };

  // Calculate statistics for each difficulty
  problems.forEach(problem => {
    if (problem.time_minutes && problem.time_minutes > 0) {
      const difficulty = problem.difficulty as keyof typeof difficultyStats;
      if (difficultyStats[difficulty]) {
        difficultyStats[difficulty].totalTime += problem.time_minutes;
        difficultyStats[difficulty].count += 1;
        difficultyStats[difficulty].problems.push(problem);
      }
    }
  });

  // Calculate averages
  const averages = {
    EASY: difficultyStats.EASY.count > 0 ? Math.round(difficultyStats.EASY.totalTime / difficultyStats.EASY.count) : 0,
    MEDIUM: difficultyStats.MEDIUM.count > 0 ? Math.round(difficultyStats.MEDIUM.totalTime / difficultyStats.MEDIUM.count) : 0,
    HARD: difficultyStats.HARD.count > 0 ? Math.round(difficultyStats.HARD.totalTime / difficultyStats.HARD.count) : 0
  };

  // Get max time for chart scaling
  const maxTime = Math.max(averages.EASY, averages.MEDIUM, averages.HARD, 1);

  // Show empty state if no problems at all
  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Problems Yet</h3>
          <p className="text-lg text-gray-500">Start adding problems to see time analytics</p>
        </div>
      </div>
    );
  }

  // Check if we have time data
  const hasTimeData = Object.values(averages).some(time => time > 0);

  // If no time data but we have problems, show problem counts by difficulty
  if (!hasTimeData) {
    const difficultyCounts = {
      EASY: problems.filter(p => p.difficulty === 'EASY').length,
      MEDIUM: problems.filter(p => p.difficulty === 'MEDIUM').length,
      HARD: problems.filter(p => p.difficulty === 'HARD').length
    };

    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-4xl font-semibold text-gray-900">Time to Complete</h3>
            <p className="text-xl text-gray-500">Average time spent by difficulty</p>
          </div>
        </div>

        {/* No Time Data Message */}
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Time Data Yet</h3>
          <p className="text-lg text-gray-500 mb-8">Start tracking time spent on problems to see analytics</p>
          
          {/* Show problem counts by difficulty */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {Object.entries(difficultyCounts).map(([difficulty, count]) => (
              <div key={difficulty} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  difficulty === 'EASY' ? 'bg-green-100' : 
                  difficulty === 'MEDIUM' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <span className="text-2xl">
                    {difficulty === 'EASY' ? '🟢' : difficulty === 'MEDIUM' ? '🟡' : '🔴'}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{difficulty}</h4>
                <div className="text-3xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500">problems</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    EASY: '#10B981', // emerald
    MEDIUM: '#F59E0B', // amber
    HARD: '#EF4444'  // red
  };

  const difficultyLabels = {
    EASY: 'Easy',
    MEDIUM: 'Medium', 
    HARD: 'Hard'
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-4xl font-semibold text-gray-900">Time to Complete</h3>
          <p className="text-xl text-gray-500">Average time spent by difficulty</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-pointer">
              <span>All Time</span>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="mb-8">
        <div className="space-y-6">
          {Object.entries(averages).map(([difficulty, avgTime]) => {
            if (avgTime === 0) return null;
            
            const percentage = (avgTime / maxTime) * 100;
            const color = difficultyColors[difficulty as keyof typeof difficultyColors];
            const label = difficultyLabels[difficulty as keyof typeof difficultyLabels];
            const count = difficultyStats[difficulty as keyof typeof difficultyStats].count;
            
            return (
              <div key={difficulty} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-2xl font-medium text-gray-900">{label}</span>
                    <span className="text-lg text-gray-500">({count} problems)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{formatTime(avgTime)}</div>
                    <div className="text-lg text-gray-500">average</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: color
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(averages).map(([difficulty, avgTime]) => {
          if (avgTime === 0) return null;
          
          const color = difficultyColors[difficulty as keyof typeof difficultyColors];
          const label = difficultyLabels[difficulty as keyof typeof difficultyLabels];
          const count = difficultyStats[difficulty as keyof typeof difficultyStats].count;
          const totalTime = difficultyStats[difficulty as keyof typeof difficultyStats].totalTime;
          
          return (
            <div key={difficulty} className="bg-gray-50 rounded-xl p-6 text-center group hover:bg-gray-100 transition-colors">
              <div 
                className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: color }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{label}</h4>
              <div className="text-3xl font-bold text-gray-900 mb-1">{formatTime(avgTime)}</div>
              <div className="text-lg text-gray-500 mb-2">average time</div>
              <div className="text-sm text-gray-400">
                {count} problems • {formatTime(totalTime)} total
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Insights</h4>
        <div className="space-y-3 text-lg">
          {(() => {
            const sortedDifficulties = Object.entries(averages)
              .filter(([_, time]) => time > 0)
              .sort(([_, a], [__, b]) => b - a);
            
            if (sortedDifficulties.length === 0) return null;
            
            const [fastestDiff, fastestTime] = sortedDifficulties[sortedDifficulties.length - 1];
            const [slowestDiff, slowestTime] = sortedDifficulties[0];
            const fastestLabel = difficultyLabels[fastestDiff as keyof typeof difficultyLabels];
            const slowestLabel = difficultyLabels[slowestDiff as keyof typeof difficultyLabels];
            
            return (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Fastest at:</span>
                  <span className="font-medium text-gray-900">{fastestLabel} problems ({formatTime(fastestTime)})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Most challenging:</span>
                  <span className="font-medium text-gray-900">{slowestLabel} problems ({formatTime(slowestTime)})</span>
                </div>
                {slowestTime > fastestTime && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Time difference:</span>
                    <span className="font-medium text-gray-900">{formatTime(slowestTime - fastestTime)} longer for {slowestLabel}</span>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
