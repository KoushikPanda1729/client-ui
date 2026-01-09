import { User } from "@/types/user.types";

export const mockUser: User = {
  id: 1,
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  role: "customer",
  createdAt: new Date().toISOString(),
};

export const mockAuthResponse = {
  id: 1,
};

export const mockUsers: User[] = [
  mockUser,
  {
    id: 2,
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
];
