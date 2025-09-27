"use client";

import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ProblemFormData } from '../../types/problem';
import { difficultyOptions, statusOptions } from './constants';

interface SelectFieldProps {
  formData: ProblemFormData;
  isAutofilled: boolean;
  onInputChange: (field: keyof ProblemFormData, value: any) => void;
}

export default function SelectField({ formData, isAutofilled, onInputChange }: SelectFieldProps) {
  return (
    <>
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
        
        <Listbox value={formData.difficulty} onChange={(value) => !isAutofilled && onInputChange('difficulty', value)} disabled={isAutofilled}>
          <div className="relative">
            <Listbox.Button className={`relative w-full px-6 py-4 text-left border rounded-lg shadow-sm focus:outline-none transition-colors ${
              isAutofilled 
                ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
            }`}>
              <span className="flex items-center gap-3" style={{ color: isAutofilled ? '#6B7280' : '#111827', fontSize: '20px' }}>
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
                        active ? 'bg-blue-50 text-gray-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
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
        
        <Listbox value={formData.status} onChange={(value) => onInputChange('status', value)}>
          <div className="relative">
            <Listbox.Button className="relative w-full px-6 py-4 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors">
              <span className="flex items-center gap-3" style={{ color: '#111827', fontSize: '20px' }}>
                {(() => {
                  const statusOption = statusOptions.find(option => option.value === formData.status);
                  const IconComponent = statusOption?.icon;
                  return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
                })()}
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
                        active ? 'bg-blue-50 text-gray-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const IconComponent = option.icon;
                            return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
                          })()}
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
    </>
  );
}
