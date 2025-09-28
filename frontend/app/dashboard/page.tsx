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
import ApplicationSuccessRate from '../components/dashboard/ApplicationSuccessRate';
import ApplicationTrends from '../components/dashboard/ApplicationTrends';
import ReferralAnalysis from '../components/dashboard/ReferralAnalysis';
import { useOnboardingTasks } from '../hooks/useOnboardingTasks';
import { useProblems } from '../hooks/useProblems';
import { useJobs } from '../hooks/useJobs';
import UserProfileCard from '../components/dashboard/UserProfileCard';
import ProgressCard from '../components/dashboard/ProgressCard';
import OnboardingTasksCard from '../components/dashboard/OnboardingTasksCard';
import MotivationalQuotesCard from '../components/dashboard/MotivationalQuotesCard';
import TimeTrackerCard from '../components/dashboard/TimeTrackerCard';
import CalendarCard from '../components/dashboard/CalendarCard';
import JobApplicationForm from '../applications/components/JobApplicationForm';
import { JobCreate } from '../types/job';

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

  // Jobs data from backend
  const { 
    jobs, 
    loading: jobsLoading, 
    error: jobsError,
    jobStats,
    createJob
  } = useJobs();

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);



  // Process real data from backend
  const dashboardData = {
    problemsSolved: problems.length,
    applicationsSent: jobs.length,
    interviewRate: jobStats ? Math.round((jobStats.jobs_by_status.interview || 0) / jobs.length * 100) : 0,
    streak: 8, // Keep mock data for now
    timeSpent: 24.5, // Keep mock data for now
    problemsByTopic: [
      { topic: 'Arrays', count: 15, percentage: 32 },
      { topic: 'Graphs', count: 12, percentage: 26 },
      { topic: 'Dynamic Programming', count: 8, percentage: 17 },
      { topic: 'Strings', count: 7, percentage: 15 },
      { topic: 'Trees', count: 5, percentage: 10 }
    ],
    applicationsByStatus: jobStats ? [
      { status: 'Applied', count: jobStats.jobs_by_status.applied || 0, percentage: Math.round((jobStats.jobs_by_status.applied || 0) / jobs.length * 100) },
      { status: 'Interview', count: jobStats.jobs_by_status.interview || 0, percentage: Math.round((jobStats.jobs_by_status.interview || 0) / jobs.length * 100) },
      { status: 'Offer', count: jobStats.jobs_by_status.offered || 0, percentage: Math.round((jobStats.jobs_by_status.offered || 0) / jobs.length * 100) }
    ] : [],
    dailyProgress: [
      { day: 'Mon', problems: 5, hours: 2.5 },
      { day: 'Tue', problems: 8, hours: 3.2 },
      { day: 'Wed', problems: 3, hours: 1.8 },
      { day: 'Thu', problems: 7, hours: 2.9 },
      { day: 'Fri', problems: 6, hours: 2.1 },
      { day: 'Sat', problems: 4, hours: 1.5 },
      { day: 'Sun', problems: 2, hours: 0.8 }
    ],
    recentApplications: jobs.slice(0, 5).map(job => ({
      company: job.company,
      position: job.position,
      status: job.status,
      date: job.applied_date || job.created_at
    }))
  };

  const handleFormSubmit = async (jobData: JobCreate) => {
    try {
      await createJob(jobData);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating job:', error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  return (
    <ProtectedRoute>
      <PomodoroProvider>
        <div className="min-h-screen bg-gray-50">
          <TopNavbar user={user ? { name: `${user.first_name} ${user.last_name}`, email: user.email } : undefined} onLogout={logout} />
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
                  {jobsLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600">Loading applications...</p>
                      </div>
                    </div>
                  ) : jobsError ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <p className="text-lg text-red-600">Error loading applications</p>
                        <p className="text-sm text-gray-500">{jobsError}</p>
                      </div>
                    </div>
                  ) : (
                    <ApplicationsTable data={dashboardData.recentApplications} />
                  )}
                </div>
              </div>

              {/* Application Analytics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-1 auto-rows-[800px] mb-2">
                {/* Application Success Rate */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 lg:col-span-1">
                  <ApplicationSuccessRate jobs={jobs} />
                </div>
                
                {/* Application Trends */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 lg:col-span-1">
                  <ApplicationTrends jobs={jobs} />
                </div>
                
                {/* Referral Analysis */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 lg:col-span-1">
                  <ReferralAnalysis jobs={jobs} />
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

          {/* Floating Action Button */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 group"
            title="Add New Job Application"
          >
            <svg className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          {/* Job Application Form Modal */}
          {isFormOpen && (
            <JobApplicationForm
              onClose={() => setIsFormOpen(false)}
              onSubmit={handleFormSubmit}
            />
          )}
        </div>
      </PomodoroProvider>
    </ProtectedRoute>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
