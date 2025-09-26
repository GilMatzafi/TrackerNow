"use client";

import { Job } from '../../types/job';

interface CompanyPerformanceProps {
  jobs: Job[];
}

export default function CompanyPerformance({ jobs }: CompanyPerformanceProps) {
  // Group jobs by company and calculate performance metrics
  const companyStats = jobs.reduce((acc, job) => {
    if (!acc[job.company]) {
      acc[job.company] = {
        company: job.company,
        total: 0,
        interviews: 0,
        offers: 0,
        rejections: 0,
        responseRate: 0
      };
    }
    
    acc[job.company].total++;
    
    if (job.status === 'interview' || job.status === 'offered') {
      acc[job.company].interviews++;
    }
    if (job.status === 'offered') {
      acc[job.company].offers++;
    }
    if (job.status === 'rejected') {
      acc[job.company].rejections++;
    }
    
    return acc;
  }, {} as Record<string, {
    company: string;
    total: number;
    interviews: number;
    offers: number;
    rejections: number;
    responseRate: number;
  }>);

  // Calculate response rates
  Object.values(companyStats).forEach(company => {
    const responses = company.interviews + company.rejections;
    company.responseRate = company.total > 0 ? Math.round((responses / company.total) * 100) : 0;
  });

  const topCompanies = Object.values(companyStats)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  if (jobs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏢</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-lg text-gray-500">Start applying to see company performance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-4xl font-semibold text-gray-900">Company Performance</h3>
        <p className="text-xl text-gray-500">Your success with different companies</p>
      </div>

      {/* Top Companies */}
      <div className="space-y-4">
        {topCompanies.map((company, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-primary font-semibold text-lg">
                    {company.company[0]}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{company.company}</h4>
                  <p className="text-lg text-gray-500">{company.total} application{company.total !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{company.responseRate}%</div>
                <div className="text-sm text-gray-500">Response Rate</div>
              </div>
            </div>
            
            {/* Progress bars */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Interviews</span>
                <span className="font-medium">{company.interviews}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(company.interviews / company.total) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Offers</span>
                <span className="font-medium">{company.offers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(company.offers / company.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {Object.keys(companyStats).length}
            </div>
            <div className="text-lg text-gray-500">Companies</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(Object.values(companyStats).reduce((sum, c) => sum + c.responseRate, 0) / Object.keys(companyStats).length)}%
            </div>
            <div className="text-lg text-gray-500">Avg Response</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {Object.values(companyStats).reduce((sum, c) => sum + c.offers, 0)}
            </div>
            <div className="text-lg text-gray-500">Total Offers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
