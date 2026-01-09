import { User } from "./user.types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
}

export type UserProfileResponse = User;

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  authChecked: boolean;
}
