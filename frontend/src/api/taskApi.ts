import { ApiClient } from './apiClient';
import { Task } from '../types';

export class TaskApi {
  public static async getTasks(): Promise<Task[]> {
    return ApiClient.get<Task[]>('/tasks');
  }

  public static async getTaskById(id: string): Promise<Task> {
    return ApiClient.get<Task>(`/tasks/${id}`);
  }

  public static async createTask(data: { title: string; description?: string; completed?: boolean }): Promise<Task> {
    return ApiClient.post<Task>('/tasks', data);
  }

  public static async updateTask(id: string, data: { title?: string; description?: string; completed?: boolean }): Promise<Task> {
    return ApiClient.put<Task>(`/tasks/${id}`, data);
  }

  public static async deleteTask(id: string): Promise<{ message: string }> {
    return ApiClient.delete<{ message: string }>(`/tasks/${id}`);
  }
}
