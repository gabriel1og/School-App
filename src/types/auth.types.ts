export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: 'admin' | 'teacher';
  school_id: string;
  address?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  user_type: 'admin' | 'teacher';
  school_id: string;
  address?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}
