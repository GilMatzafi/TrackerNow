"use client";

export default function ProgressCard() {
  return (
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
        
        {/* Day labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
}
