import { User } from '../models/User';
import { generateToken, generateRandomToken, hashToken } from '../utils/token';
import { EmailService } from './emailService';
import { CustomError } from '../middleware/errorMiddleware';

export class AuthService {
  public static async register(data: { name: string; email: string; password: string }) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      const error: CustomError = new Error('User already exists with this email address.');
      error.statusCode = 400;
      error.errors = { email: 'User already exists with this email address.' };
      throw error;
    }

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
    });

    const token = generateToken({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  public static async login(data: { email: string; password: string }) {
    const user = await User.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      const error: CustomError = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      const error: CustomError = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  public static async forgotPassword(email: string): Promise<string> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const { rawToken, hashedToken } = generateRandomToken();
      user.passwordResetToken = hashedToken;
      user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      await EmailService.sendPasswordResetEmail(user.email, rawToken);
    }

    return 'If an account exists, a password reset link has been sent.';
  }

  public static async resetPassword(data: { token: string; password: string }) {
    const hashedToken = hashToken(data.token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      const error: CustomError = new Error('Invalid or expired password reset token.');
      error.statusCode = 400;
      throw error;
    }

    user.password = data.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully. You can now log in with your new password.' };
  }
}
