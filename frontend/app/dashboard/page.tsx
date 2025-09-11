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
import UserProfileCard from '../components/dashboard/UserProfileCard';
import ProgressCard from '../components/dashboard/ProgressCard';
import OnboardingTasksCard from '../components/dashboard/OnboardingTasksCard';
import TimeTrackerCard from '../components/dashboard/TimeTrackerCard';
import CalendarCard from '../components/dashboard/CalendarCard';

function DashboardContent() {
  const { user, logout, refreshUser } = useAuth();
  
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
                <UserProfileCard user={user} onRefreshUser={refreshUser} />

                {/* Progress Card */}
                <ProgressCard />

                {/* Time Tracker Card */}
                <TimeTrackerCard />

                {/* Onboarding Tasks Card - Rightmost, twice height */}
                <OnboardingTasksCard
                  tasks={tasks}
                  tasksLoading={tasksLoading}
                  tasksError={tasksError}
                  completedCount={completedCount}
                  totalTasks={totalTasks}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  toggleTaskCompletion={toggleTaskCompletion}
                />

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
                <CalendarCard className="col-span-2" />

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
