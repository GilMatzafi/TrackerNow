"use client";

import { useState, useEffect } from 'react';
import { Problem, ProblemFormData } from '../../types/problem';
import { problemsService } from '../../services/problems/ProblemsService';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

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

// Difficulty options
const difficultyOptions = [
  { value: 'EASY', label: 'Easy', icon: '🟢', color: 'text-green-600' },
  { value: 'MEDIUM', label: 'Medium', icon: '🟡', color: 'text-yellow-600' },
  { value: 'HARD', label: 'Hard', icon: '🔴', color: 'text-red-600' }
];

// Status options
const statusOptions = [
  { value: 'NOT_STARTED', label: 'Not Started', icon: '⭕', color: 'text-gray-600' },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: '🔄', color: 'text-blue-600' },
  { value: 'COMPLETED', label: 'Completed', icon: '✅', color: 'text-green-600' },
  { value: 'NEEDS_REVISIT', label: 'Needs Revisit', icon: '🔄', color: 'text-orange-600' }
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
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [autofillError, setAutofillError] = useState<string | null>(null);

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
        {/* Problem Name */}
        <div className="space-y-4">
          <label htmlFor="name" className="block text-2xl font-bold mb-4" style={{ color: '#111827' }}>
            Problem Name *
          </label>
          <div className="flex gap-3">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
              className={`flex-1 px-6 py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
              style={{ color: '#111827', fontSize: '20px' }}
            placeholder="e.g., Two Sum"
          />
            <button
              type="button"
              onClick={handleAutofill}
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

        {/* Topics */}
        <div className="space-y-4">
          <label className="block text-2xl font-bold mb-4" style={{ color: '#111827' }}>
            Topics
            <span className="text-lg font-normal text-gray-500 ml-2">(Select multiple)</span>
          </label>
          
          {/* Popular Topics Grid */}
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {popularTopics.map((topic) => {
              const isSelected = formData.topics.includes(topic.name);
              return (
              <button
                  key={topic.name}
                type="button"
                  onClick={() => toggleTopic(topic.name)}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 cursor-pointer border-2 ${
                    isSelected
                      ? `${topic.selectedColor} ${topic.selectedTextColor} shadow-lg border-current scale-105`
                      : `${topic.color} ${topic.textColor} ${topic.borderColor} hover:shadow-md hover:border-gray-400`
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isSelected && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {topic.name}
                  </div>
              </button>
              );
            })}
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
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="block text-2xl font-bold" style={{ color: '#111827' }}>
            Difficulty *
          </label>
            <div className="group relative">
              <svg className="w-5 h-5 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                Easy: Basic problems, good for beginners
                <br />
                Medium: Moderate complexity, requires some experience
                <br />
                Hard: Complex problems, advanced algorithms
              </div>
            </div>
          </div>
          
          <Listbox value={formData.difficulty} onChange={(value) => handleInputChange('difficulty', value)}>
            <div className="relative">
              <Listbox.Button className="relative w-full px-6 py-4 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors">
                <span className="flex items-center gap-3" style={{ color: '#111827', fontSize: '20px' }}>
                  {difficultyOptions.find(option => option.value === formData.difficulty)?.icon}
                  {difficultyOptions.find(option => option.value === formData.difficulty)?.label}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </Listbox.Button>
              
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg focus:outline-none">
                  {difficultyOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-4 px-6 transition-colors ${
                          active ? 'bg-blue-50' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{option.icon}</span>
                            <span className="font-medium" style={{ fontSize: '20px' }}>
                              {option.label}
                            </span>
                          </div>
                          {selected && (
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="block text-2xl font-bold" style={{ color: '#111827' }}>
            Status *
          </label>
            <div className="group relative">
              <svg className="w-5 h-5 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                Not Started: Haven't attempted yet
                <br />
                In Progress: Currently working on it
                <br />
                Completed: Successfully solved
                <br />
                Needs Revisit: Solved but want to review
              </div>
            </div>
          </div>
          
          <Listbox value={formData.status} onChange={(value) => handleInputChange('status', value)}>
            <div className="relative">
              <Listbox.Button className="relative w-full px-6 py-4 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors">
                <span className="flex items-center gap-3" style={{ color: '#111827', fontSize: '20px' }}>
                  {statusOptions.find(option => option.value === formData.status)?.icon}
                  {statusOptions.find(option => option.value === formData.status)?.label}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </Listbox.Button>
              
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg focus:outline-none">
                  {statusOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-4 px-6 transition-colors ${
                          active ? 'bg-blue-50' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{option.icon}</span>
                            <span className="font-medium" style={{ fontSize: '20px' }}>
                              {option.label}
                            </span>
                          </div>
                          {selected && (
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

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
            onChange={(e) => handleInputChange('link', e.target.value)}
              className={`w-full pl-12 pr-6 py-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 transition-colors ${
              errors.link ? 'border-red-300' : 'border-gray-300'
            }`}
              style={{ color: '#111827', fontSize: '20px' }}
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
            onChange={(e) => handleInputChange('time_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
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
                onClick={() => handleInputChange('time_minutes', (formData.time_minutes || 0) + 1)}
                className="flex-1 px-3 text-gray-400 hover:text-gray-600 border-l border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('time_minutes', Math.max(1, (formData.time_minutes || 1) - 1))}
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
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={6}
            className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 transition-colors resize-none"
            style={{ color: '#111827', fontSize: '20px' }}
            placeholder="e.g. Used hash map for O(n) solution, key insight was two-pointer technique, need to review sliding window approach..."
          />
          <p className="text-lg" style={{ color: '#6B7280' }}>
            Optional: Add notes about your solution approach, key insights, or things to remember
          </p>
        </div>

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
