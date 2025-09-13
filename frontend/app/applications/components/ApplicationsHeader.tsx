"use client";

import { useState } from 'react';

export default function ApplicationsHeader() {
  const [dateRange, setDateRange] = useState('Oct 17, 2024 - Nov 6, 2024');

  return (
    <div className="mb-8 w-full">
      {/* Title and Subtitle */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-8xl font-bold text-gray-900 mb-2">Applications Board</h1>
          <p className="text-3xl text-gray-600">Keep track of your applied job all in one place</p>
        </div>
        
        {/* Date Range and Add Job Button */}
        <div className="flex items-center space-x-4">
          <button className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg">
            Add Application
          </button>
        </div>
      </div>

    </div>
  );
}
