"use client";

import { Job } from '../../types/job';

interface ApplicationTrendsProps {
  jobs: Job[];
}

export default function ApplicationTrends({ jobs }: ApplicationTrendsProps) {
  // Group applications by month
  const applicationsByMonth = jobs.reduce((acc, job) => {
    if (job.applied_date) {
      const date = new Date(job.applied_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthName, count: 0 };
      }
      acc[monthKey].count++;
    }
    return acc;
  }, {} as Record<string, { month: string; count: number }>);

  const monthlyData = Object.values(applicationsByMonth).sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA.getTime() - dateB.getTime();
  });

  // Calculate trends
  const totalApplications = jobs.length;
  const thisMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const thisMonthApplications = monthlyData.find(m => m.month === thisMonth)?.count || 0;
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const lastMonthApplications = monthlyData.find(m => m.month === lastMonth)?.count || 0;
  
  const trend = lastMonthApplications > 0 ? 
    Math.round(((thisMonthApplications - lastMonthApplications) / lastMonthApplications) * 100) : 0;

  if (totalApplications === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-lg text-gray-500">Start applying to see your trends</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...monthlyData.map(m => m.count));

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-4xl font-semibold text-gray-900">Application Trends</h3>
        <p className="text-xl text-gray-500">Your application activity over time</p>
      </div>

      {/* Current Month Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-blue-600 font-medium">This Month</p>
              <p className="text-4xl font-bold text-blue-900">{thisMonthApplications}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 ${trend >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-lg font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Trend
              </p>
              <p className={`text-4xl font-bold ${trend >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${trend >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className="text-2xl">{trend >= 0 ? '📈' : '📉'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-gray-900">Monthly Applications</h4>
        <div className="space-y-3">
          {monthlyData.slice(-6).map((month, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-sm text-gray-600 font-medium">
                {month.month}
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(month.count / maxCount) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-right text-lg font-semibold text-gray-900">
                {month.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
