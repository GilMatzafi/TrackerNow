"use client";

import { useState } from 'react';

export default function ApplicationsHeader() {
  const [dateRange, setDateRange] = useState('Oct 17, 2024 - Nov 6, 2024');

  return (
    <div className="mb-8 w-full">
      {/* Title and Subtitle */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">Jobs</h1>
          <p className="text-2xl text-gray-600">Keep track of your applied job all in one place</p>
        </div>
        
        {/* Date Range and Add Job Button */}
        <div className="flex items-center space-x-4">
          <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-lg">
            {dateRange}
          </button>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
            Add Job
          </button>
        </div>
      </div>

      {/* Filter/Group/Sort Bar */}
      <div className="flex items-center space-x-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-lg font-medium">Filter</span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-lg font-medium">Group by</span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span className="text-lg font-medium">Sort by</span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
