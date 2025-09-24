"use client";

import { useState, useEffect } from 'react';
import { Problem, ProblemFormData } from '../../types/problem';

// Custom launch animation styles
const launchModalStyles = `
  @keyframes launchModal {
    0% {
      transform: scale(0.2) translateY(80px) rotateX(15deg);
      opacity: 0;
      filter: blur(4px);
    }
    30% {
      transform: scale(0.8) translateY(20px) rotateX(5deg);
      opacity: 0.6;
      filter: blur(1px);
    }
    60% {
      transform: scale(1.08) translateY(-8px) rotateX(-2deg);
      opacity: 0.9;
      filter: blur(0px);
    }
    80% {
      transform: scale(0.98) translateY(2px) rotateX(1deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) translateY(0) rotateX(0deg);
      opacity: 1;
    }
  }
`;

interface ProblemFormProps {
  problem?: Problem | null;
  onSubmit: (problem: Problem | Omit<Problem, 'id'>) => void;
  onCancel: () => void;
  initialDifficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  initialStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVISIT';
}

// Popular topics with soft colors - only main topics
const popularTopics = [
  { name: 'Array', color: 'bg-red-100', textColor: 'text-red-800', borderColor: 'border-red-200', selectedColor: 'bg-red-200', selectedTextColor: 'text-red-900' },
  { name: 'String', color: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-200', selectedColor: 'bg-blue-200', selectedTextColor: 'text-blue-900' },
  { name: 'Hash Table', color: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-200', selectedColor: 'bg-green-200', selectedTextColor: 'text-green-900' },
  { name: 'Dynamic Programming', color: 'bg-purple-100', textColor: 'text-purple-800', borderColor: 'border-purple-200', selectedColor: 'bg-purple-200', selectedTextColor: 'text-purple-900' },
  { name: 'Math', color: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-200', selectedColor: 'bg-yellow-200', selectedTextColor: 'text-yellow-900' },
  { name: 'Sorting', color: 'bg-pink-100', textColor: 'text-pink-800', borderColor: 'border-pink-200', selectedColor: 'bg-pink-200', selectedTextColor: 'text-pink-900' },
  { name: 'Greedy', color: 'bg-indigo-100', textColor: 'text-indigo-800', borderColor: 'border-indigo-200', selectedColor: 'bg-indigo-200', selectedTextColor: 'text-indigo-900' },
  { name: 'Depth-First Search', color: 'bg-teal-100', textColor: 'text-teal-800', borderColor: 'border-teal-200', selectedColor: 'bg-teal-200', selectedTextColor: 'text-teal-900' },
  { name: 'Binary Search', color: 'bg-orange-100', textColor: 'text-orange-800', borderColor: 'border-orange-200', selectedColor: 'bg-orange-200', selectedTextColor: 'text-orange-900' },
  { name: 'Matrix', color: 'bg-emerald-100', textColor: 'text-emerald-800', borderColor: 'border-emerald-200', selectedColor: 'bg-emerald-200', selectedTextColor: 'text-emerald-900' },
  { name: 'Tree', color: 'bg-lime-100', textColor: 'text-lime-800', borderColor: 'border-lime-200', selectedColor: 'bg-lime-200', selectedTextColor: 'text-lime-900' },
  { name: 'Breadth-First Search', color: 'bg-amber-100', textColor: 'text-amber-800', borderColor: 'border-amber-200', selectedColor: 'bg-amber-200', selectedTextColor: 'text-amber-900' },
  { name: 'Bit Manipulation', color: 'bg-rose-100', textColor: 'text-rose-800', borderColor: 'border-rose-200', selectedColor: 'bg-rose-200', selectedTextColor: 'text-rose-900' },
  { name: 'Two Pointers', color: 'bg-violet-100', textColor: 'text-violet-800', borderColor: 'border-violet-200', selectedColor: 'bg-violet-200', selectedTextColor: 'text-violet-900' },
  { name: 'Heap (Priority Queue)', color: 'bg-fuchsia-100', textColor: 'text-fuchsia-800', borderColor: 'border-fuchsia-200', selectedColor: 'bg-fuchsia-200', selectedTextColor: 'text-fuchsia-900' },
  { name: 'Binary Tree', color: 'bg-slate-100', textColor: 'text-slate-800', borderColor: 'border-slate-200', selectedColor: 'bg-slate-200', selectedTextColor: 'text-slate-900' },
  { name: 'Graph', color: 'bg-zinc-100', textColor: 'text-zinc-800', borderColor: 'border-zinc-200', selectedColor: 'bg-zinc-200', selectedTextColor: 'text-zinc-900' },
  { name: 'Stack', color: 'bg-neutral-100', textColor: 'text-neutral-800', borderColor: 'border-neutral-200', selectedColor: 'bg-neutral-200', selectedTextColor: 'text-neutral-900' }
];

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

  // Inject custom styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = launchModalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
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
      notes: formData.notes || undefined
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
        // Remove topic
        return {
          ...prev,
          topics: prev.topics.filter(topic => topic !== topicName)
        };
      } else {
        // Add topic
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Problem Name */}
        <div>
          <label htmlFor="name" className="block text-xl font-medium mb-3" style={{ color: '#374151' }}>
            Problem Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-6 py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            style={{ color: '#111827', fontSize: '20px' }}
            placeholder="e.g., Two Sum"
          />
          {errors.name && <p className="mt-2 text-lg text-red-600">{errors.name}</p>}
        </div>

        {/* Topics */}
        <div>
          <label className="block text-xl font-medium mb-4" style={{ color: '#374151' }}>
            Topics
          </label>
          
          {/* Popular Topics Grid */}
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-4">
            {popularTopics.map((topic) => (
              <button
                key={topic.name}
                type="button"
                onClick={() => toggleTopic(topic.name)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-110 cursor-pointer ${
                  formData.topics.includes(topic.name)
                    ? `${topic.selectedColor} ${topic.selectedTextColor} shadow-lg transform scale-105`
                    : `${topic.selectedColor} ${topic.selectedTextColor} hover:shadow-md hover:scale-105`
                }`}
              >
                {topic.name}
              </button>
            ))}
          </div>
          
          {/* Selected Topics */}
          {formData.topics.length > 0 && (
            <div className="mb-4">
              <p className="text-lg font-medium mb-3" style={{ color: '#374151' }}>
                Selected Topics ({formData.topics.length}):
              </p>
              <div className="flex flex-wrap gap-3">
                {formData.topics.map((topic, index) => {
                  const topicData = popularTopics.find(t => t.name === topic);
                  return (
                    <span
                      key={index}
                      className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium shadow-md ${topicData?.selectedColor || 'bg-blue-200'} ${topicData?.selectedTextColor || 'text-blue-900'}`}
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="ml-2 text-current/70 hover:text-current cursor-pointer hover:scale-110 transition-transform duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          
          {errors.topics && <p className="mt-2 text-lg text-red-600">{errors.topics}</p>}
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-xl font-medium mb-3" style={{ color: '#374151' }}>
            Difficulty *
          </label>
          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            style={{ color: '#111827', fontSize: '20px' }}
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-xl font-medium mb-3" style={{ color: '#374151' }}>
            Status *
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            style={{ color: '#111827', fontSize: '20px' }}
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="NEEDS_REVISIT">Needs Revisit</option>
          </select>
        </div>

        {/* Link */}
        <div>
          <label htmlFor="link" className="block text-xl font-medium mb-3" style={{ color: '#374151' }}>
            Problem Link
          </label>
          <input
            type="url"
            id="link"
            value={formData.link}
            onChange={(e) => handleInputChange('link', e.target.value)}
            className={`w-full px-6 py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.link ? 'border-red-300' : 'border-gray-300'
            }`}
            style={{ color: '#111827', fontSize: '20px' }}
            placeholder="https://leetcode.com/problems/..."
          />
          {errors.link && <p className="mt-2 text-lg text-red-600">{errors.link}</p>}
          <p className="mt-2 text-lg" style={{ color: '#6B7280' }}>
            Optional: Link to the problem on LeetCode, HackerRank, etc.
          </p>
        </div>

        {/* Time */}
        <div>
          <label htmlFor="time_minutes" className="block text-xl font-medium mb-3" style={{ color: '#374151' }}>
            Time Spent (minutes)
          </label>
          <input
            type="number"
            id="time_minutes"
            value={formData.time_minutes || ''}
            onChange={(e) => handleInputChange('time_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
            min="1"
            className={`w-full px-6 py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.time_minutes ? 'border-red-300' : 'border-gray-300'
            }`}
            style={{ color: '#111827', fontSize: '20px' }}
            placeholder="15"
          />
          {errors.time_minutes && <p className="mt-2 text-lg text-red-600">{errors.time_minutes}</p>}
          <p className="mt-2 text-lg" style={{ color: '#6B7280' }}>
            Optional: How long it took you to solve this problem.
          </p>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-xl font-medium mb-3" style={{ color: '#374151' }}>
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={6}
            className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            style={{ color: '#111827', fontSize: '20px' }}
            placeholder="Add any notes about your solution approach, key insights, or things to remember..."
          />
          <p className="mt-2 text-lg" style={{ color: '#6B7280' }}>
            Optional: Add notes about your solution, approach, or key insights.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-6 pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 cursor-pointer text-xl font-medium"
            style={{ color: '#374151' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer text-xl font-semibold"
            style={{ 
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: '2px solid #000000',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333333';
              e.currentTarget.style.borderColor = '#333333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.borderColor = '#000000';
            }}
          >
            {problem ? 'Update Problem' : 'Add Problem'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
