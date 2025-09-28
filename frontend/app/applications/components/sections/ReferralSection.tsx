import { 
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { JobCreate } from '../../../types/job';

interface ReferralSectionProps {
  formData: JobCreate;
  errors: Record<string, string>;
  showReferralFields: boolean | undefined;
  handleInputChange: (field: keyof JobCreate, value: any) => void;
  setShowReferralFields: (show: boolean) => void;
}

export default function ReferralSection({ 
  formData, 
  errors,
  showReferralFields,
  handleInputChange,
  setShowReferralFields
}: ReferralSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-3xl font-semibold text-gray-900 flex items-center mb-8">
        <div className="p-2 bg-orange-100 rounded-lg mr-4">
          <UserIcon className="w-6 h-6 text-orange-600" />
        </div>
        Referral Information
      </h3>
      
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="is_referral"
          checked={formData.is_referral}
          onChange={(e) => {
            handleInputChange('is_referral', e.target.checked);
            setShowReferralFields(e.target.checked);
          }}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="is_referral" className="text-lg font-medium text-gray-700">
          This application is through a referral
        </label>
      </div>

      {showReferralFields && (
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Referrer Name *
          </label>
          <input
            type="text"
            value={formData.referrer_name || ''}
            onChange={(e) => handleInputChange('referrer_name', e.target.value)}
            className={`w-full px-5 py-4 text-lg text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.referrer_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Name of the person who referred you"
          />
          {errors.referrer_name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
              {errors.referrer_name}
            </p>
          )}
        </div>
      )}
    </div>
  );
}