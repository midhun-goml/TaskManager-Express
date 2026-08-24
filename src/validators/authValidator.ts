export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateRegisterInput = (data: Record<string, unknown>): ValidationResult => {
  const errors: Record<string, string> = {};
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const password = typeof data.password === 'string' ? data.password : '';

  if (!name) {
    errors.name = 'Name is required';
  }

  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginInput = (data: Record<string, unknown>): ValidationResult => {
  const errors: Record<string, string> = {};
  const email = typeof data.email === 'string' ? data.email.trim() : (typeof data.username === 'string' ? data.username.trim() : '');
  const password = typeof data.password === 'string' ? data.password : '';

  if (!email) {
    errors.email = 'Email or username is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateForgotPasswordInput = (data: Record<string, unknown>): ValidationResult => {
  const errors: Record<string, string> = {};
  const email = typeof data.email === 'string' ? data.email.trim() : '';

  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Please provide a valid email address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateResetPasswordInput = (data: Record<string, unknown>): ValidationResult => {
  const errors: Record<string, string> = {};
  const token = typeof data.token === 'string' ? data.token.trim() : '';
  const password = typeof data.password === 'string' ? data.password : '';

  if (!token) {
    errors.token = 'Reset token is required';
  }

  if (!password) {
    errors.password = 'New password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
