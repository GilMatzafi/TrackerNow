import { ApiService } from '../base/ApiService';
import { Book } from '../../types/resource';

// For now, we'll use the existing Book interface from resource.ts
// and create a simplified form data interface for the API
export interface BookFormData {
  title: string;
  author: string;
  isbn?: string;
  total_pages: number;
  current_page: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'PROGRAMMING' | 'SYSTEM_DESIGN' | 'ALGORITHMS' | 'DATABASE' | 'NETWORKING' | 'SECURITY' | 'SOFTWARE_ENGINEERING' | 'OTHER';
  rating?: number;
  purchase_link?: string;
  description?: string;
  tags?: string[];
  publication_year?: number;
}

export interface BookStats {
  total_books: number;
  completed_books: number;
  in_progress_books: number;
  total_pages_read: number;
  average_rating: number;
}

class BooksService extends ApiService {
  // Get all books
  async getBooks(): Promise<Book[]> {
    return this.get<Book[]>('/books/');
  }

  // Get a specific book
  async getBook(id: number): Promise<Book> {
    return this.get<Book>(`/books/${id}/`);
  }

  // Create a new book
  async createBook(bookData: BookFormData): Promise<Book> {
    return this.post<Book>('/books/', bookData);
  }

  // Update a book
  async updateBook(id: number, bookData: Partial<BookFormData>): Promise<Book> {
    return this.put<Book>(`/books/${id}/`, bookData);
  }

  // Delete a book
  async deleteBook(id: number): Promise<void> {
    return this.delete<void>(`/books/${id}/`);
  }

  // Get books statistics
  async getBooksStats(): Promise<BookStats> {
    return this.get<BookStats>('/books/stats/');
  }
}

export const booksService = new BooksService();
