import { Job } from '../../../types/job';

interface CompanyOverviewSectionProps {
  job: Job;
}

export default function CompanyOverviewSection({ job }: CompanyOverviewSectionProps) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Company Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">About {job.company}</h3>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            {job.company_description || `Join our dynamic team at ${job.company} in an environment that fosters teamwork, nurtures career development, celebrates diversity, and rewards innovation. We offer competitive compensation and excellent employee programs.`}
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-lg text-gray-700 font-medium">Industry-leading technology solutions</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-lg text-gray-700 font-medium">Innovative and collaborative culture</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-lg text-gray-700 font-medium">Professional growth opportunities</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-lg text-gray-700 font-medium">Competitive benefits package</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Company Details</h3>
          <div className="space-y-5">
            <div>
              <span className="text-lg font-semibold text-gray-600">Company Size:</span>
              <p className="text-xl text-gray-900 font-medium">
                {job.company === 'Google' ? '150,000+ employees' :
                 job.company === 'Apple' ? '160,000+ employees' :
                 job.company === 'Microsoft' ? '220,000+ employees' :
                 job.company === 'Meta' ? '77,000+ employees' :
                 '500-1000 employees'}
              </p>
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-600">Founded:</span>
              <p className="text-xl text-gray-900 font-medium">
                {job.company === 'Google' ? '1998' :
                 job.company === 'Apple' ? '1976' :
                 job.company === 'Microsoft' ? '1975' :
                 job.company === 'Meta' ? '2004' :
                 '2010'}
              </p>
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-600">Industry:</span>
              <p className="text-xl text-gray-900 font-medium">
                {job.company === 'Google' ? 'Technology & Internet' :
                 job.company === 'Apple' ? 'Consumer Electronics' :
                 job.company === 'Microsoft' ? 'Software & Cloud' :
                 job.company === 'Meta' ? 'Social Media & VR' :
                 'Technology'}
              </p>
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-600">Website:</span>
              <a 
                href={`https://www.${job.company.toLowerCase()}.com`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xl text-blue-600 hover:text-blue-800 font-medium"
              >
                www.{job.company.toLowerCase()}.com
              </a>
            </div>
            {job.salary && (
              <div>
                <span className="text-lg font-semibold text-gray-600">Salary Range:</span>
                <p className="text-xl text-gray-900 font-medium">
                  {job.salary.includes('₪') ? job.salary : `₪${job.salary.replace(/[^\d,-]/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}