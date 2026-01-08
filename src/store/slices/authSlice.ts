import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/auth.service";
import { AuthState, LoginCredentials, RegisterCredentials } from "@/types/auth.types";
import { User } from "@/types/user.types";
import { setStoredUser, removeStoredUser, getStoredUser } from "@/utils/helpers";

interface RejectedError {
  message: string;
}

const initialState: AuthState = {
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      setStoredUser(response.user);
      return response.user;
    } catch (error) {
      const err = error as RejectedError;
      return rejectWithValue(err.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      setStoredUser(response.user);
      return response.user;
    } catch (error) {
      const err = error as RejectedError;
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    removeStoredUser();
  } catch (error) {
    const err = error as RejectedError;
    return rejectWithValue(err.message);
  }
});

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getProfile();
      setStoredUser(user);
      return user;
    } catch (error) {
      const err = error as RejectedError;
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      setStoredUser(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
