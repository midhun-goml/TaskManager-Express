import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId | string;
  id?: string;
  name: string;
  email: string;
  password: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ITask {
  _id?: Types.ObjectId | string;
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  user: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITaskDocument extends Document {
  title: string;
  description?: string;
  completed: boolean;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
