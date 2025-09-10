"use client";

import { useState, useEffect } from 'react';
import { Book, BookFormData, ResourceStatus, ResourcePriority, ResourceCategory } from '../../types/resource';

interface BookFormProps {
  book?: Book | null;
  onSubmit: (book: Omit<Book, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export default function BookForm({ book, onSubmit, onCancel }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publication_year: undefined,
    pages: undefined,
    category: undefined,
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    current_page: undefined,
    total_pages: undefined,
    progress_percentage: undefined,
    start_date: '',
    completion_date: '',
    description: '',
    notes: '',
    rating: undefined,
    tags: [],
    purchase_url: '',
    cover_image_url: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        publication_year: book.publication_year,
        pages: book.pages,
        category: book.category,
        status: book.status,
        priority: book.priority,
        current_page: book.current_page,
        total_pages: book.total_pages,
        progress_percentage: book.progress_percentage,
        start_date: book.start_date || '',
        completion_date: book.completion_date || '',
        description: book.description || '',
        notes: book.notes || '',
        rating: book.rating,
        tags: book.tags || [],
        purchase_url: book.purchase_url || '',
        cover_image_url: book.cover_image_url || ''
      });
    }
  }, [book]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publication_year' || name === 'pages' || name === 'current_page' || name === 'total_pages' || name === 'rating'
        ? value ? parseInt(value) : undefined
        : name === 'progress_percentage'
        ? value ? parseFloat(value) : undefined
        : value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-scale-in">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#111827' }}>
        {book ? 'Edit Book' : 'Add New Book'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="Enter author name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="978-0132350884"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Publisher
            </label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="Prentice Hall"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Publication Year
            </label>
            <input
              type="number"
              name="publication_year"
              value={formData.publication_year || ''}
              onChange={handleInputChange}
              min="1000"
              max={new Date().getFullYear() + 1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="2008"
            />
          </div>
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            >
              <option value="">Select Category</option>
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
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAUSED">Paused</option>
              <option value="ABANDONED">Abandoned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Total Pages
            </label>
            <input
              type="number"
              name="total_pages"
              value={formData.total_pages || ''}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="464"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Current Page
            </label>
            <input
              type="number"
              name="current_page"
              value={formData.current_page || ''}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Progress (%)
            </label>
            <input
              type="number"
              name="progress_percentage"
              value={formData.progress_percentage || ''}
              onChange={handleInputChange}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="32.3"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Completion Date
            </label>
            <input
              type="date"
              name="completion_date"
              value={formData.completion_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Rating (1-5 stars)
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating || ''}
            onChange={handleInputChange}
            min="1"
            max="5"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
            style={{ color: '#111827' }}
            placeholder="4.5"
          />
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Purchase URL
            </label>
            <input
              type="url"
              name="purchase_url"
              value={formData.purchase_url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="https://amazon.com/book-link"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Cover Image URL
            </label>
            <input
              type="url"
              name="cover_image_url"
              value={formData.cover_image_url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
              placeholder="https://example.com/cover.jpg"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Tags
          </label>
          <input
            type="text"
            value={formData.tags?.join(', ') || ''}
            onChange={handleTagsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
            style={{ color: '#111827' }}
            placeholder="programming, clean code, software engineering"
          />
          <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
            Separate tags with commas
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
            style={{ color: '#111827' }}
            placeholder="Brief description of the book..."
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
            style={{ color: '#111827' }}
            placeholder="Your personal notes about this book..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 cursor-pointer"
            style={{ color: '#374151' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
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
            {book ? 'Update Book' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
}
