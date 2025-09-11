"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Problems', href: '/problems' },
  { name: 'Applications', href: '/applications' },
  { name: 'Pomodoros', href: '/pomodoros' },
  { name: 'Books', href: '/books' },
  { name: 'Videos', href: '/videos' },
];

interface TopNavbarProps {
  user?: {
    name?: string;
    email?: string;
  };
  onLogout?: () => void;
}

export default function TopNavbar({ user, onLogout }: TopNavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="h-24 px-8 pt-24 pb-32" style={{background: 'linear-gradient(90deg, #EDEDED 0%, #FDF5D6 100%)'}}>
      <div className="flex items-center justify-between h-full">
        {/* Brand/Logo */}
        <div className="flex items-center">
          <div className="border-2 border-black rounded-full px-7 py-3" style={{background: 'linear-gradient(90deg, #EDEDED 0%, #FDF5D6 100%)'}}>
            <span className="text-gray-900 font-light text-6xl">TrackerNow</span>
          </div>
        </div>

        {/* Main Navigation Container */}
        <div className="flex-1 flex justify-end px-5">
          <div className="bg-white rounded-3xl shadow-sm h-24 flex items-center">
            <div className="flex items-center">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-10 py-8 rounded-full text-xl font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gray-800 text-white shadow-lg'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Settings Button */}
          <button className="bg-white border border-gray-200 rounded-full px-4 py-4 flex items-center space-x-2 hover:bg-gray-50 transition-all duration-300">
            <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Profile Button */}
          <button className="w-16 h-16 bg-white border border-gray-200 rounded-full  flex items-center justify-center hover:bg-gray-50 transition-all duration-300">
            <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
