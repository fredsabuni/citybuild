'use client';

let authModalCallback: ((show: boolean) => void) | null = null;

export function setAuthModalCallback(callback: (show: boolean) => void) {
  authModalCallback = callback;
}

// API base URL - adjust this to match your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get token from localStorage
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  };

  // Construct full URL with base URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  // Add authorization header if token exists
  const token = getToken();
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Don't set Content-Type for FormData - browser will set it automatically with boundary
  // Remove Content-Type if body is FormData to let browser handle it
  if (options.body instanceof FormData) {
    headers.delete('Content-Type');
  }

  // Make the request
  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    // Try to refresh token
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token') 
      : null;

    if (refreshToken) {
      try {
        // Attempt token refresh
        const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
          const { access_token, refresh_token: newRefreshToken } = await refreshResponse.json();
          
          // Store new tokens
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', access_token);
            if (newRefreshToken) {
              localStorage.setItem('refresh_token', newRefreshToken);
            }
          }

          // Retry original request with new token
          headers.set('Authorization', `Bearer ${access_token}`);
          return fetch(fullUrl, {
            ...options,
            headers,
          });
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }

    // If refresh failed or no refresh token, clear tokens and show auth modal
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }

    // Trigger auth modal
    if (authModalCallback) {
      authModalCallback(true);
    }

    // Return the 401 response
    return response;
  }

  return response;
}
