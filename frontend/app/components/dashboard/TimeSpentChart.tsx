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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Time Spent Coding</h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</span>
            <span className="text-sm text-gray-500 ml-2">this week</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary focus:border-transparent">
            <option>Weekly</option>
            <option>Daily</option>
            <option>Monthly</option>
          </select>
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
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.hours / maxHours) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">
                  {item.hours}h
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {item.problems} problems
              </div>
            </div>
          </div>
        ))}
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
