"use client";

import { Job } from '../../types/job';

interface ReferralAnalysisProps {
  jobs: Job[];
}

export default function ReferralAnalysis({ jobs }: ReferralAnalysisProps) {
  // Separate referral vs direct applications
  const referralJobs = jobs.filter(job => job.is_referral === true);
  const directJobs = jobs.filter(job => job.is_referral === false || job.is_referral === undefined);

  // Calculate success rates
  const getSuccessRate = (jobList: Job[]) => {
    const total = jobList.length;
    if (total === 0) return { interviewRate: 0, offerRate: 0 };
    
    const interviews = jobList.filter(job => job.status === 'interview' || job.status === 'offered').length;
    const offers = jobList.filter(job => job.status === 'offered').length;
    
    return {
      interviewRate: Math.round((interviews / total) * 100),
      offerRate: Math.round((offers / total) * 100)
    };
  };

  const referralStats = getSuccessRate(referralJobs);
  const directStats = getSuccessRate(directJobs);

  const totalReferrals = referralJobs.length;
  const totalDirect = directJobs.length;

  if (jobs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-lg text-gray-500">Start applying to see referral analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-4xl font-semibold text-gray-900">Referral Analysis</h3>
        <p className="text-xl text-gray-500">Referral vs Direct application success</p>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Referral Applications */}
        <div className="bg-purple-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold text-purple-900">Referral Applications</h4>
              <p className="text-lg text-purple-600">{totalReferrals} applications</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-700">Interview Rate</span>
              <span className="text-2xl font-bold text-purple-900">{referralStats.interviewRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-700">Offer Rate</span>
              <span className="text-2xl font-bold text-purple-900">{referralStats.offerRate}%</span>
            </div>
          </div>
        </div>

        {/* Direct Applications */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold text-blue-900">Direct Applications</h4>
              <p className="text-lg text-blue-600">{totalDirect} applications</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-700">Interview Rate</span>
              <span className="text-2xl font-bold text-blue-900">{directStats.interviewRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-700">Offer Rate</span>
              <span className="text-2xl font-bold text-blue-900">{directStats.offerRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">Performance Comparison</h4>
        
        <div className="space-y-4">
          {/* Interview Rate Comparison */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-gray-700">Interview Rate</span>
              <span className="text-lg text-gray-500">
                {referralStats.interviewRate > directStats.interviewRate ? 
                  `+${referralStats.interviewRate - directStats.interviewRate}% better with referrals` :
                  directStats.interviewRate > referralStats.interviewRate ?
                  `+${directStats.interviewRate - referralStats.interviewRate}% better direct` :
                  'Equal performance'
                }
              </span>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1 bg-white rounded-lg p-3">
                <div className="text-sm text-purple-600 mb-1">Referral</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-500 h-3 rounded-full"
                    style={{ width: `${referralStats.interviewRate}%` }}
                  ></div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mt-1">{referralStats.interviewRate}%</div>
              </div>
              <div className="flex-1 bg-white rounded-lg p-3">
                <div className="text-sm text-blue-600 mb-1">Direct</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${directStats.interviewRate}%` }}
                  ></div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mt-1">{directStats.interviewRate}%</div>
              </div>
            </div>
          </div>

          {/* Offer Rate Comparison */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-gray-700">Offer Rate</span>
              <span className="text-lg text-gray-500">
                {referralStats.offerRate > directStats.offerRate ? 
                  `+${referralStats.offerRate - directStats.offerRate}% better with referrals` :
                  directStats.offerRate > referralStats.offerRate ?
                  `+${directStats.offerRate - referralStats.offerRate}% better direct` :
                  'Equal performance'
                }
              </span>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1 bg-white rounded-lg p-3">
                <div className="text-sm text-purple-600 mb-1">Referral</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-500 h-3 rounded-full"
                    style={{ width: `${referralStats.offerRate}%` }}
                  ></div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mt-1">{referralStats.offerRate}%</div>
              </div>
              <div className="flex-1 bg-white rounded-lg p-3">
                <div className="text-sm text-blue-600 mb-1">Direct</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${directStats.offerRate}%` }}
                  ></div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mt-1">{directStats.offerRate}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
