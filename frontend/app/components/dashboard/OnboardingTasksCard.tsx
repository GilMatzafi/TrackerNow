"use client";

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-700 row-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-4xl font-semibold text-white">Onboarding Task</h3>
        <span className="text-2xl text-white">{completedCount}/{totalTasks}</span>
      </div>
      
      {/* Add Task Form */}
      <div className="mb-6 p-4 bg-gray-700 rounded-xl">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const title = formData.get('title') as string;
          const dueDate = formData.get('dueDate') as string;
          
          if (title.trim()) {
            try {
              await createTask({
                title: title.trim(),
                due_date: dueDate || undefined
              });
              (e.target as HTMLFormElement).reset();
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
              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:border-yellow-400"
              required
            />
            <input
              name="dueDate"
              type="datetime-local"
              className="px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:border-yellow-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-colors duration-200 font-medium"
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
          <div className="text-center text-gray-400">No tasks yet. Add your first task!</div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id}
              className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <div 
                onClick={() => handleToggleTask(task.id)}
                className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500"
              >
                {getIcon(task.title)}
              </div>
              <div 
                onClick={() => handleToggleTask(task.id)}
                className="flex-1 cursor-pointer"
              >
                <p className="text-2xl font-medium text-white">{task.title}</p>
                <p className="text-lg text-gray-400">{formatDate(task.due_date)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    task.completed 
                      ? 'bg-yellow-400 scale-110' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                >
                  {task.completed && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                  className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-200"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
