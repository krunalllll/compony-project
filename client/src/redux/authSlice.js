import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Signup failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    return null;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

export const checkAuthStatus = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return rejectWithValue('No active session');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    role: localStorage.getItem('role') || null,
    loading: false,
    checkingAuth: true,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload?.role || 'user';
        state.isAuthenticated = true;
        localStorage.setItem('role', action.payload?.role || 'user');
        if (action.payload?.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.role = null;
        localStorage.removeItem('role');
        localStorage.removeItem('token');
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload?.role || 'user';
        state.isAuthenticated = true;
        localStorage.setItem('role', action.payload?.role || 'user');
        if (action.payload?.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.role = null;
        localStorage.removeItem('role');
        localStorage.removeItem('token');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.loading = false;
        localStorage.removeItem('role');
        localStorage.removeItem('token');
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.checkingAuth = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload?.role || 'user';
        state.isAuthenticated = true;
        state.checkingAuth = false;
        localStorage.setItem('role', action.payload?.role || 'user');
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.checkingAuth = false;
        localStorage.removeItem('role');
        localStorage.removeItem('token');
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
