import { XCircleIcon, CheckCircleIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface FormActionsProps {
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: Record<string, string>;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function FormActions({ 
  isSubmitting, 
  isSuccess, 
  errors, 
  isEditing, 
  onClose, 
  onSubmit 
}: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onClose}
        className="px-8 py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center text-lg font-medium"
      >
        <XCircleIcon className="w-5 h-5 mr-2" />
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || isSuccess}
        className={`px-8 py-4 rounded-lg transition-colors flex items-center text-lg font-medium ${
          isSuccess 
            ? 'bg-green-600 text-white' 
            : 'bg-blue-600 text-gray-900 hover:bg-blue-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSuccess ? (
          <>
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Saved!
          </>
        ) : isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
            Saving...
          </>
        ) : (
          <>
            <CheckIcon className="w-5 h-5 mr-2" />
            {isEditing ? 'Update Application' : 'Save Application'}
          </>
        )}
      </button>
    </div>
  );
}