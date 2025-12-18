import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    accessToken: string;
    idToken: string;
    expiresIn: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api: AxiosInstance;
  private accessToken: string | null = null;
  private idToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: environment.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Add request interceptor to automatically include accessToken for authentication
    this.api.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/login', credentials);
      
      // Store both tokens
      this.accessToken = response.data.data.accessToken;
      this.idToken = response.data.data.idToken;
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error. Please try again.');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
      this.accessToken = null;
      this.idToken = null;
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear tokens even if request fails
      this.accessToken = null;
      this.idToken = null;
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getIdToken(): string | null {
    return this.idToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Deprecated: Authorization header is now set automatically via interceptor
  setAuthorizationHeader(token: string): void {
    // No longer needed - kept for backward compatibility
  }
}
