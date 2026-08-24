import { ValidationResult } from './authValidator';

export const validateCreateTaskInput = (data: Record<string, unknown>): ValidationResult => {
  const errors: Record<string, string> = {};
  const title = typeof data.title === 'string' ? data.title.trim() : '';

  if (!title) {
    errors.title = 'Task title is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateTaskInput = (data: Record<string, unknown>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (data.title !== undefined) {
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    if (!title) {
      errors.title = 'Task title cannot be empty';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
