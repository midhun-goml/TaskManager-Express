import { Task } from '../models/Task';
import { CustomError } from '../middleware/errorMiddleware';

export class TaskService {
  public static async getTasksForUser(userId: string) {
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    return tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description || '',
      completed: task.completed,
      userId: task.user.toString(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  }

  public static async getTaskById(taskId: string, userId: string) {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      const error: CustomError = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description || '',
      completed: task.completed,
      userId: task.user.toString(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  public static async createTask(userId: string, data: { title: string; description?: string; completed?: boolean }) {
    const task = await Task.create({
      title: data.title,
      description: data.description || '',
      completed: data.completed ?? false,
      user: userId,
    });

    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description || '',
      completed: task.completed,
      userId: task.user.toString(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  public static async updateTask(
    taskId: string,
    userId: string,
    data: { title?: string; description?: string; completed?: boolean; done?: boolean }
  ) {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      const error: CustomError = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (data.title !== undefined) {
      task.title = data.title;
    }
    if (data.description !== undefined) {
      task.description = data.description;
    }
    if (data.completed !== undefined) {
      task.completed = data.completed;
    } else if (data.done !== undefined) {
      task.completed = data.done;
    }

    await task.save();

    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description || '',
      completed: task.completed,
      userId: task.user.toString(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  public static async deleteTask(taskId: string, userId: string) {
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) {
      const error: CustomError = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Task deleted successfully' };
  }
}
