"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PomodoroProvider } from '../contexts/PomodoroContext';
import ProtectedRoute from '../components/ProtectedRoute';
import TopNavbar from '../components/dashboard/TopNavbar';
import KPICards from '../components/dashboard/KPICards';
import ProgressChart from '../components/dashboard/ProgressChart';
import TimeSpentChart from '../components/dashboard/TimeSpentChart';
import ProblemDistribution from '../components/dashboard/ProblemDistribution';
import TimeToComplete from '../components/dashboard/TimeToComplete';
import ActivityChart from '../components/dashboard/ActivityChart';
import ApplicationsTable from '../components/dashboard/ApplicationsTable';
import { useOnboardingTasks } from '../hooks/useOnboardingTasks';
import { useProblems } from '../hooks/useProblems';
import UserProfileCard from '../components/dashboard/UserProfileCard';
import ProgressCard from '../components/dashboard/ProgressCard';
import OnboardingTasksCard from '../components/dashboard/OnboardingTasksCard';
import MotivationalQuotesCard from '../components/dashboard/MotivationalQuotesCard';
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

  // Problems data from backend
  const { 
    problems, 
    loading: problemsLoading, 
    error: problemsError 
  } = useProblems();



  // Mock data - in a real app, this would come from your backend
  const dashboardData = {
    problemsSolved: problems.length,
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
      <PomodoroProvider>
        <div className="min-h-screen bg-gray-50">
          <TopNavbar user={user} onLogout={logout} />
            <main className="py-8">
            <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Combined Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-1 auto-rows-[400px] mb-2">
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
                {/* Motivational Quotes Card - Leftmost */}
                <MotivationalQuotesCard />

                {/* Calendar Card - Spans 2 columns */}
                <CalendarCard className="col-span-2" />

              </div>
              {/* Third Row - Time Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-1 auto-rows-[800px] mb-2">
                {/* Time to Complete */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 lg:col-span-2">
                  <TimeToComplete problems={problems} />
                </div>
                
                {/* Applications Timeline */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 lg:col-span-2">
                  <ApplicationsTable data={dashboardData.recentApplications} />
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-1 auto-rows-[1000px] mb-2">
                {/* Problem Distribution */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 lg:col-span-2">
                  <ProblemDistribution problems={problems} />
                </div>
                
                {/* Activity Chart */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 lg:col-span-2">
                  <ActivityChart problems={problems} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </PomodoroProvider>
    </ProtectedRoute>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
