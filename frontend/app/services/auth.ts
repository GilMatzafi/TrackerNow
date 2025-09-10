const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Register a new user
  async register(userData: RegisterRequest): Promise<User> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  }

  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const authData = await response.json();
    
    // Store tokens in localStorage
    this.storeTokens(authData);
    
    return authData;
  }

  // Refresh access token
  async refreshToken(): Promise<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      // If refresh fails, clear tokens and redirect to login
      this.clearTokens();
      throw new Error('Token refresh failed');
    }

    const tokenData = await response.json();
    
    // Update access token
    localStorage.setItem('access_token', tokenData.access_token);
    
    return tokenData;
  }

  // Get current user info
  async getCurrentUser(): Promise<User> {
    const token = this.getAccessToken();
    
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        try {
          await this.refreshToken();
          // Retry the request with new token
          return this.getCurrentUser();
        } catch {
          this.clearTokens();
          throw new Error('Authentication failed');
        }
      }
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  // Logout user
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      try {
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    this.clearTokens();
  }

  // Token management
  private storeTokens(authData: AuthResponse): void {
    localStorage.setItem('access_token', authData.access_token);
    localStorage.setItem('refresh_token', authData.refresh_token);
    localStorage.setItem('token_type', authData.token_type);
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Get auth headers for API requests
  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Problems API methods
  async getProblems(skip = 0, limit = 100) {
    const response = await fetch(`${this.baseURL}/problems?skip=${skip}&limit=${limit}`, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch problems');
    }

    return response.json();
  }

  async getProblem(id: number) {
    const response = await fetch(`${this.baseURL}/problems/${id}`, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch problem');
    }

    return response.json();
  }

  async createProblem(problem: {
    name: string;
    topics: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Needs Revisit';
    link?: string;
    time_minutes?: number;
    notes?: string;
  }) {
    const response = await fetch(`${this.baseURL}/problems`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(problem),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create problem');
    }

    return response.json();
  }

  async updateProblem(id: number, problem: {
    name?: string;
    topics?: string[];
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    status?: 'Not Started' | 'In Progress' | 'Completed' | 'Needs Revisit';
    link?: string;
    time_minutes?: number;
    notes?: string;
  }) {
    const response = await fetch(`${this.baseURL}/problems/${id}`, {
      method: 'PUT',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(problem),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update problem');
    }

    return response.json();
  }

  async deleteProblem(id: number) {
    const response = await fetch(`${this.baseURL}/problems/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete problem');
    }

    return null; // 204 No Content
  }

  // Applications API methods
  async getApplications() {
    const response = await fetch(`${this.baseURL}/applications`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch applications');
    }

    return response.json();
  }

  async getApplication(id: number) {
    const response = await fetch(`${this.baseURL}/applications/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch application');
    }

    return response.json();
  }

  async createApplication(applicationData: any) {
    const response = await fetch(`${this.baseURL}/applications`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create application');
    }

    return response.json();
  }

  async updateApplication(id: number, applicationData: any) {
    const response = await fetch(`${this.baseURL}/applications/${id}`, {
      method: 'PUT',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update application');
    }

    return response.json();
  }

  async deleteApplication(id: number) {
    const response = await fetch(`${this.baseURL}/applications/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete application');
    }

    return null; // 204 No Content
  }
}

export const authService = new AuthService();
