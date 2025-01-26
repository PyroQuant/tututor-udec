export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm extends LoginForm {
  confirmPassword: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const isUdecEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._-]+@udec\.cl$/.test(email);
};