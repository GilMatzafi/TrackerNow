"use client";

import { useState } from 'react';
import { User } from '../../services/auth';
import Avatar from '../Avatar';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ 
  user, 
  onLogout
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);


  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end">


        {/* Right side - User menu */}
        <div className="flex items-center space-x-6">
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
