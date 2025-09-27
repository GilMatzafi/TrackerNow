"use client";

import { useState } from 'react';
import { Problem } from '../../types/problem';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { Circle, Play, CheckCircle, RotateCcw, HelpCircle } from 'lucide-react';

interface ProblemsListProps {
  problems: Problem[];
  onEdit: (problem: Problem) => void;
  onDelete: (id: number) => void;
  onAddNew: (difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'REVIEW') => void;
}

export default function ProblemsList({ problems, onEdit, onDelete, onAddNew }: ProblemsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; problem: Problem | null }>({
    isOpen: false,
    problem: null
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          header: 'bg-emerald-100'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          header: 'bg-amber-100'
        };
      case 'HARD':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          header: 'bg-red-100'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          header: 'bg-gray-100'
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_STARTED':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'NEEDS_REVISIT':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'NOT_STARTED':
        return { label: 'Not Started', icon: Circle, color: 'text-gray-600', bgColor: 'bg-gray-50' };
      case 'IN_PROGRESS':
        return { label: 'In Progress', icon: Play, color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'COMPLETED':
        return { label: 'Completed', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'NEEDS_REVISIT':
        return { label: 'Needs Revisit', icon: RotateCcw, color: 'text-orange-600', bgColor: 'bg-orange-50' };
      default:
        return { label: 'Unknown', icon: HelpCircle, color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteClick = (problem: Problem) => {
    setDeleteDialog({ isOpen: true, problem });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.problem) {
      onDelete(deleteDialog.problem.id);
      setDeleteDialog({ isOpen: false, problem: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, problem: null });
  };

  // Filter problems based on search term
  const filteredProblems = problems.filter(problem => {
      const matchesSearch = problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Group problems by difficulty and status
  const easyProblems = filteredProblems.filter(p => p.difficulty === 'EASY');
  const mediumProblems = filteredProblems.filter(p => p.difficulty === 'MEDIUM');
  const hardProblems = filteredProblems.filter(p => p.difficulty === 'HARD');
  const reviewProblems = filteredProblems.filter(p => p.status === 'NEEDS_REVISIT');

  // Helper function to group problems by status within a difficulty
  const groupProblemsByStatus = (problems: Problem[]) => {
    const statusGroups = {
      'NOT_STARTED': problems.filter(p => p.status === 'NOT_STARTED'),
      'IN_PROGRESS': problems.filter(p => p.status === 'IN_PROGRESS'),
      'COMPLETED': problems.filter(p => p.status === 'COMPLETED'),
      'NEEDS_REVISIT': problems.filter(p => p.status === 'NEEDS_REVISIT')
    };
    return statusGroups;
  };

  const columns = [
    { 
      title: 'Easy', 
      problems: easyProblems, 
      difficulty: 'EASY' as const,
      count: easyProblems.length,
      addText: 'Add Easy Problem',
      statusGroups: groupProblemsByStatus(easyProblems)
    },
    { 
      title: 'Medium', 
      problems: mediumProblems, 
      difficulty: 'MEDIUM' as const,
      count: mediumProblems.length,
      addText: 'Add Medium Problem',
      statusGroups: groupProblemsByStatus(mediumProblems)
    },
    { 
      title: 'Hard', 
      problems: hardProblems, 
      difficulty: 'HARD' as const,
      count: hardProblems.length,
      addText: 'Add Hard Problem',
      statusGroups: groupProblemsByStatus(hardProblems)
    },
    { 
      title: 'Review', 
      problems: reviewProblems, 
      difficulty: 'REVIEW' as const,
      count: reviewProblems.length,
      addText: 'Add Review Problem',
      statusGroups: groupProblemsByStatus(reviewProblems)
    }
  ];

  const renderProblemCard = (problem: Problem) => {
    const difficultyColors = getDifficultyColor(problem.difficulty);
    
    return (
            <div 
              key={problem.id} 
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105 group mb-6 min-h-[280px]"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {problem.name}
          </h3>
          <div className="flex space-x-2 ml-3">
                  <button
                    onClick={() => onEdit(problem)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Edit problem"
                  >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(problem)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Delete problem"
                  >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>


              {/* Topics */}
              {problem.topics.length > 0 && (
                <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {problem.topics.slice(0, 3).map((topic, index) => (
                      <span
                        key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-base font-medium bg-gray-100 text-gray-700"
                      >
                        {topic}
                      </span>
                    ))}
              {problem.topics.length > 3 && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-md text-base font-medium bg-gray-100 text-gray-700">
                  +{problem.topics.length - 3}
                </span>
              )}
                  </div>
                </div>
              )}

              {/* Details */}
        <div className="space-y-3 text-lg text-gray-600">
                <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
            <span className="font-semibold text-lg">{formatDate(problem.created_at)}</span>
                </div>
                {problem.time_minutes && (
                  <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
              <span className="font-semibold text-lg">{problem.time_minutes} min</span>
                  </div>
                )}
                {problem.link && (
                  <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-lg transition-colors duration-200 truncate"
                    >
                      View Problem
                    </a>
                  </div>
                )}
              </div>

              {/* Notes */}
              {problem.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-lg text-gray-600 line-clamp-2 leading-relaxed">{problem.notes}</p>
                </div>
              )}
            </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* Kanban Board */}
      <div className="flex justify-center px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-130 w-full max-w-[2400px]">
        {columns.map((column) => {
          const colors = getDifficultyColor(column.difficulty);
          
          return (
            <div key={column.title} className="bg-white rounded-xl shadow-sm border border-gray-200 min-w-[500px] w-full">
              {/* Column Header */}
              <div className={`${colors.header} px-12 py-10 rounded-t-xl border-b border-gray-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-4xl font-bold text-gray-900">
                      {column.title} <span className="text-gray-500 font-normal ml-3 text-2xl">{column.count}</span>
                    </h3>
                  </div>
                  <button 
                    onClick={() => onAddNew(column.difficulty)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 cursor-pointer group"
                    title={`Add new ${column.title.toLowerCase()} problem`}
                  >
                    <svg className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>


              {/* Problems List */}
              <div className="p-10 min-h-[1000px]">
                {column.problems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No {column.title.toLowerCase()} problems</p>
        </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(column.statusGroups).map(([status, problems]) => {
                      if (problems.length === 0) return null;
                      
                      const statusInfo = getStatusInfo(status);
                      
                      return (
                        <div key={status} className="space-y-4">
                          {/* Status Header */}
                          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg ${statusInfo.bgColor}`}>
                            {(() => {
                              const IconComponent = statusInfo.icon;
                              return IconComponent ? <IconComponent className={`w-5 h-5 ${statusInfo.color}`} /> : null;
                            })()}
                            <span className={`font-semibold text-sm ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                            <span className={`text-xs ${statusInfo.color} bg-white/50 px-2 py-1 rounded-full`}>
                              {problems.length}
                            </span>
                          </div>
                          
                          {/* Problems in this status */}
                          <div className="space-y-4">
                            {problems.map(renderProblemCard)}
                          </div>
                        </div>
                      );
                    })}
            </div>
                )}
          </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        problemName={deleteDialog.problem?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}