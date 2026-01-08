import { apiService } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "@/types/auth.types";
import { User } from "@/types/user.types";

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, credentials);
  }

  async logout(): Promise<void> {
    return apiService.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getProfile(): Promise<User> {
    return apiService.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  }
}

export const authService = new AuthService();
