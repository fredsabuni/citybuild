'use client';

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create(API_CONFIG);

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      try {
        // Clear old tokens first to free up space
        this.clearTokens();
        
        // Set new tokens
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
      } catch (error) {
        console.error('Failed to store tokens in localStorage:', error);
        // If quota exceeded, clear all localStorage and try again
        if (error instanceof Error && (error.name === 'QuotaExceededError' || error.message.includes('quota'))) {
          console.warn('localStorage quota exceeded, clearing all storage...');
          localStorage.clear();
          try {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
          } catch (retryError) {
            console.error('Failed to store tokens even after clearing localStorage:', retryError);
            // If still failing, try storing only essential data
            try {
              // Store minimal data - just access token for now
              localStorage.setItem('access_token', accessToken);
              console.warn('Stored only access token due to storage constraints');
            } catch (minimalError) {
              console.error('Failed to store even minimal token data:', minimalError);
              throw new Error('Unable to store authentication tokens. Please clear your browser cache and try again.');
            }
          }
        } else {
          throw error;
        }
      }
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      // Clear auth-related tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('expires_in');
      
      // Also clear any legacy auth keys that might exist
      localStorage.removeItem('citybuild_auth_token');
      localStorage.removeItem('citybuild_current_user');
    }
  }

  // Get stored tokens for accessing from components
  getStoredTokens() {
    if (typeof window === 'undefined') return null;
    return {
      accessToken: localStorage.getItem('access_token'),
      refreshToken: localStorage.getItem('refresh_token'),
      tokenType: localStorage.getItem('token_type'),
      expiresIn: localStorage.getItem('expires_in'),
    };
  }

  // Generic HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  // File upload
  async uploadFile<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    };

    return this.post<T>(url, formData, config);
  }

  // Auth specific methods
  async login(email: string, password: string): Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const response = await this.post<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
    }>('/v1/auth/login', { email, password });
    
    // Store tokens in localStorage
    this.setTokens(response.access_token, response.refresh_token);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token_type', response.token_type);
        localStorage.setItem('expires_in', response.expires_in.toString());
      }
    } catch (error) {
      console.error('Failed to store token metadata:', error);
      // Non-critical, tokens are already stored
    }
    
    return response;
  }

  // Get current user details
  async getCurrentUser(): Promise<any> {
    return await this.get('/v1/auth/me');
  }

  async register(userData: any): Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const response = await this.post<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
    }>('/v1/auth/register', userData);
    
    // Store tokens in localStorage
    this.setTokens(response.access_token, response.refresh_token);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token_type', response.token_type);
        localStorage.setItem('expires_in', response.expires_in.toString());
      }
    } catch (error) {
      console.error('Failed to store token metadata:', error);
      // Non-critical, tokens are already stored
    }
    
    return response;
  }

  // Create organization
  async createOrganization(organizationData: {
    name: string;
    type: string;
    registration_number: string;
    country: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  }): Promise<any> {
    return await this.post('/v1/organizations/', organizationData);
  }

  // Create user
  async createUser(userData: {
    organization_id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
  }): Promise<any> {
    // This endpoint creates a user but doesn't return tokens
    // We'll need to login separately after user creation
    return await this.post('/v1/users/', userData);
  }

  // Complete registration (organization + user in one call)
  async registerComplete(registrationData: {
    organization_name: string;
    organization_type: string;
    registration_number: string;
    country: string;
    address: string;
    organization_phone: string;
    organization_email: string;
    website?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
  }): Promise<any> {
    const response = await this.post('/v1/registration/register', registrationData);
    
    // Store tokens if they exist in the response
    if (response.access_token && response.refresh_token) {
      this.setTokens(response.access_token, response.refresh_token);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token_type', response.token_type || 'bearer');
          localStorage.setItem('expires_in', response.expires_in?.toString() || '1800');
        }
      } catch (error) {
        console.error('Failed to store token metadata:', error);
        // Non-critical, tokens are already stored
      }
    }
    
    return response;
  }

  async logout(): Promise<void> {
    this.clearTokens();
    try {
      await this.post('/v1/auth/logout');
    } catch (error) {
      // Ignore errors on logout
    }
  }

  async refreshToken(): Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await this.post<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
    }>('/v1/auth/refresh', { refresh_token: refreshToken });
    
    // Update tokens
    this.setTokens(response.access_token, response.refresh_token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token_type', response.token_type);
      localStorage.setItem('expires_in', response.expires_in.toString());
    }
    
    return response;
  }

  // Update base URL dynamically (useful for testing or switching environments)
  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }

  // Get current base URL
  getBaseURL(): string {
    return this.client.defaults.baseURL || '';
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export the class for testing or creating multiple instances
export default ApiClient;
