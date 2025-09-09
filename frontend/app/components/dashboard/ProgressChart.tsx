"use client";

interface ProgressChartProps {
  data: Array<{
    day: string;
    problems: number;
    hours: number;
  }>;
}

export default function ProgressChart({ data }: ProgressChartProps) {
  // Add safety check for data
  if (!data || data.length === 0) {
    return (
      <div className="animate-on-load animate-slide-in-left delay-500">
        <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxProblems = Math.max(...data.map(d => d.problems));
  const totalProblems = data.reduce((sum, d) => sum + d.problems, 0);
  const previousWeekTotal = 28; // Mock previous week data
  const change = ((totalProblems - previousWeekTotal) / previousWeekTotal) * 100;

  return (
    <div className="animate-on-load animate-slide-in-left" style={{ animationDelay: '2.5s' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-gray-900">{totalProblems}</span>
            <span className="text-sm text-gray-500 ml-2">problems solved</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors">
              <span>This Week</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
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


      {/* Vertical Bar Chart */}
      <div className="mt-8">
        <h4 className="text-base font-semibold text-gray-800 mb-10">Problems Solved This Week</h4>
        <div className="flex items-end justify-between space-x-4 h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 shadow-inner">
          {data.map((item, index) => {
            const colors = [
              'bg-gradient-to-t from-green-600 to-green-400',
              'bg-gradient-to-t from-sky-600 to-sky-400',
              'bg-gradient-to-t from-blue-600 to-blue-400',
              'bg-gradient-to-t from-indigo-600 to-indigo-400',
              'bg-gradient-to-t from-purple-600 to-purple-400',
              'bg-gradient-to-t from-pink-600 to-pink-400',
              'bg-gradient-to-t from-rose-600 to-rose-400'
            ];
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                <div className="text-lg font-bold text-gray-900 mb-8 group-hover:text-green-600 transition-colors">{item.problems}</div>
                <div 
                  className={`w-full ${colors[index]} rounded-t-xl transition-all duration-1000 ease-out shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer animate-on-load animate-scale-in`}
                  style={{ 
                    height: `${(item.problems / maxProblems) * 220}px`,
                    minHeight: '20px',
                    animationDelay: `${3.0 + index * 0.1}s`
                  }}
                ></div>
                <div className="text-sm text-gray-600 mt-6 font-medium group-hover:text-gray-800 transition-colors">{item.day}</div>
              </div>
            );
          })}
        </div>
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
