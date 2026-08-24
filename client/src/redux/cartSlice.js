import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    return response.data.items || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCartAsync = createAsyncThunk('cart/add', async (itemData, { rejectWithValue }) => {
  try {
    const response = await api.post('/cart/add', itemData);
    return response.data.items || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add item');
  }
});

export const updateCartItemAsync = createAsyncThunk('cart/update', async (updateData, { rejectWithValue }) => {
  try {
    const response = await api.put('/cart/update', updateData);
    return response.data.items || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update item');
  }
});

export const removeCartItemAsync = createAsyncThunk('cart/remove', async (removeData, { rejectWithValue }) => {
  try {
    const response = await api.delete('/cart/remove', { data: removeData });
    return response.data.items || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
