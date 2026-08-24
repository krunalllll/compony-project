import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/wishlist');
    return response.data.products || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
  }
});

export const addToWishlistAsync = createAsyncThunk('wishlist/add', async (productId, { rejectWithValue }) => {
  try {
    const response = await api.post('/wishlist/add', { productId });
    return response.data.products || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
  }
});

export const removeFromWishlistAsync = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    const response = await api.delete('/wishlist/remove', { data: { productId } });
    return response.data.products || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.products = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
