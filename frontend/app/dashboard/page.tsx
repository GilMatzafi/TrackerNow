"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import KPICards from '../components/dashboard/KPICards';
import ProgressChart from '../components/dashboard/ProgressChart';
import TimeSpentChart from '../components/dashboard/TimeSpentChart';
import ProblemDistribution from '../components/dashboard/ProblemDistribution';
import ApplicationsTable from '../components/dashboard/ApplicationsTable';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

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
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <Header 
              user={user} 
              onLogout={logout}
              selectedTimeRange={selectedTimeRange}
              onTimeRangeChange={setSelectedTimeRange}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
            
            {/* Dashboard Content */}
            <main className="flex-1 p-6">
              {/* KPI Cards */}
              <KPICards data={dashboardData} />
              
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Progress Overview */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <ProgressChart data={dashboardData.dailyProgress} />
                </div>
                
                {/* Time Spent Coding */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <TimeSpentChart data={dashboardData.dailyProgress} />
                </div>
              </div>
              
              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Problem Distribution */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <ProblemDistribution data={dashboardData.problemsByTopic} />
                </div>
                
                {/* Applications Timeline */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <ApplicationsTable data={dashboardData.recentApplications} />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
