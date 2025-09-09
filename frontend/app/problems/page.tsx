"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProblems } from '../hooks/useProblems';
import ProtectedRoute from '../components/ProtectedRoute';
import { SidebarProvider } from '../contexts/SidebarContext';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
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
    }
  };

  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    setShowForm(true);
  };

  const handleUpdateProblem = async (updatedProblem: Problem) => {
    const { id, ...updateData } = updatedProblem;
    const success = await updateProblem(id, updateData);
    if (success) {
      setShowForm(false);
      setEditingProblem(null);
    }
  };

  const handleDeleteProblem = async (id: number) => {
    await deleteProblem(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProblem(null);
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="flex">
            <Sidebar />
            
            <div className="flex-1 flex flex-col">
              <Header user={user} onLogout={logout} />
              
              <main className="flex-1 p-8">
                <div className="max-w-none mx-auto px-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                    <div className="animate-slide-in-left">
                      <h1 className="text-3xl font-bold" style={{ color: '#111827' }}>Problems</h1>
                      <p className="mt-2" style={{ color: '#4B5563' }}>
                        Manage your coding interview problems and track your progress
                      </p>
                    </div>
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-3 rounded-lg transition-all duration-300 font-medium animate-slide-in-right hover:scale-105 hover:shadow-lg cursor-pointer"
                      style={{ 
                        backgroundColor: '#000000',
                        color: '#FFFFFF',
                        border: '2px solid #000000',
                        fontWeight: '600',
                        fontSize: '16px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#333333';
                        e.currentTarget.style.borderColor = '#333333';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#000000';
                        e.currentTarget.style.borderColor = '#000000';
                      }}
                    >
                      Add Problem
                    </button>
                  </div>

                  {/* Content */}
                  {showForm ? (
                    <div className="animate-fade-in-up">
                      <ProblemForm
                        problem={editingProblem}
                        onSubmit={editingProblem ? handleUpdateProblem : handleAddProblem}
                        onCancel={handleCancelForm}
                      />
                    </div>
                  ) : (
                    <>
                      {/* Loading State */}
                      {loading && (
                        <div className="flex justify-center items-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                          <span className="ml-3" style={{ color: '#6B7280' }}>Loading problems...</span>
                        </div>
                      )}

                      {/* Error State */}
                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">Error loading problems</h3>
                              <div className="mt-2 text-sm text-red-700">
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
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
