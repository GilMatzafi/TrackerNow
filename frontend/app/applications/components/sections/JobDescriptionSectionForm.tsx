import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { JobCreate } from '../../../types/job';

interface JobDescriptionSectionFormProps {
  formData: JobCreate;
  handleInputChange: (field: keyof JobCreate, value: any) => void;
}

export default function JobDescriptionSectionForm({ formData, handleInputChange }: JobDescriptionSectionFormProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-3xl font-semibold text-gray-900 flex items-center mb-8">
        <div className="p-2 bg-purple-100 rounded-lg mr-4">
          <DocumentArrowUpIcon className="w-6 h-6 text-purple-600" />
        </div>
        Job Description
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position Description
        </label>
        <textarea
          value={formData.position_description || ''}
          onChange={(e) => handleInputChange('position_description', e.target.value)}
          rows={6}
          className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Job requirements, responsibilities, and details..."
        />
      </div>
    </div>
  );
}
