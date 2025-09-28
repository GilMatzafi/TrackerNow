import { LinkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { JobCreate } from '../../../types/job';

interface ApplicationCompletionSectionProps {
  formData: JobCreate;
  errors: Record<string, string>;
  isAutoFilling: boolean;
  handleInputChange: (field: keyof JobCreate, value: any) => void;
  autoFillFromUrl: (url: string) => Promise<void>;
  isValidUrl: (url: string) => boolean;
}

export default function ApplicationCompletionSection({ 
  formData, 
  errors,
  isAutoFilling,
  handleInputChange,
  autoFillFromUrl,
  isValidUrl
}: ApplicationCompletionSectionProps) {
  const completionMethods = [
    { value: 'linkedin', label: 'LinkedIn Easy Apply' },
    { value: 'career_page', label: 'Company Career Page' },
    { value: 'email', label: 'Email Application' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-3xl font-semibold text-gray-900 flex items-center mb-8">
        <div className="p-2 bg-indigo-100 rounded-lg mr-4">
          <LinkIcon className="w-6 h-6 text-indigo-600" />
        </div>
        Application Completion
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Application URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={formData.application_url || ''}
              onChange={(e) => {
                handleInputChange('application_url', e.target.value);
              }}
              onPaste={(e) => {
                setTimeout(() => {
                  const pastedValue = e.clipboardData.getData('text');
                  if (pastedValue && isValidUrl(pastedValue)) {
                    autoFillFromUrl(pastedValue);
                  }
                }, 100);
              }}
              onBlur={(e) => {
                if (e.target.value && isValidUrl(e.target.value)) {
                  autoFillFromUrl(e.target.value);
                }
              }}
              className={`w-full px-5 py-4 pr-12 text-lg text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.application_url ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://linkedin.com/jobs/view/... or company career page"
            />
            {isAutoFilling && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-blue-600 flex items-center">
              <LinkIcon className="w-4 h-4 mr-1" />
              Paste a job URL to auto-fill details (LinkedIn, Indeed, etc.)
            </p>
            {formData.application_url && isValidUrl(formData.application_url) && (
              <button
                type="button"
                onClick={() => autoFillFromUrl(formData.application_url || '')}
                disabled={isAutoFilling}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                {isAutoFilling ? 'Auto-filling...' : 'Auto-fill Now'}
              </button>
            )}
          </div>
          {errors.application_url && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
              {errors.application_url}
            </p>
          )}
          {errors.url && (
            <p className="mt-1 text-sm text-orange-600 flex items-center">
              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
              {errors.url}
            </p>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Completion Method
          </label>
          <select
            value={formData.completion_method || ''}
            onChange={(e) => handleInputChange('completion_method', e.target.value)}
            className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select method</option>
            {completionMethods.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}