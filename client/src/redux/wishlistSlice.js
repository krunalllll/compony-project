import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const getLocalWishlist = () => {
  try {
    const saved = localStorage.getItem('guest_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveLocalWishlist = (items) => {
  try {
    localStorage.setItem('guest_wishlist', JSON.stringify(items));
  } catch (e) {
    console.error('Error saving local wishlist', e);
  }
};

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return getLocalWishlist();
  }
  try {
    const response = await api.get('/wishlist');
    const prods = response.data.products || [];
    saveLocalWishlist(prods);
    return prods;
  } catch {
    return getLocalWishlist();
  }
});

export const addToWishlistAsync = createAsyncThunk('wishlist/add', async (productOrId) => {
  const token = localStorage.getItem('token');
  const productId = typeof productOrId === 'object' ? productOrId._id : productOrId;

  if (token) {
    try {
      const response = await api.post('/wishlist/add', { productId });
      saveLocalWishlist(response.data.products || []);
      return response.data.products || [];
    } catch (error) {
      console.warn('API wishlist add failed, using local storage fallback', error);
    }
  }

  const localItems = getLocalWishlist();
  const exists = localItems.some((item) => (item._id || item) === productId);
  let updated = localItems;

  if (!exists) {
    const itemToAdd = typeof productOrId === 'object' ? productOrId : { _id: productId };
    updated = [...localItems, itemToAdd];
  }

  saveLocalWishlist(updated);
  return updated;
});

export const removeFromWishlistAsync = createAsyncThunk('wishlist/remove', async (productId) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const response = await api.delete('/wishlist/remove', { data: { productId } });
      saveLocalWishlist(response.data.products || []);
      return response.data.products || [];
    } catch (error) {
      console.warn('API wishlist remove failed, using local storage fallback', error);
    }
  }

  const localItems = getLocalWishlist();
  const updated = localItems.filter((item) => (item._id || item) !== productId);
  saveLocalWishlist(updated);
  return updated;
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    products: getLocalWishlist(),
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.products = [];
      saveLocalWishlist([]);
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
