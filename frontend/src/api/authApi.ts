import { ApiClient } from './apiClient';
import { AuthResponse } from '../types';

export class AuthApi {
  public static async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/auth/register', data);
  }

  public static async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/auth/login', data);
  }

  public static async logout(): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>('/auth/logout');
  }

  public static async forgotPassword(email: string): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>('/auth/forgot-password', { email });
  }

  public static async resetPassword(data: { token: string; password: string }): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>('/auth/reset-password', data);
  }
}
