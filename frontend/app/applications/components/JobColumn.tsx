"use client";

import JobCard from './JobCard';

interface Job {
  id: string;
  company: string;
  position: string;
  location?: string;
  salary?: string;
  note?: string;
  tags?: string[];
  status?: string;
  appliedDate?: string;
  interviewTime?: string;
  companyLogo?: string;
}

interface JobColumnProps {
  title: string;
  count: number;
  jobs: Job[];
  color?: string;
}

export default function JobColumn({ title, count, jobs, color = "gray" }: JobColumnProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-200 bg-blue-50';
      case 'green':
        return 'border-green-200 bg-green-50';
      case 'yellow':
        return 'border-yellow-200 bg-yellow-50';
      case 'red':
        return 'border-red-200 bg-red-50';
      case 'purple':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="flex-shrink-0 flex-1">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <span className="text-xl text-gray-500">({count})</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            company={job.company}
            position={job.position}
            location={job.location}
            salary={job.salary}
            note={job.note}
            tags={job.tags}
            status={job.status}
            appliedDate={job.appliedDate}
            interviewTime={job.interviewTime}
            companyLogo={job.companyLogo}
          />
        ))}
      </div>
    </div>
  );
}
