'use client';

let authModalCallback: ((show: boolean) => void) | null = null;

export function setAuthModalCallback(callback: (show: boolean) => void) {
  authModalCallback = callback;
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get token from localStorage
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  };

  // Add authorization header if token exists
  const token = getToken();
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Make the request
  const response = await fetch(url, {
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
        const refreshResponse = await fetch('/api/v1/auth/refresh', {
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
          return fetch(url, {
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
