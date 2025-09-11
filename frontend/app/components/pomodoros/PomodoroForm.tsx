"use client";

import { useState } from 'react';
import { PomodoroFormData, PomodoroType } from '../../types/pomodoro';

interface PomodoroFormProps {
  initialData?: Partial<PomodoroFormData>;
  onSubmit: (data: PomodoroFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PomodoroForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: PomodoroFormProps) {
  const [formData, setFormData] = useState<PomodoroFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    pomodoro_type: initialData?.pomodoro_type || 'WORK',
    duration_minutes: initialData?.duration_minutes || 25,
  });

  const [errors, setErrors] = useState<Partial<PomodoroFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<PomodoroFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.duration_minutes <= 0) {
      newErrors.duration_minutes = 'Duration must be greater than 0';
    }

    if (formData.duration_minutes > 120) {
      newErrors.duration_minutes = 'Duration cannot exceed 120 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof PomodoroFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getDefaultDuration = (type: PomodoroType): number => {
    switch (type) {
      case 'WORK':
        return 25;
      case 'SHORT_BREAK':
        return 5;
      case 'LONG_BREAK':
        return 15;
      default:
        return 25;
    }
  };

  const handleTypeChange = (type: PomodoroType) => {
    setFormData(prev => ({
      ...prev,
      pomodoro_type: type,
      duration_minutes: getDefaultDuration(type)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {initialData ? 'Edit Pomodoro' : 'Create New Pomodoro'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter pomodoro title..."
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter description (optional)..."
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Pomodoro Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['WORK', 'SHORT_BREAK', 'LONG_BREAK'] as PomodoroType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      formData.pomodoro_type === type
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={isLoading}
                  >
                    {type === 'WORK' ? 'Work' : 
                     type === 'SHORT_BREAK' ? 'Short Break' : 'Long Break'}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                id="duration"
                min="1"
                max="120"
                value={formData.duration_minutes}
                onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.duration_minutes ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.duration_minutes && (
                <p className="mt-1 text-sm text-red-600">{errors.duration_minutes}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
