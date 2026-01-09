export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "admin" | "manager";
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateUserPayload {
  id: number;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}
