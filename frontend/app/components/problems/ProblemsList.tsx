"use client";

import { useState } from 'react';
import { Problem } from '../../types/problem';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface ProblemsListProps {
  problems: Problem[];
  onEdit: (problem: Problem) => void;
  onDelete: (id: number) => void;
}

export default function ProblemsList({ problems, onEdit, onDelete }: ProblemsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'time' | 'date'>('name');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; problem: Problem | null }>({
    isOpen: false,
    problem: null
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Needs Revisit':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const filteredAndSortedProblems = problems
    .filter(problem => {
      const matchesSearch = problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === 'all' || problem.status === statusFilter;
      return matchesSearch && matchesDifficulty && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'time':
          return (a.time_minutes || 0) - (b.time_minutes || 0);
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-slide-in-top">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search problems or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ color: '#111827' }}
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            style={{ color: '#111827' }}
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            style={{ color: '#111827' }}
          >
            <option value="all">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Needs Revisit">Needs Revisit</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'difficulty' | 'time' | 'date')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            style={{ color: '#111827' }}
          >
            <option value="name">Sort by Name</option>
            <option value="difficulty">Sort by Difficulty</option>
            <option value="time">Sort by Time</option>
            <option value="date">Sort by Date Created</option>
          </select>
        </div>
      </div>

      {/* Problems Grid */}
      {filteredAndSortedProblems.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium" style={{ color: '#111827' }}>No problems found</h3>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            {searchTerm || difficultyFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first coding problem.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProblems.map((problem, index) => (
            <div 
              key={problem.id} 
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ color: '#111827' }}>{problem.name}</h3>
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(problem.status)}`}>
                      {problem.status}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(problem)}
                    className="p-2 text-gray-400 hover:text-primary transition-all duration-200 hover:scale-110 cursor-pointer"
                    title="Edit problem"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(problem)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-all duration-200 hover:scale-110 cursor-pointer"
                    title="Delete problem"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Topics */}
              {problem.topics.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {problem.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-2 text-sm" style={{ color: '#4B5563' }}>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Created {formatDate(problem.created_at)}
                </div>
                {problem.time_minutes && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {problem.time_minutes} minutes
                  </div>
                )}
                {problem.link && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate cursor-pointer"
                    >
                      View Problem
                    </a>
                  </div>
                )}
              </div>

              {/* Notes */}
              {problem.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm line-clamp-2" style={{ color: '#4B5563' }}>{problem.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-slide-in-bottom">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#111827' }}>{problems.length}</div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Total Problems</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {problems.filter(p => p.difficulty === 'Easy').length}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Easy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {problems.filter(p => p.difficulty === 'Medium').length}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Medium</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {problems.filter(p => p.difficulty === 'Hard').length}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Hard</div>
          </div>
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
