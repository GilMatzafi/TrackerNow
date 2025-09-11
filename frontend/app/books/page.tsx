"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../hooks/useBooks';
import ProtectedRoute from '../components/ProtectedRoute';
import TopNavbar from '../components/dashboard/TopNavbar';
import BooksList from '../components/books/BooksList';
import BookForm from '../components/books/BookForm';
import { Book } from '../types/resource';

export default function BooksPage() {
  const { user, logout } = useAuth();
  const { books, loading, error, addBook, updateBook, deleteBook } = useBooks();
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);



  const handleAddBook = async (book: Omit<Book, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const success = await addBook(book);
    if (success) {
      setShowForm(false);
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    const { id, ...updateData } = updatedBook;
    const success = await updateBook(id, updateData);
    if (success) {
      setShowForm(false);
      setEditingBook(null);
    }
  };

  const handleDeleteBook = async (id: number) => {
    await deleteBook(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{background: 'linear-gradient(90deg, #EDEDED 0%, #FDF5D6 100%)'}}>
        <TopNavbar user={user} onLogout={logout} />
        <main className="py-8">
          <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold" style={{ color: '#111827' }}>Books</h1>
                      <p className="mt-2" style={{ color: '#6B7280' }}>
                        Track your reading progress and manage your book collection
                      </p>
                    </div>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-all duration-200 hover:scale-105 cursor-pointer"
                      style={{ 
                        backgroundColor: '#000000',
                        border: '2px solid #000000'
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
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Book
                    </button>
                  </div>
                </div>

                {/* Content */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2" style={{ color: '#6B7280' }}>Loading books...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading books</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : showForm ? (
                  <BookForm
                    book={editingBook}
                    onSubmit={editingBook ? handleUpdateBook : handleAddBook}
                    onCancel={handleCancelForm}
                  />
                ) : (
                  <BooksList
                    books={books}
                    onEdit={handleEditBook}
                    onDelete={handleDeleteBook}
                  />
                )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
