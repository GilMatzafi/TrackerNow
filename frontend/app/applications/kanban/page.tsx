"use client";

import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import TopNavbar from '../../components/dashboard/TopNavbar';
import ApplicationsHeader from '../components/ApplicationsHeader';
import KanbanBoard from '../components/KanbanBoard';

export default function ApplicationsKanbanPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{background: 'linear-gradient(90deg, #EDEDED 0%, #FDF5D6 100%)'}}>
        <TopNavbar user={user} onLogout={logout} />
        <main className="py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <ApplicationsHeader />
            <KanbanBoard />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
