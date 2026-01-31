// src/services/apiService.ts

import {
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  LoginRequest,
  LoginResponse,
  ApiError,
} from '../config/apiConfig';

class ApiService {
  // Generic API call method
  private async makeRequest<T>(
    url: string,
    method: string = 'GET',
    body?: any,
    headers?: any,
  ): Promise<T> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          ...DEFAULT_HEADERS,
          ...headers,
        },
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Network request failed',
          status: response.status,
          data: errorData,
        } as ApiError;
      }

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      // Handle network errors
      if (error.message === 'Network request failed' || !error.status) {
        throw {
          message:
            'Unable to connect to server. Please check your internet connection.',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  // Login API
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      'POST',
      credentials,
    );
  }
}

export default new ApiService();
