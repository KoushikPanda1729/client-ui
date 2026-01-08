export { default as authReducer } from "./authSlice";
export { default as userReducer } from "./userSlice";

// Auth slice exports
export {
  login,
  register,
  logout,
  fetchProfile,
  clearError as clearAuthError,
  setUser,
} from "./authSlice";

// User slice exports
export {
  fetchUsers,
  fetchUserById,
  updateUser,
  deleteUser,
  clearError as clearUserError,
  clearCurrentUser,
} from "./userSlice";
