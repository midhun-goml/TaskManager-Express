import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
} from '../validators/authValidator';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const validation = validateRegisterInput(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.errors,
        });
      }

      const result = await AuthService.register({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      return res.status(201).json({
        message: 'User registered successfully',
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const validation = validateLoginInput(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.errors,
        });
      }

      const result = await AuthService.login({
        email: req.body.email || req.body.username,
        password: req.body.password,
      });

      return res.status(200).json({
        message: 'Login successful',
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async logout(_req: Request, res: Response): Promise<Response> {
    // Clear cookie if cookies were set, return explicit success confirmation
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const validation = validateForgotPasswordInput(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.errors,
        });
      }

      const message = await AuthService.forgotPassword(req.body.email);
      return res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const validation = validateResetPasswordInput(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.errors,
        });
      }

      const result = await AuthService.resetPassword({
        token: req.body.token,
        password: req.body.password,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
