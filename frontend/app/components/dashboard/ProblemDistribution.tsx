"use client";

interface ProblemDistributionProps {
  data: Array<{
    topic: string;
    count: number;
    percentage: number;
  }>;
}

export default function ProblemDistribution({ data }: ProblemDistributionProps) {
  const totalProblems = data.reduce((sum, item) => sum + item.count, 0);

  const colors = [
    'bg-primary',
    'bg-accent', 
    'bg-yellow-500',
    'bg-red-500',
    'bg-blue-500'
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Problem Distribution</h3>
          <p className="text-sm text-gray-500">By topic category</p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary focus:border-transparent">
            <option>All Time</option>
            <option>This Month</option>
            <option>This Week</option>
          </select>
        </div>
      </div>

      {/* Donut Chart Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
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
                  stroke={colors[index]?.replace('bg-', '') || '#6b7280'}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(${rotation} 50 50)`}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{totalProblems}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-900">{item.topic}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{item.count}</div>
              <div className="text-xs text-gray-500">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
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
