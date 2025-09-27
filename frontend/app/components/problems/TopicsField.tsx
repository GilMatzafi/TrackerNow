"use client";

import { ProblemFormData } from '../../types/problem';
import { popularTopics } from './constants';

interface TopicsFieldProps {
  formData: ProblemFormData;
  errors: Record<string, string>;
  isAutofilled: boolean;
  onInputChange: (field: keyof ProblemFormData, value: any) => void;
  onToggleTopic: (topicName: string) => void;
  onRemoveTopic: (topicToRemove: string) => void;
}

export default function TopicsField({
  formData,
  errors,
  isAutofilled,
  onToggleTopic,
  onRemoveTopic
}: TopicsFieldProps) {
  return (
    <div className="space-y-4">
      <label className="block text-2xl font-bold mb-4" style={{ color: '#111827' }}>
        Topics
        <span className="text-lg font-normal text-gray-500 ml-2">(Select multiple)</span>
      </label>
      
      {/* Popular Topics Grid */}
      <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2">
        {popularTopics.map((topic) => {
          const isSelected = formData.topics.includes(topic.name);
          return (
            <button
              key={topic.name}
              type="button"
              onClick={() => !isAutofilled && onToggleTopic(topic.name)}
              disabled={isAutofilled}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 border-2 ${
                isAutofilled 
                  ? isSelected
                    ? `${topic.selectedColor} ${topic.selectedTextColor} shadow-2xl border-blue-600 scale-110 cursor-not-allowed ring-4 ring-blue-200 ring-opacity-60 transform opacity-80`
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : isSelected
                    ? `${topic.selectedColor} ${topic.selectedTextColor} shadow-2xl border-blue-600 scale-110 cursor-pointer ring-4 ring-blue-200 ring-opacity-60 transform`
                    : `${topic.color} ${topic.textColor} ${topic.borderColor} hover:shadow-md hover:border-gray-400 cursor-pointer`
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {isSelected && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span className={isSelected ? 'font-extrabold' : 'font-bold'}>{topic.name}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {errors.topics && <p className="mt-2 text-lg text-red-600">{errors.topics}</p>}
    </div>
  );
}
