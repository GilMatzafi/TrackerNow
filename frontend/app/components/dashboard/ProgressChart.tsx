"use client";

interface ProgressChartProps {
  data: Array<{
    day: string;
    problems: number;
    hours: number;
  }>;
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const maxProblems = Math.max(...data.map(d => d.problems));
  const totalProblems = data.reduce((sum, d) => sum + d.problems, 0);
  const previousWeekTotal = 28; // Mock previous week data
  const change = ((totalProblems - previousWeekTotal) / previousWeekTotal) * 100;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-gray-900">{totalProblems}</span>
            <span className="text-sm text-gray-500 ml-2">problems solved</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Change indicator */}
      <div className="flex items-center mb-6">
        <span className={`text-sm font-medium ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
        <svg 
          className={`w-4 h-4 ml-1 ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {change >= 0 ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          )}
        </svg>
        <span className="text-sm text-gray-500 ml-2">
          vs previous week
        </span>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-12 text-sm text-gray-600 font-medium">
              {item.day}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.problems / maxProblems) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {item.problems}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {item.hours}h practice
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-gray-600">Problems Solved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">Practice Hours</span>
            </div>
          </div>
          <button className="text-primary hover:text-primary/80 font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
