"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { SidebarProvider } from '../contexts/SidebarContext';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import ProblemsList from '../components/problems/ProblemsList';
import ProblemForm from '../components/problems/ProblemForm';
import { Problem } from '../types/problem';

export default function ProblemsPage() {
  const { user, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  // Mock data - will be replaced with API calls later
  const [problems, setProblems] = useState<Problem[]>([
    {
      id: 1,
      name: "Two Sum",
      topics: ["Arrays", "Hash Table"],
      difficulty: "Easy",
      link: "https://leetcode.com/problems/two-sum/",
      time_minutes: 15,
      notes: "Classic hash table problem. Good for beginners.",
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Binary Tree Inorder Traversal",
      topics: ["Tree", "Stack", "Depth-First Search"],
      difficulty: "Medium",
      link: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      time_minutes: 25,
      notes: "Practice recursive and iterative approaches.",
      created_at: "2024-01-18T14:45:00Z"
    },
    {
      id: 3,
      name: "Maximum Subarray",
      topics: ["Array", "Dynamic Programming"],
      difficulty: "Medium",
      link: "https://leetcode.com/problems/maximum-subarray/",
      time_minutes: 30,
      notes: "Kadane's algorithm. Important DP problem.",
      created_at: "2024-01-20T09:15:00Z"
    }
  ]);

  const handleAddProblem = (problem: Omit<Problem, 'id'>) => {
    const newProblem: Problem = {
      ...problem,
      id: Math.max(...problems.map(p => p.id), 0) + 1,
      created_at: new Date().toISOString()
    };
    setProblems([...problems, newProblem]);
    setShowForm(false);
  };

  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    setShowForm(true);
  };

  const handleUpdateProblem = (updatedProblem: Problem) => {
    setProblems(problems.map(p => 
      p.id === updatedProblem.id ? updatedProblem : p
    ));
    setShowForm(false);
    setEditingProblem(null);
  };

  const handleDeleteProblem = (id: number) => {
    setProblems(problems.filter(p => p.id !== id));
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
                <div className="max-w-7xl mx-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Problems</h1>
                      <p className="text-gray-600 mt-2">
                        Manage your coding interview problems and track your progress
                      </p>
                    </div>
                    <button
                      onClick={() => setShowForm(true)}
                      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      Add Problem
                    </button>
                  </div>

                  {/* Content */}
                  {showForm ? (
                    <ProblemForm
                      problem={editingProblem}
                      onSubmit={editingProblem ? handleUpdateProblem : handleAddProblem}
                      onCancel={handleCancelForm}
                    />
                  ) : (
                    <ProblemsList
                      problems={problems}
                      onEdit={handleEditProblem}
                      onDelete={handleDeleteProblem}
                    />
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
