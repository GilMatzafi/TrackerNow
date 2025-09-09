"use client";

import { useState } from 'react';
import { User } from '../../services/auth';
import Avatar from '../Avatar';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  selectedTimeRange: string;
  onTimeRangeChange: (range: string) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export default function Header({ 
  user, 
  onLogout, 
  selectedTimeRange, 
  onTimeRangeChange,
  selectedPeriod,
  onPeriodChange 
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const timeRanges = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' }
  ];

  const periods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/PDF report
    console.log('Exporting report...');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title, Navigation arrows and search */}
        <div className="flex items-center space-x-4">
          {/* App Title */}
          <h1 className="text-xl font-bold text-gray-900">TrackerNow</h1>
          
          {/* Navigation arrows */}
          <div className="flex items-center space-x-2">
            <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search problems, companies..."
              className="pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-80 text-base"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <kbd className="inline-flex items-center px-3 py-1 border border-gray-200 rounded text-sm font-mono text-gray-500">
                ⌘ + F
              </kbd>
            </div>
          </div>
        </div>

        {/* Center - Time range and filters */}
        <div className="flex items-center space-x-4">
          {/* Time range selector */}
          <select
            value={selectedTimeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Period selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>

          {/* Filter button */}
          <button className="flex items-center space-x-2 px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-base font-medium">Filter</span>
          </button>

          {/* Export button */}
          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-base font-medium">Export</span>
          </button>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors relative">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-semibold">
              3
            </span>
          </button>

          {/* User profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Avatar user={user} size="lg" showOnlineIndicator={true} />
              <div className="text-left">
                <p className="text-base font-medium text-gray-900">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : 'User'
                  }
                </p>
                <p className="text-sm text-gray-500">Developer</p>
              </div>
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <a href="/profile" className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
                <a href="/settings" className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
                <hr className="my-2" />
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
