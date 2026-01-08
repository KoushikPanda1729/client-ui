import { apiService } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { User, UpdateUserPayload } from "@/types/user.types";
import { PaginatedResponse, QueryParams } from "@/types/api.types";

class UserService {
  async getUsers(params?: QueryParams): Promise<PaginatedResponse<User>> {
    return apiService.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS.LIST, {
      params,
    });
  }

  async getUserById(id: string): Promise<User> {
    return apiService.get<User>(API_ENDPOINTS.USERS.DETAIL(id));
  }

  async updateUser(payload: UpdateUserPayload): Promise<User> {
    const { id, ...data } = payload;
    return apiService.put<User>(API_ENDPOINTS.USERS.UPDATE(id), data);
  }

  async deleteUser(id: string): Promise<void> {
    return apiService.delete<void>(API_ENDPOINTS.USERS.DELETE(id));
  }
}

export const userService = new UserService();
