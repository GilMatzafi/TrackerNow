"use client";

interface TimeSpentChartProps {
  data: Array<{
    day: string;
    problems: number;
    hours: number;
  }>;
}

export default function TimeSpentChart({ data }: TimeSpentChartProps) {
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);
  const maxHours = Math.max(...data.map(d => d.hours));
  const previousWeekHours = 18.5; // Mock previous week data
  const change = ((totalHours - previousWeekHours) / previousWeekHours) * 100;

  return (
    <div className="animate-on-load animate-slide-in-right" style={{ animationDelay: '4.3s' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Time Spent Coding</h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</span>
            <span className="text-sm text-gray-500 ml-2">this week</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors">
              <span>Weekly</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
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
        <h4 className="text-base font-semibold text-gray-800 mb-10">Hours Spent This Week</h4>
        <div className="flex items-end justify-between space-x-4 h-96 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-12 shadow-inner">
          {data.map((item, index) => {
            const colors = [
              'bg-gradient-to-t from-emerald-600 to-emerald-400',
              'bg-gradient-to-t from-teal-600 to-teal-400',
              'bg-gradient-to-t from-cyan-600 to-cyan-400',
              'bg-gradient-to-t from-blue-600 to-blue-400',
              'bg-gradient-to-t from-indigo-600 to-indigo-400',
              'bg-gradient-to-t from-violet-600 to-violet-400',
              'bg-gradient-to-t from-purple-600 to-purple-400'
            ];
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                <div className="text-lg font-bold text-gray-900 mb-8 group-hover:text-emerald-600 transition-colors">{item.hours}h</div>
                <div 
                  className={`w-full ${colors[index]} rounded-t-xl transition-all duration-1000 ease-out shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer animate-on-load animate-scale-in`}
                  style={{ 
                    height: `${(item.hours / maxHours) * 220}px`,
                    minHeight: '20px',
                    animationDelay: `${5.1 + index * 0.1}s`
                  }}
                ></div>
                <div className="text-sm text-gray-600 mt-6 font-medium group-hover:text-gray-800 transition-colors">{item.day}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Daily Average:</span>
            <span className="font-medium text-gray-900 ml-2">
              {(totalHours / 7).toFixed(1)}h
            </span>
          </div>
          <div>
            <span className="text-gray-500">Best Day:</span>
            <span className="font-medium text-gray-900 ml-2">
              {data.find(d => d.hours === maxHours)?.day} ({maxHours}h)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
