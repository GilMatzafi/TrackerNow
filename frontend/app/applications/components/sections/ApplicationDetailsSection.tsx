import { Job } from '../../../types/job';

interface ApplicationDetailsSectionProps {
  job: Job;
}

export default function ApplicationDetailsSection({ job }: ApplicationDetailsSectionProps) {
  // Only render if there are application details to show
  if (!job.application_url && !job.completion_method && !job.notes) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Application Details</h3>
      
      <div className="space-y-5">
        {job.application_url && (
          <div>
            <label className="block text-lg font-semibold text-gray-600 mb-3">
              Application URL
            </label>
            <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
              <a 
                href={job.application_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lg text-blue-600 hover:text-blue-800 font-medium break-all"
              >
                {job.application_url}
              </a>
            </div>
          </div>
        )}
        
        {job.completion_method && (
          <div>
            <label className="block text-lg font-semibold text-gray-600 mb-3">
              Completion Method
            </label>
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-lg text-gray-900 font-medium capitalize">
                {job.completion_method.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}
        
        {job.notes && (
          <div>
            <label className="block text-lg font-semibold text-gray-600 mb-3">
              Notes
            </label>
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-lg text-gray-900 whitespace-pre-wrap">{job.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
