"use client";

import { useAuth } from '../contexts/AuthContext';
import { usePomodoroTimer } from '../hooks/usePomodoros';
import ProtectedRoute from '../components/ProtectedRoute';
import TopNavbar from '../components/dashboard/TopNavbar';
import SimplePomodoroClock from '../components/pomodoros/SimplePomodoroClock';

export default function PomodorosPage() {
  const { user, logout } = useAuth();

  const { 
    activePomodoro, 
    startPomodoro, 
    pausePomodoro, 
    resumePomodoro, 
    completePomodoro, 
    cancelPomodoro
  } = usePomodoroTimer();

  const handleStartPomodoro = async (id: number) => {
    await startPomodoro(id);
  };

  const handlePausePomodoro = async () => {
    if (activePomodoro) {
      await pausePomodoro(activePomodoro.id);
    }
  };

  const handleResumePomodoro = async () => {
    if (activePomodoro) {
      await resumePomodoro(activePomodoro.id);
    }
  };

  const handleCompletePomodoro = async () => {
    if (activePomodoro) {
      await completePomodoro(activePomodoro.id);
    }
  };

  const handleCancelPomodoro = async () => {
    if (activePomodoro) {
      await cancelPomodoro(activePomodoro.id);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{background: 'linear-gradient(90deg, #EDEDED 0%, #FDF5D6 100%)'}}>
        <TopNavbar user={user} onLogout={logout} />
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Simple Pomodoro Clock */}
        <div className="mb-8">
          <SimplePomodoroClock
            activePomodoro={activePomodoro}
            onStart={handleStartPomodoro}
            onPause={handlePausePomodoro}
            onResume={handleResumePomodoro}
            onComplete={handleCompletePomodoro}
            onCancel={handleCancelPomodoro}
          />
        </div>


          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
