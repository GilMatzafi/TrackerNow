import { 
  MapPinIcon, 
  ClockIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { Job } from '../../../types/job';

interface JobHeaderSectionProps {
  job: Job;
  isAddingNewJob?: boolean;
}

export default function JobHeaderSection({ job, isAddingNewJob = false }: JobHeaderSectionProps) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {isAddingNewJob ? 'New Job Application' : job.position}
          </h1>
          <div className="flex items-center space-x-6 text-xl text-gray-600 mb-6">
            <div className="flex items-center space-x-3">
              <MapPinIcon className="w-6 h-6" />
              <span className="font-semibold">
                {isAddingNewJob ? 'Add location...' : (job.location || 'Location not specified')}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-6 h-6" />
              <span className="font-semibold">
                {isAddingNewJob ? 'Just created' : (job.applied_date ? `Applied ${new Date(job.applied_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}` : 'Recently saved')}
              </span>
            </div>
          </div>
          
          {/* Job Details */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="w-6 h-6 text-gray-500" />
              <span className="text-lg font-semibold text-gray-900">
                {isAddingNewJob ? 'Add company name...' : job.company}
              </span>
            </div>
            {job.salary && (
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="w-6 h-6 text-gray-500" />
                <span className="text-lg font-semibold text-gray-900">
                  {job.salary.includes('₪') ? job.salary : `₪${job.salary.replace(/[^\d,-]/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
