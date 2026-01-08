import { User } from "@/types/user.types";

export const mockUser: User = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  role: "user",
  createdAt: new Date().toISOString(),
};

export const mockAuthResponse = {
  user: mockUser,
  message: "Login successful",
};

export const mockUsers: User[] = [
  mockUser,
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
];
