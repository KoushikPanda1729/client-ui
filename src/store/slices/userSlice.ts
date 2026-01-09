import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/user.service";
import { UserState, UpdateUserPayload } from "@/types/user.types";
import { QueryParams } from "@/types/api.types";

interface RejectedError {
  message: string;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (params: QueryParams | undefined, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers(params);
      return response.data;
    } catch (error) {
      const err = error as RejectedError;
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (id: number, { rejectWithValue }) => {
    try {
      const user = await userService.getUserById(id);
      return user;
    } catch (error) {
      const err = error as RejectedError;
      return rejectWithValue(err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (payload: UpdateUserPayload, { rejectWithValue }) => {
    try {
      const user = await userService.updateUser(payload);
      return user;
    } catch (error) {
      const err = error as RejectedError;
      return rejectWithValue(err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: number, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error) {
      const err = error as RejectedError;
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch User By ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update User
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        // Update in users list if exists
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete User
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
