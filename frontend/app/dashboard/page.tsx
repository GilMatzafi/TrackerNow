"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import TopNavbar from '../components/dashboard/TopNavbar';
import KPICards from '../components/dashboard/KPICards';
import ProgressChart from '../components/dashboard/ProgressChart';
import TimeSpentChart from '../components/dashboard/TimeSpentChart';
import ProblemDistribution from '../components/dashboard/ProblemDistribution';
import ApplicationsTable from '../components/dashboard/ApplicationsTable';
import { useOnboardingTasks } from '../hooks/useOnboardingTasks';
import { OnboardingTask } from '../services';

function DashboardContent() {
  const { user, logout } = useAuth();
  const [avatarSeed, setAvatarSeed] = useState(user?.first_name || 'User');
  
  // Onboarding tasks from backend
  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError, 
    completedCount, 
    totalTasks, 
    createTask, 
    deleteTask, 
    toggleTaskCompletion 
  } = useOnboardingTasks();

  const generateNewAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(newSeed);
  };

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

  // Mock data - in a real app, this would come from your backend
  const dashboardData = {
    problemsSolved: 47,
    applicationsSent: 12,
    interviewRate: 25, // 25% success rate
    streak: 8,
    timeSpent: 24.5, // hours
    problemsByTopic: [
      { topic: 'Arrays', count: 15, percentage: 32 },
      { topic: 'Graphs', count: 12, percentage: 26 },
      { topic: 'Dynamic Programming', count: 8, percentage: 17 },
      { topic: 'Strings', count: 7, percentage: 15 },
      { topic: 'Trees', count: 5, percentage: 10 }
    ],
    applicationsByStatus: [
      { status: 'Applied', count: 8, percentage: 67 },
      { status: 'Interview', count: 3, percentage: 25 },
      { status: 'Offer', count: 1, percentage: 8 }
    ],
    dailyProgress: [
      { day: 'Mon', problems: 5, hours: 2.5 },
      { day: 'Tue', problems: 8, hours: 3.2 },
      { day: 'Wed', problems: 3, hours: 1.8 },
      { day: 'Thu', problems: 7, hours: 2.9 },
      { day: 'Fri', problems: 6, hours: 2.1 },
      { day: 'Sat', problems: 4, hours: 1.5 },
      { day: 'Sun', problems: 2, hours: 0.8 }
    ],
    recentApplications: [
      { company: 'Google', position: 'Software Engineer', status: 'Interview', date: '2024-01-15' },
      { company: 'Microsoft', position: 'Frontend Developer', status: 'Applied', date: '2024-01-14' },
      { company: 'Amazon', position: 'Full Stack Engineer', status: 'Offer', date: '2024-01-13' }
    ]
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{background: 'linear-gradient(90deg, #EDEDED 0%, #FDF5D6 100%)'}}>
        <TopNavbar user={user} onLogout={logout} />
          <main className="py-8">
            <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
              {/* Welcome Message */}
              <div className="mb-24">
                <h1 className="text-6xl  text-gray-900">Welcome in, {user?.first_name || 'User'}</h1>
              </div>
              
              {/* Combined Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-8 auto-rows-[400px] mb-10">
                {/* User Profile Card */}
                <div className="relative rounded-3xl p-10 shadow-sm border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  {/* Background Avatar */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=400)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col justify-end h-full">
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                        {user?.first_name && user?.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : user?.first_name || 'User'
                        }
                      </h3>
                    </div>
                    
                    {/* Refresh button */}
                    <button 
                      onClick={generateNewAvatar}
                      className="absolute top-4 right-4 w-8 h-8 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-full shadow-lg border-2 border-white flex items-center justify-center hover:bg-opacity-100 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-20"
                      title="Generate new avatar"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-200 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Progress</h3>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-gray-900">6.1 h</span>
                        <span className="text-sm text-gray-600">Work Time this week</span>
                      </div>
                    </div>
                    <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="relative">
                    {/* Bar chart - bars going upward */}
                    <div className="flex items-end justify-between h-20 mb-2">
                      <div className="w-6 h-4 bg-gray-200 rounded-t-sm"></div>
                      <div className="w-6 h-8 bg-gray-800 rounded-t-sm"></div>
                      <div className="w-6 h-6 bg-gray-800 rounded-t-sm"></div>
                      <div className="w-6 h-5 bg-gray-800 rounded-t-sm"></div>
                      <div className="w-6 h-8 bg-gray-800 rounded-t-sm"></div>
                      <div className="w-6 h-12 bg-yellow-400 rounded-t-sm relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-800 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                          5h 23m
                        </div>
                      </div>
                      <div className="w-6 h-2 bg-gray-200 rounded-t-sm"></div>
                    </div>
                    
                    {/* Day labels below bars */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>S</span>
                      <span>M</span>
                      <span>T</span>
                      <span>W</span>
                      <span>T</span>
                      <span>F</span>
                      <span>S</span>
                    </div>
                  </div>
                </div>

                {/* Time Tracker Card */}
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Time tracker</h3>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-sm">02:35</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Work Time</p>
                    <div className="flex space-x-2 mb-4">
                      <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                      <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                      </button>
                    </div>
                    <button className="flex items-center space-x-1 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>History</span>
                    </button>
                  </div>
                </div>

                {/* Onboarding Tasks Card - Rightmost, twice height */}
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
                      tasks.map((task) => {
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
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Second Row Cards */}
                {/* Onboarding Tasks Card - Leftmost */}
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Onboarding Task</h3>
                    <span className="text-sm text-gray-600">2/8</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Interview</p>
                        <p className="text-xs text-gray-500">Sep 13, 08:30</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Team Meeting</p>
                        <p className="text-xs text-gray-500">Sep 13, 10:30</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Project Update</p>
                        <p className="text-xs text-gray-500">Sep 13, 13:00</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Discuss Q3 Goals</p>
                        <p className="text-xs text-gray-500">Sep 13, 14:45</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">HR Policy Review</p>
                        <p className="text-xs text-gray-500">Sep 13, 16:30</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar Card - Spans 2 columns */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <button className="text-gray-400">August</button>
                    <h3 className="text-lg font-semibold text-gray-900">September 2024</h3>
                    <button className="text-gray-400">October</button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    <div className="text-center text-xs text-gray-500 py-2">Mon</div>
                    <div className="text-center text-xs text-gray-500 py-2">Tue</div>
                    <div className="text-center text-xs text-gray-500 py-2">Wed</div>
                    <div className="text-center text-xs text-gray-500 py-2">Thu</div>
                    <div className="text-center text-xs text-gray-500 py-2">Fri</div>
                    <div className="text-center text-xs text-gray-500 py-2">Sat</div>
                    <div className="text-center text-xs text-gray-500 py-2">Sun</div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-black text-white p-2 rounded text-xs">
                      <p className="font-medium">Weekly Team Sync</p>
                      <p className="text-gray-300">Discuss progress on projects</p>
                      <div className="flex -space-x-1 mt-1">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-gray-100 text-gray-900 p-2 rounded text-xs">
                      <p className="font-medium">Onboarding Session</p>
                      <p className="text-gray-600">Introduction for new hires</p>
                      <div className="flex -space-x-1 mt-1">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* KPI Cards */}
              <KPICards data={dashboardData} />
              
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 ">
                {/* Progress Overview */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200">
                  <ProgressChart data={dashboardData.dailyProgress} />
                </div>
                
                {/* Time Spent Coding */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200">
                  <TimeSpentChart data={dashboardData.dailyProgress} />
                </div>
              </div>
              
              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Problem Distribution */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200">
                  <ProblemDistribution data={dashboardData.problemsByTopic} />
                </div>
                
                {/* Applications Timeline */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200">
                  <ApplicationsTable data={dashboardData.recentApplications} />
                </div>
              </div>
            </div>
          </main>
      </div>
    </ProtectedRoute>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
