"use client";

import { useState, useEffect, useRef } from 'react';
import { OnboardingTask } from '../../services';

interface OnboardingTasksCardProps {
  tasks: OnboardingTask[];
  tasksLoading: boolean;
  tasksError: string | null;
  completedCount: number;
  totalTasks: number;
  createTask: (taskData: { title: string; due_date?: string }) => Promise<OnboardingTask>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskCompletion: (id: number) => Promise<OnboardingTask>;
}

export default function OnboardingTasksCard({
  tasks,
  tasksLoading,
  tasksError,
  completedCount,
  totalTasks,
  createTask,
  deleteTask,
  toggleTaskCompletion
}: OnboardingTasksCardProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);
  const handleToggleTask = async (taskId: number) => {
    try {
      await toggleTaskCompletion(taskId);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const getIcon = (taskTitle: string) => {
    // Default icon for all tasks
    return (
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="rounded-3xl p-8 shadow-xl border row-span-2 hover:shadow-2xl transition-all duration-300" style={{backgroundColor: '#0A192F', borderColor: '#F5B301'}}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-6xl font-semibold text-white">Onboarding Task</h3>
        <span className="text-4xl text-white">{completedCount}/{totalTasks}</span>
      </div>
      
      {/* Add Task Form */}
      <div className="mb-6 p-4 bg-gray-700 rounded-xl">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const title = formData.get('title') as string;
          
          if (title.trim()) {
            try {
              await createTask({
                title: title.trim(),
                due_date: selectedDate ? selectedDate.toISOString() : undefined
              });
              (e.target as HTMLFormElement).reset();
              setSelectedDate(null);
            } catch (error) {
              console.error('Failed to create task:', error);
            }
          }
        }}>
          <div className="flex space-x-3">
            <input
              name="title"
              type="text"
              placeholder="Add new task..."
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:border-yellow-400 text-lg"
              required
            />
            <div className="relative" ref={datePickerRef}>
              <input
                name="dueDate"
                type="text"
                placeholder="Select date"
                value={selectedDate ? selectedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : ''}
                readOnly
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:border-yellow-400 text-lg cursor-pointer w-full min-w-[200px] placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              {/* Custom Date Picker */}
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 min-w-[300px]">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Select Date</h4>
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(false)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : null;
                          setSelectedDate(date);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate(null);
                          setShowDatePicker(false);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(false)}
                        className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer font-medium"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-colors duration-200 font-medium text-lg cursor-pointer"
            >
              Add
            </button>
          </div>
        </form>
      </div>
      
      <div className="space-y-4">
        {tasksLoading ? (
          <div className="text-center text-white">Loading tasks...</div>
        ) : tasksError ? (
          <div className="text-center text-red-400">Error loading tasks: {tasksError}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">No tasks yet. Add your first task!</div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id}
              className={`flex items-center space-x-4 p-5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer border ${
                task.completed 
                  ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border-yellow-600/50' 
                  : 'bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-gray-600/50 hover:from-gray-600/50 hover:to-gray-700/50'
              }`}
            >
              <div 
                onClick={() => handleToggleTask(task.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  task.completed 
                    ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg' 
                    : 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'
                }`}
              >
                {task.completed ? (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                )}
              </div>
              <div 
                onClick={() => handleToggleTask(task.id)}
                className="flex-1 cursor-pointer"
              >
                <p className={`text-3xl font-medium transition-all duration-200 ${
                  task.completed 
                    ? 'text-yellow-300 line-through' 
                    : 'text-white'
                }`}>{task.title}</p>
                <p className="text-xl text-gray-400">{formatDate(task.due_date)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                  className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
