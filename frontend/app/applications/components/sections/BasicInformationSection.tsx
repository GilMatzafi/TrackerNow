import { 
  BuildingOfficeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { JobCreate } from '../../../types/job';

interface BasicInformationSectionProps {
  formData: JobCreate;
  errors: Record<string, string>;
  handleInputChange: (field: keyof JobCreate, value: any) => void;
}

export default function BasicInformationSection({ 
  formData, 
  errors, 
  handleInputChange 
}: BasicInformationSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-3xl font-semibold text-gray-900 flex items-center mb-8">
        <div className="p-2 bg-blue-100 rounded-lg mr-4">
          <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
        </div>
        Basic Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className={`w-full px-5 py-4 text-lg text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.company ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Google, Microsoft, Apple"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
              {errors.company}
            </p>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Job Position *
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className={`w-full px-5 py-4 text-lg text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.position ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Software Engineer, Product Manager"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
              {errors.position}
            </p>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Location
          </label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Salary
          </label>
          <input
            type="text"
            value={formData.salary || ''}
            onChange={(e) => {
              // Format the input to show shekels and add commas
              let value = e.target.value;
              // Remove any existing ₪ and non-numeric characters except commas and hyphens
              value = value.replace(/₪/g, '').replace(/[^\d,-]/g, '');
              // Add commas for thousands
              value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
              // Add ₪ prefix if not empty
              if (value) {
                value = `₪${value}`;
              }
              handleInputChange('salary', value);
            }}
            className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., ₪20,000 - ₪25,000"
          />
        </div>
      </div>
    </div>
  );
}
