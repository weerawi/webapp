import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

interface AuthUser {
  uid: string;
  email: string | null;
  role?: "Admin" | "Waterboard";
  username?: string;
  area?: string;
  options?: string[];
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    updateUserRole: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUserRole } = authSlice.actions;
export default authSlice.reducer;