export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateUserPayload {
  id: string;
  name?: string;
  avatar?: string;
}
