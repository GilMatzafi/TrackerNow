import { Job } from '../../../types/job';

interface ContactSectionProps {
  job: Job;
}

export default function ContactSection({ job }: ContactSectionProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        {job.is_referral ? 'Referral Information' : 'Contact Person'}
      </h3>
      
      {job.is_referral && job.referrer_name ? (
        <div className="space-y-5">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-lg font-semibold text-green-800">This application is through a referral</span>
            </div>
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-600 mb-3">
              Referrer Name
            </label>
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-lg text-gray-900">
              {job.referrer_name}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className="block text-lg font-semibold text-gray-600 mb-3">
              Name
            </label>
            <input
              type="text"
              placeholder="Contact person name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-600 mb-3">
              Email
            </label>
            <input
              type="email"
              placeholder="contact@company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-600 mb-3">
              LinkedIn
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-600 mb-3">
              Role
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900">
              <option value="">Select role</option>
              <option value="HR">HR</option>
              <option value="Technical">Technical</option>
              <option value="Manager">Manager</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
