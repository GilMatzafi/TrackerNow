"use client";

import { Job } from '../../types/job';

interface ApplicationSuccessRateProps {
  jobs: Job[];
}

export default function ApplicationSuccessRate({ jobs }: ApplicationSuccessRateProps) {
  // Calculate success metrics
  const totalApplications = jobs.filter(job => job.status === 'applied' || job.status === 'interview' || job.status === 'offered' || job.status === 'rejected').length;
  const interviews = jobs.filter(job => job.status === 'interview' || job.status === 'offered').length;
  const offers = jobs.filter(job => job.status === 'offered').length;
  const rejections = jobs.filter(job => job.status === 'rejected').length;

  const interviewRate = totalApplications > 0 ? Math.round((interviews / totalApplications) * 100) : 0;
  const offerRate = totalApplications > 0 ? Math.round((offers / totalApplications) * 100) : 0;
  const rejectionRate = totalApplications > 0 ? Math.round((rejections / totalApplications) * 100) : 0;

  if (totalApplications === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-lg text-gray-500">Start applying to see your success metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-4xl font-semibold text-gray-900">Success Metrics</h3>
        <p className="text-xl text-gray-500">Your application performance</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-blue-600 font-medium">Interview Rate</p>
              <p className="text-4xl font-bold text-blue-900">{interviewRate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-green-600 font-medium">Offer Rate</p>
              <p className="text-4xl font-bold text-green-900">{offerRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-lg font-medium text-gray-900">Interviews</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">{interviews}</span>
            <span className="text-lg text-gray-500 ml-2">({interviewRate}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-lg font-medium text-gray-900">Offers</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">{offers}</span>
            <span className="text-lg text-gray-500 ml-2">({offerRate}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
            <span className="text-lg font-medium text-gray-900">Rejections</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">{rejections}</span>
            <span className="text-lg text-gray-500 ml-2">({rejectionRate}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
