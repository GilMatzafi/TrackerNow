"use client";

import { ProblemFormData } from '../../types/problem';

interface AdditionalFieldsProps {
  formData: ProblemFormData;
  errors: Record<string, string>;
  isAutofilled: boolean;
  onInputChange: (field: keyof ProblemFormData, value: any) => void;
}

export default function AdditionalFields({
  formData,
  errors,
  isAutofilled,
  onInputChange
}: AdditionalFieldsProps) {
  return (
    <>
      {/* Link */}
      <div className="space-y-4">
        <label htmlFor="link" className="block text-2xl font-bold mb-4" style={{ color: '#111827' }}>
          Problem Link
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <input
            type="url"
            id="link"
            value={formData.link}
            onChange={(e) => onInputChange('link', e.target.value)}
            disabled={isAutofilled}
            className={`w-full pl-12 pr-6 py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 transition-colors ${
              errors.link ? 'border-red-300' : 'border-gray-300'
            } ${isAutofilled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
            style={{ color: isAutofilled ? '#6B7280' : '#111827', fontSize: '20px' }}
            placeholder="https://leetcode.com/problems/two-sum/"
          />
        </div>
        {errors.link && <p className="mt-2 text-lg text-red-600">{errors.link}</p>}
        <p className="text-lg" style={{ color: '#6B7280' }}>
          Optional: Link to the problem on LeetCode
        </p>
      </div>

      {/* Time */}
      <div className="space-y-4">
        <label htmlFor="time_minutes" className="block text-2xl font-bold mb-4" style={{ color: '#111827' }}>
          Time Spent (minutes)
        </label>
        <div className="relative">
          <input
            type="number"
            id="time_minutes"
            value={formData.time_minutes || ''}
            onChange={(e) => onInputChange('time_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
            min="1"
            max="999"
            step="1"
            className={`w-full px-6 py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 transition-colors ${
              errors.time_minutes ? 'border-red-300' : 'border-gray-300'
            }`}
            style={{ color: '#111827', fontSize: '20px' }}
            placeholder="15"
          />
          <div className="absolute inset-y-0 right-0 flex flex-col">
            <button
              type="button"
              onClick={() => onInputChange('time_minutes', (formData.time_minutes || 0) + 1)}
              className="flex-1 px-3 text-gray-400 hover:text-gray-600 border-l border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onInputChange('time_minutes', Math.max(1, (formData.time_minutes || 1) - 1))}
              className="flex-1 px-3 text-gray-400 hover:text-gray-600 border-l border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        {errors.time_minutes && <p className="mt-2 text-lg text-red-600">{errors.time_minutes}</p>}
        <p className="text-lg" style={{ color: '#6B7280' }}>
          Optional: How long it took you to solve this problem
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <label htmlFor="notes" className="block text-2xl font-bold mb-4" style={{ color: '#111827' }}>
          Notes
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          rows={6}
          className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 transition-colors resize-none"
          style={{ color: '#111827', fontSize: '20px' }}
          placeholder="e.g. Used hash map for O(n) solution, key insight was two-pointer technique, need to review sliding window approach..."
        />
        <p className="text-lg" style={{ color: '#6B7280' }}>
          Optional: Add notes about your solution approach, key insights, or things to remember
        </p>
      </div>
    </>
  );
}
