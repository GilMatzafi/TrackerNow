import { useState, useEffect } from 'react';
import { Book } from '../types/resource';
import { authService } from '../services/auth';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.getBooks();
        setBooks(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const addBook = async (bookData: Omit<Book, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newBook = await authService.createBook({
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn,
        total_pages: bookData.pages,
        current_page: bookData.current_page,
        status: bookData.status,
        priority: bookData.priority,
        category: bookData.category,
        rating: bookData.rating,
        purchase_link: bookData.purchase_link,
        description: bookData.description,
        tags: bookData.tags,
        publication_year: bookData.publication_year,
      });
      
      setBooks(prev => [...prev, newBook]);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to add book');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: number, bookData: Partial<Omit<Book, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBook = await authService.updateBook(id, {
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn,
        total_pages: bookData.pages,
        current_page: bookData.current_page,
        status: bookData.status,
        priority: bookData.priority,
        category: bookData.category,
        rating: bookData.rating,
        purchase_link: bookData.purchase_link,
        description: bookData.description,
        tags: bookData.tags,
        publication_year: bookData.publication_year,
      });
      
      setBooks(prev => prev.map(book => book.id === id ? updatedBook : book));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update book');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await authService.deleteBook(id);
      setBooks(prev => prev.filter(book => book.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete book');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { 
    books, 
    loading, 
    error, 
    addBook, 
    updateBook, 
    deleteBook 
  };
};