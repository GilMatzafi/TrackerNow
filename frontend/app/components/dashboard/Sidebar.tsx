"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Problems', href: '/problems', icon: '💻' },
  { name: 'Applications', href: '/applications', icon: '📝' },
  { name: 'Reviews', href: '/reviews', icon: '📋' },
  { name: 'Statistics', href: '/statistics', icon: '📈' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-gray-900">TrackerNow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            General
          </h3>
          {navigation.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-1 mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Tools
          </h3>
          {navigation.slice(4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Upgrade Card */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">💎</span>
            <span className="font-semibold">Pro Plan</span>
          </div>
          <p className="text-sm opacity-90 mb-3">
            Unlock advanced analytics and unlimited problem tracking
          </p>
          <button className="w-full bg-white text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
            Upgrade Plan
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            ©2024 TrackerNow, Inc.
          </p>
        </div>
      </div>
    </div>
  );
}
