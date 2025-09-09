"use client";

import { useState, useEffect } from 'react';
import { Problem, ProblemFormData } from '../../types/problem';

interface ProblemFormProps {
  problem?: Problem | null;
  onSubmit: (problem: Problem | Omit<Problem, 'id'>) => void;
  onCancel: () => void;
}

export default function ProblemForm({ problem, onSubmit, onCancel }: ProblemFormProps) {
  const [formData, setFormData] = useState<ProblemFormData>({
    name: '',
    topics: [],
    difficulty: 'Easy',
    link: '',
    time_minutes: undefined,
    notes: ''
  });
  const [newTopic, setNewTopic] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (problem) {
      setFormData({
        name: problem.name,
        topics: problem.topics,
        difficulty: problem.difficulty,
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

  const addTopic = () => {
    if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter(topic => topic !== topicToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTopic();
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {problem ? 'Edit Problem' : 'Add New Problem'}
        </h2>
        <p className="text-gray-600 mt-1">
          {problem ? 'Update the problem details below.' : 'Fill in the details for your new coding problem.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Problem Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Problem Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., Two Sum"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Topics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topics
          </label>
          <div className="space-y-3">
            {/* Add Topic Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add a topic (e.g., Arrays, Hash Table)"
              />
              <button
                type="button"
                onClick={addTopic}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            
            {/* Topics List */}
            {formData.topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => removeTopic(topic)}
                      className="ml-2 text-primary/70 hover:text-primary"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Topics are optional. Add relevant algorithm or data structure categories.
          </p>
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty *
          </label>
          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Link */}
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
            Problem Link
          </label>
          <input
            type="url"
            id="link"
            value={formData.link}
            onChange={(e) => handleInputChange('link', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.link ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="https://leetcode.com/problems/..."
          />
          {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Optional: Link to the problem on LeetCode, HackerRank, etc.
          </p>
        </div>

        {/* Time */}
        <div>
          <label htmlFor="time_minutes" className="block text-sm font-medium text-gray-700 mb-2">
            Time Spent (minutes)
          </label>
          <input
            type="number"
            id="time_minutes"
            value={formData.time_minutes || ''}
            onChange={(e) => handleInputChange('time_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
            min="1"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.time_minutes ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="15"
          />
          {errors.time_minutes && <p className="mt-1 text-sm text-red-600">{errors.time_minutes}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Optional: How long it took you to solve this problem.
          </p>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Add any notes about your solution approach, key insights, or things to remember..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Optional: Add notes about your solution, approach, or key insights.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {problem ? 'Update Problem' : 'Add Problem'}
          </button>
        </div>
      </form>
    </div>
  );
}
