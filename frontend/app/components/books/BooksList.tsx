"use client";

import { useState } from 'react';
import { Book, ResourceStatus, ResourcePriority, ResourceCategory } from '../../types/resource';

interface BooksListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

export default function BooksList({ books, onEdit, onDelete }: BooksListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<ResourcePriority | 'All'>('All');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'status' | 'date'>('date');


  const getStatusColor = (status: ResourceStatus) => {
    const colors = {
      'NOT_STARTED': 'bg-gray-100 text-gray-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'PAUSED': 'bg-yellow-100 text-yellow-800',
      'ABANDONED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: ResourcePriority) => {
    const colors = {
      'LOW': 'bg-gray-100 text-gray-800',
      'MEDIUM': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatStatus = (status: ResourceStatus) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCategory = (category: ResourceCategory) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPriority = (priority: ResourcePriority) => {
    return priority.charAt(0) + priority.slice(1).toLowerCase();
  };

  // Filter and sort books
  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'All' || book.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
      const matchesPriority = priorityFilter === 'All' || book.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });


  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ResourceStatus | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="All">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAUSED">Paused</option>
              <option value="ABANDONED">Abandoned</option>
            </select>
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ResourceCategory | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="All">All Categories</option>
              <option value="PROGRAMMING">Programming</option>
              <option value="ALGORITHMS">Algorithms</option>
              <option value="DATA_STRUCTURES">Data Structures</option>
              <option value="SYSTEM_DESIGN">System Design</option>
              <option value="DATABASE">Database</option>
              <option value="WEB_DEVELOPMENT">Web Development</option>
              <option value="MOBILE_DEVELOPMENT">Mobile Development</option>
              <option value="DEVOPS">DevOps</option>
              <option value="MACHINE_LEARNING">Machine Learning</option>
              <option value="CYBERSECURITY">Cybersecurity</option>
              <option value="SOFT_SKILLS">Soft Skills</option>
              <option value="CAREER_DEVELOPMENT">Career Development</option>
              <option value="INTERVIEW_PREP">Interview Prep</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as ResourcePriority | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="All">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'author' | 'status' | 'date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {filteredAndSortedBooks.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-4 text-lg font-medium" style={{ color: '#111827' }}>No books found</h3>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            {searchTerm || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first book.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedBooks.map((book, index) => (
            <div 
              key={book.id} 
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ color: '#111827' }}>{book.title}</h3>
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                      {formatStatus(book.status)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(book.priority)}`}>
                      {formatPriority(book.priority)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(book)}
                    className="p-2 text-gray-400 hover:text-primary transition-all duration-200 hover:scale-110 cursor-pointer"
                    title="Edit book"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(book.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-all duration-200 hover:scale-110 cursor-pointer"
                    title="Delete book"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Author and Category */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {book.author}
                  </span>
                  {book.category && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {formatCategory(book.category)}
                    </span>
                  )}
                  {book.pages && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {book.pages} pages
                    </span>
                  )}
                </div>
              </div>

              {/* Progress */}
              {book.progress_percentage !== undefined && book.progress_percentage > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: '#6B7280' }}>Progress</span>
                    <span style={{ color: '#6B7280' }}>{book.progress_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${book.progress_percentage}%` }}
                    ></div>
                  </div>
                  {book.current_page && book.total_pages && (
                    <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                      Page {book.current_page} of {book.total_pages}
                    </div>
                  )}
                </div>
              )}

              {/* Details */}
              <div className="space-y-2 text-sm" style={{ color: '#4B5563' }}>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Added {formatDate(book.created_at)}
                </div>
                {book.publication_year && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Published {book.publication_year}
                  </div>
                )}
                {book.rating && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {book.rating}/5 stars
                  </div>
                )}
                {book.purchase_url && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <a
                      href={book.purchase_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate cursor-pointer"
                    >
                      Purchase Link
                    </a>
                  </div>
                )}
              </div>

              {/* Tags */}
              {book.tags && book.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-1">
                    {book.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {book.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm line-clamp-2" style={{ color: '#4B5563' }}>{book.description}</p>
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
            <div className="text-2xl font-bold" style={{ color: '#111827' }}>{books.length}</div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Total Books</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {books.filter(book => book.status === 'IN_PROGRESS').length}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {books.filter(book => book.status === 'COMPLETED').length}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {books.filter(book => book.status === 'PAUSED').length}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Paused</div>
          </div>
        </div>
      </div>
    </div>
  );
}
