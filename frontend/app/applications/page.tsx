"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../hooks/useApplications';
import ProtectedRoute from '../components/ProtectedRoute';
import { SidebarProvider } from '../contexts/SidebarContext';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import ApplicationsList from '../components/applications/ApplicationsList';
import ApplicationForm from '../components/applications/ApplicationForm';
import { Application, ApplicationFormData } from '../types/application';


export default function ApplicationsPage() {
  const { user, logout } = useAuth();
  const { applications, loading, error, addApplication, updateApplication, deleteApplication } = useApplications();
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);

  const handleAddApplication = async (application: Omit<Application, 'id'>) => {
    const success = await addApplication(application);
    if (success) {
      setShowForm(false);
    }
  };

  const handleEditApplication = (application: Application) => {
    setEditingApplication(application);
    setShowForm(true);
  };

  const handleUpdateApplication = async (updatedApplication: Application) => {
    const { id, ...updateData } = updatedApplication;
    const success = await updateApplication(id, updateData);
    if (success) {
      setShowForm(false);
      setEditingApplication(null);
    }
  };

  const handleDeleteApplication = async (id: number) => {
    await deleteApplication(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingApplication(null);
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <div className="lg:pl-64">
            <Header user={user} onLogout={logout} />
            <main className="py-8">
              <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                    <div className="animate-slide-in-left">
                      <h1 className="text-3xl font-bold" style={{ color: '#111827' }}>Applications</h1>
                      <p className="mt-2" style={{ color: '#4B5563' }}>
                        Track and manage your job applications, interview stages, and contact information
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
                      Add Application
                    </button>
                  </div>

                  {/* Content */}
                  {showForm ? (
                    <div className="animate-fade-in-up">
                      <ApplicationForm
                        application={editingApplication}
                        onSubmit={editingApplication ? handleUpdateApplication : handleAddApplication}
                        onCancel={handleCancelForm}
                      />
                    </div>
                  ) : (
                    <>
                      {/* Loading State */}
                      {loading && (
                        <div className="flex justify-center items-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                          <span className="ml-3" style={{ color: '#6B7280' }}>Loading applications...</span>
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
                              <h3 className="text-sm font-medium text-red-800">Error loading applications</h3>
                              <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Applications List */}
                      {!loading && !error && (
                        <div className="animate-fade-in-up">
                          <ApplicationsList
                            applications={applications}
                            onEdit={handleEditApplication}
                            onDelete={handleDeleteApplication}
                          />
                        </div>
                      )}
                    </>
                  )}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
