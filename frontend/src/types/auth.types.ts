export interface User {
  id: number;
  name: string;
  email: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

export type RegisterFormData = {
  email: string;
  password: string;
};

export interface RegisterAuthFormType {
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  errors: SetErrors;
  setErrors: React.Dispatch<React.SetStateAction<SetErrors>>;
}

export type LoginFormData = { email: string; password: string };

export interface LoginAuthFormType {
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: LoginFormData;
  setFormData: React.Dispatch<React.SetStateAction<LoginFormData>>;
  errors: SetErrors;
  setErrors: React.Dispatch<React.SetStateAction<SetErrors>>;
}

export interface SetErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}
