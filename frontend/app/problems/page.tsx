"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProblems } from '../hooks/useProblems';
import ProtectedRoute from '../components/ProtectedRoute';
import TopNavbar from '../components/dashboard/TopNavbar';
import ProblemsList from '../components/problems/ProblemsList';
import ProblemForm from '../components/problems/ProblemForm';
import { Problem } from '../types/problem';

export default function ProblemsPage() {
  const { user, logout } = useAuth();
  const { problems, loading, error, addProblem, updateProblem, deleteProblem } = useProblems();
  const [showForm, setShowForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  const handleAddProblem = async (problem: Omit<Problem, 'id'>) => {
    const success = await addProblem(problem);
    if (success) {
      setShowForm(false);
      setSelectedDifficulty(null);
      setSelectedStatus(null);
    }
  };

  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    setShowForm(true);
  };

  const handleUpdateProblem = async (updatedProblem: Problem | Omit<Problem, 'id'>) => {
    if ('id' in updatedProblem) {
      const { id, ...updateData } = updatedProblem;
      const success = await updateProblem(id, updateData);
      if (success) {
        setShowForm(false);
        setEditingProblem(null);
      }
    }
  };

  const handleDeleteProblem = async (id: number) => {
    await deleteProblem(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProblem(null);
    setSelectedDifficulty(null);
    setSelectedStatus(null);
  };

  const [selectedDifficulty, setSelectedDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'REVIEW' | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVISIT' | null>(null);

  const handleAddNew = (difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'REVIEW') => {
    // For REVIEW column, don't pre-select difficulty - let user choose
    setSelectedDifficulty(difficulty === 'REVIEW' ? null : difficulty);
    setSelectedStatus(difficulty === 'REVIEW' ? 'NEEDS_REVISIT' : 'NOT_STARTED');
    setEditingProblem(null); // Clear editing problem for new problem
    setShowForm(true);
  };

  return (
    <>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <TopNavbar user={user ? { name: `${user.first_name} ${user.last_name}`, email: user.email } : undefined} onLogout={logout} />
          <main className="py-8">
            <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12" style={{ marginLeft: '290px', marginRight: 'unset' }}>
                    {/* Header */}
                    <div className="mb-8 animate-fade-in-up">
                      <div className="animate-slide-in-left">
                      </div>
                    </div>

                    {/* Content */}
                    <>
                      {/* Loading State */}
                      {loading && (
                        <div className="flex justify-center items-center py-20">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                          <span className="ml-4 text-2xl" style={{ color: '#6B7280' }}>Loading problems...</span>
                        </div>
                      )}

                      {/* Error State */}
                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-12 mb-12">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-12 w-12 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-6">
                              <h3 className="text-3xl font-bold text-red-800">Error loading problems</h3>
                              <div className="mt-4 text-2xl text-red-700">
                                <p>{error}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Problems List */}
                      {!loading && !error && (
                        <div className="animate-fade-in-up">
                          <ProblemsList
                            problems={problems}
                            onEdit={handleEditProblem}
                            onDelete={handleDeleteProblem}
                            onAddNew={handleAddNew}
                          />
                        </div>
                      )}
                    </>
            </div>
          </main>
        </div>
      </ProtectedRoute>
      
      {/* Problem Form Modal - Outside all containers */}
      {showForm && (
        <ProblemForm
          problem={editingProblem}
          onSubmit={editingProblem ? handleUpdateProblem : handleAddProblem}
          onCancel={handleCancelForm}
          initialDifficulty={selectedDifficulty === 'REVIEW' ? undefined : selectedDifficulty || undefined}
          initialStatus={selectedStatus || undefined}
        />
      )}
    </>
  );
}
