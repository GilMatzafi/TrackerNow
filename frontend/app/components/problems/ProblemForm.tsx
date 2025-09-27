"use client";

import { useState, useEffect } from 'react';
import { Problem, ProblemFormData } from '../../types/problem';
import { problemsService } from '../../services/problems/ProblemsService';
import { launchModalStyles } from './animations';
import ProblemNameField from './ProblemNameField';
import TopicsField from './TopicsField';
import SelectField from './SelectField';
import AdditionalFields from './AdditionalFields';

interface ProblemFormProps {
  problem?: Problem | null;
  onSubmit: (problem: Problem | Omit<Problem, 'id'>) => void;
  onCancel: () => void;
  initialDifficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  initialStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVISIT';
}

export default function ProblemForm({ problem, onSubmit, onCancel, initialDifficulty, initialStatus }: ProblemFormProps) {
  const [formData, setFormData] = useState<ProblemFormData>({
    name: problem?.name || '',
    topics: problem?.topics || [],
    difficulty: problem?.difficulty || initialDifficulty || 'EASY',
    status: problem?.status || initialStatus || 'NOT_STARTED',
    link: problem?.link || '',
    time_minutes: problem?.time_minutes || undefined,
    notes: problem?.notes || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [autofillError, setAutofillError] = useState<string | null>(null);

  // Inject custom styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = launchModalStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (problem) {
      setFormData({
        name: problem.name,
        topics: problem.topics,
        difficulty: problem.difficulty,
        status: problem.status,
        link: problem.link || '',
        time_minutes: problem.time_minutes,
        notes: problem.notes || ''
      });
    }
  }, [problem]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Problem name is required';
    }

    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL';
    }

    if (formData.time_minutes && formData.time_minutes <= 0) {
      newErrors.time_minutes = 'Time must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      link: formData.link || undefined,
      time_minutes: formData.time_minutes || undefined,
      notes: formData.notes || undefined,
      created_at: new Date().toISOString()
    };

    if (problem) {
      onSubmit({ ...submitData, id: problem.id });
    } else {
      onSubmit(submitData);
    }
  };

  const handleInputChange = (field: keyof ProblemFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleTopic = (topicName: string) => {
    setFormData(prev => {
      if (prev.topics.includes(topicName)) {
        return {
          ...prev,
          topics: prev.topics.filter(topic => topic !== topicName)
        };
      } else {
        return {
          ...prev,
          topics: [...prev.topics, topicName]
        };
      }
    });
  };

  const removeTopic = (topicToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter(topic => topic !== topicToRemove)
    }));
  };

  const [isAutofilled, setIsAutofilled] = useState(false);

  const handleAutofill = async () => {
    if (!formData.name.trim()) {
      setAutofillError('Please enter a problem name first');
      return;
    }

    setIsAutofilling(true);
    setAutofillError(null);

    try {
      const response = await problemsService.autofillProblemDetails(formData.name.trim());
      
      if (response.success && response.data) {
        setFormData(prev => ({
          ...prev,
          name: response.data!.name,
          link: response.data!.link,
          difficulty: response.data!.difficulty,
          topics: response.data!.topics
        }));
        setAutofillError(null);
        setIsAutofilled(true); // Mark as auto-filled
      } else {
        setAutofillError(response.error || 'Failed to fetch problem details');
      }
    } catch (error) {
      setAutofillError('Error fetching problem details. Please try again.');
    } finally {
      setIsAutofilling(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl p-12 w-[1000px] max-w-full mx-4 shadow-2xl border border-gray-100 relative max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'launchModal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          zIndex: 10000
        }}
      >
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8">
          <h2 className="text-4xl font-bold" style={{ color: '#111827' }}>
            {problem ? 'Edit Problem' : 'Add New Problem'}
          </h2>
          <p className="mt-3 text-xl" style={{ color: '#4B5563' }}>
            {problem ? 'Update the problem details below.' : 'Fill in the details for your new coding problem.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <ProblemNameField
            formData={formData}
            errors={errors}
            autofillError={autofillError}
            isAutofilling={isAutofilling}
            isAutofilled={isAutofilled}
            onInputChange={handleInputChange}
            onAutofill={handleAutofill}
          />

          <TopicsField
            formData={formData}
            errors={errors}
            isAutofilled={isAutofilled}
            onInputChange={handleInputChange}
            onToggleTopic={toggleTopic}
            onRemoveTopic={removeTopic}
          />

          <SelectField
            formData={formData}
            isAutofilled={isAutofilled}
            onInputChange={handleInputChange}
          />

          <AdditionalFields
            formData={formData}
            errors={errors}
            isAutofilled={isAutofilled}
            onInputChange={handleInputChange}
          />

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 cursor-pointer text-xl font-semibold shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg transition-all duration-200 hover:from-gray-800 hover:to-gray-900 hover:scale-105 cursor-pointer text-xl font-bold shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {problem ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Update Problem
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Problem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}