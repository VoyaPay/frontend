import { logoutApi } from './auth';

export const fetchWrapper = async (
  url: string,
  options: RequestInit = {},
  token: string | null,
) => {

  const API_URL = 'http://localhost:3333';

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Merge the headers from options and defaultHeaders
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    // Logout user if 401 or 403 response returned from api
    logoutApi();
    return Promise.reject(new Error('Unauthorized'));
  }

  if (!response.ok) {
    const error = await response.json();
    return Promise.reject(error);
  }

  return response.json();
};
