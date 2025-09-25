"use client";

import { Problem } from '../../types/problem';

interface ProblemDistributionProps {
  problems: Problem[];
}

export default function ProblemDistribution({ problems }: ProblemDistributionProps) {
  // Process problems data to create topic distribution
  const topicCounts: { [key: string]: number } = {};
  
  problems.forEach(problem => {
    problem.topics.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
  });

  // Convert to array and sort by count
  const data = Object.entries(topicCounts)
    .map(([topic, count]) => ({
      topic,
      count,
      percentage: 0 // Will calculate below
    }))
    .sort((a, b) => b.count - a.count);

  const totalProblems = data.reduce((sum, item) => sum + item.count, 0);
  
  // Calculate percentages
  data.forEach(item => {
    item.percentage = totalProblems > 0 ? Math.round((item.count / totalProblems) * 100) : 0;
  });

  // Show empty state if no problems
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Problems Yet</h3>
          <p className="text-lg text-gray-500">Start adding problems to see your topic distribution</p>
        </div>
      </div>
    );
  }

  const colors = [
    '#8B5CF6', // vibrant purple
    '#10B981', // emerald green
    '#F59E0B', // amber
    '#EF4444', // red
    '#3B82F6', // blue
    '#EC4899', // pink
    '#06B6D4'  // cyan
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-4xl font-semibold text-gray-900">Problem Distribution</h3>
          <p className="text-xl text-gray-500">By topic category</p>
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

      {/* Donut Chart Visualization */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-40 h-40 group">
          {/* Background circle */}
          <svg className="w-40 h-40 transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="6"
            />
            {/* Data segments */}
            {data.map((item, index) => {
              const circumference = 2 * Math.PI * 40;
              const strokeDasharray = circumference;
              const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
              const rotation = data.slice(0, index).reduce((sum, prev) => sum + (prev.percentage / 100) * 360, 0);
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={colors[index] || '#6b7280'}
                  strokeWidth="6"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(${rotation} 50 50)`}
                  className="transition-all duration-1000 ease-out hover:stroke-width-8 cursor-pointer"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                  } as React.CSSProperties}
                />
              );
            })}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white rounded-full p-8 shadow-lg">
              <div className="text-4xl font-bold text-gray-900">{totalProblems}</div>
              <div className="text-xl text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
            <div className="flex items-center space-x-4">
              <div 
                className="w-6 h-6 rounded-full shadow-sm group-hover:scale-110 transition-transform" 
                style={{ backgroundColor: colors[index] || '#6b7280' }}
              ></div>
              <span className="text-2xl font-medium text-gray-900 group-hover:text-gray-700 transition-colors">{item.topic}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{item.count}</div>
              <div className="text-lg text-gray-500 font-medium">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div>
            <span className="text-gray-500">Most Practiced:</span>
            <span className="font-medium text-gray-900 ml-2">
              {data[0]?.topic}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Least Practiced:</span>
            <span className="font-medium text-gray-900 ml-2">
              {data[data.length - 1]?.topic}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
