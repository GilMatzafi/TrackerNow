"use client";

import { ProblemFormData } from '../../types/problem';

interface ProblemNameFieldProps {
  formData: ProblemFormData;
  errors: Record<string, string>;
  autofillError: string | null;
  isAutofilling: boolean;
  isAutofilled: boolean;
  onInputChange: (field: keyof ProblemFormData, value: any) => void;
  onAutofill: () => void;
}

export default function ProblemNameField({
  formData,
  errors,
  autofillError,
  isAutofilling,
  isAutofilled,
  onInputChange,
  onAutofill
}: ProblemNameFieldProps) {
  return (
    <div className="space-y-4">
      <label htmlFor="name" className="block text-2xl font-bold mb-4" style={{ color: '#111827' }}>
        Problem Name *
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          disabled={isAutofilled}
          className={`flex-1 px-6 py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          } ${isAutofilled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
          style={{ color: isAutofilled ? '#6B7280' : '#111827', fontSize: '20px' }}
          placeholder="e.g., Two Sum"
        />
        <button
          type="button"
          onClick={onAutofill}
          disabled={isAutofilling || !formData.name.trim()}
          className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isAutofilling ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching from LeetCode...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              ⚡ Auto-fill
            </>
          )}
        </button>
      </div>
      {errors.name && <p className="mt-2 text-lg text-red-600">{errors.name}</p>}
      {autofillError && <p className="mt-2 text-lg text-red-600">{autofillError}</p>}
    </div>
  );
}
