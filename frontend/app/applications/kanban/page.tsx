"use client";

import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import TopNavbar from '../../components/dashboard/TopNavbar';
import KanbanBoard from '../components/KanbanBoard';

export default function ApplicationsKanbanPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <TopNavbar user={user} onLogout={logout} />
        <main className="py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <KanbanBoard />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
