import { jwtDecode } from 'jwt-decode';
import { fetchWrapper } from './fetch.wrapper';

export interface LoginResponse {
  access_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MeInfo {
  id: number;
  email: string;
  createdAt: string;
  fullName: string;
  lastLogin: string;
  sessionExpiration: Date;
}

export interface TokenDetails {
  token: string;
  exp: number;
  sub: string;
  iat: number;
}

const API_URL = 'http://localhost:3333';

export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data: LoginResponse = await response.json();
  localStorage.setItem('authToken', data.access_token);
  return data;
};

export const logoutApi = (): void => {
  localStorage.removeItem('authToken');
  window.location.href = './login';
};

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeToken = (): void => {
  localStorage.removeItem('authToken');
}

export const getMe = async (): Promise<MeInfo> => {
  const token = getToken();
  const tokenDetails = getTokenDetails(token);

  // check if token is expired
  if (tokenDetails && tokenDetails.exp < Date.now() / 1000) {
    window.location.href = './login';
    removeToken();
    return Promise.reject(new Error('Token expired'));
  }

  if (!token) {
    window.location.href = './login';
    removeToken();
    return Promise.reject(new Error('No token available'));
  }

  const response = await fetchWrapper(`/auth/me`, {}, token);
  return {
    ...response,
    sessionExpiration: new Date(tokenDetails!.exp * 1000)
  }
};

export const getTokenDetails = (token: string|null): TokenDetails| null => {
  if (!token) return null;

  const decodedToken = jwtDecode(token);
  return {
    token,
    exp: decodedToken.exp!,
    sub: decodedToken.sub!,
    iat: decodedToken.iat!,
  }
};
