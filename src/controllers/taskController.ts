import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { TaskService } from '../services/taskService';
import { validateCreateTaskInput, validateUpdateTaskInput } from '../validators/taskValidator';

export class TaskController {
  public static async getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.user!.id;
      const tasks = await TaskService.getTasksForUser(userId);
      return res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  public static async getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.user!.id;
      const taskId = req.params.id;
      const task = await TaskService.getTaskById(taskId, userId);
      return res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  public static async createTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const validation = validateCreateTaskInput(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.errors,
        });
      }

      const userId = req.user!.id;
      const task = await TaskService.createTask(userId, {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed ?? req.body.done,
      });

      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  public static async updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const validation = validateUpdateTaskInput(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.errors,
        });
      }

      const userId = req.user!.id;
      const taskId = req.params.id;
      const updatedTask = await TaskService.updateTask(taskId, userId, {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
        done: req.body.done,
      });

      return res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.user!.id;
      const taskId = req.params.id;
      const result = await TaskService.deleteTask(taskId, userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
