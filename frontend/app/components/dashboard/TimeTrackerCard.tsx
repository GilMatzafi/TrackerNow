"use client";

export default function TimeTrackerCard() {
  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Time Tracker</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
            Today
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
            Week
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
            Month
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">Coding</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">2h 45m</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Reading</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">1h 20m</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-700">Meetings</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">45m</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">Break</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">30m</span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Time</span>
          <span className="text-2xl font-bold text-gray-900">5h 20m</span>
        </div>
      </div>
    </div>
  );
}
