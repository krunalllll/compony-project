import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const getLocalCart = () => {
  try {
    const saved = localStorage.getItem('guest_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveLocalCart = (items) => {
  try {
    localStorage.setItem('guest_cart', JSON.stringify(items));
  } catch (e) {
    console.error('Error saving local cart', e);
  }
};

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return getLocalCart();
  }
  try {
    const response = await api.get('/cart');
    const serverItems = response.data.items || [];
    // Also save a copy locally
    saveLocalCart(serverItems);
    return serverItems;
  } catch (error) {
    // Fallback to local cart on error
    return getLocalCart();
  }
});

export const addToCartAsync = createAsyncThunk('cart/add', async (itemData, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  const { productId, quantity = 1, size = 'Free Size', color = 'Default', product = null } = itemData;

  if (token) {
    try {
      const response = await api.post('/cart/add', { productId: product?._id || productId, quantity, size, color });
      saveLocalCart(response.data.items || []);
      return response.data.items || [];
    } catch (error) {
      console.warn('API cart add failed, falling back to local storage', error);
    }
  }

  // Local / Guest Cart Handling
  const localItems = getLocalCart();
  const prodObj = product || (typeof productId === 'object' ? productId : { _id: productId, name: 'Streetwear Garment', price: 99, images: [] });
  const pId = prodObj._id || productId;

  const existingIndex = localItems.findIndex(
    (item) => (item.productId?._id || item.productId) === pId && item.size === size && item.color === color
  );

  let updatedItems = [];
  if (existingIndex > -1) {
    updatedItems = localItems.map((item, idx) => {
      if (idx === existingIndex) {
        return { ...item, quantity: item.quantity + quantity };
      }
      return item;
    });
  } else {
    updatedItems = [
      ...localItems,
      {
        _id: 'local_' + Date.now() + Math.random().toString(36).substr(2, 4),
        productId: prodObj,
        quantity,
        size,
        color,
      },
    ];
  }

  saveLocalCart(updatedItems);
  return updatedItems;
});

export const updateCartItemAsync = createAsyncThunk('cart/update', async (updateData, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  const { productId, size, color, quantity } = updateData;

  if (token) {
    try {
      const response = await api.put('/cart/update', updateData);
      saveLocalCart(response.data.items || []);
      return response.data.items || [];
    } catch (error) {
      console.warn('API cart update failed, using local fallback', error);
    }
  }

  const localItems = getLocalCart();
  const updated = localItems.map((item) => {
    const currId = item.productId?._id || item.productId;
    if (currId === productId && item.size === size && item.color === color) {
      return { ...item, quantity };
    }
    return item;
  });

  saveLocalCart(updated);
  return updated;
});

export const removeCartItemAsync = createAsyncThunk('cart/remove', async (removeData, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  const { productId, size, color } = removeData;

  if (token) {
    try {
      const response = await api.delete('/cart/remove', { data: removeData });
      saveLocalCart(response.data.items || []);
      return response.data.items || [];
    } catch (error) {
      console.warn('API cart remove failed, using local fallback', error);
    }
  }

  const localItems = getLocalCart();
  const updated = localItems.filter((item) => {
    const currId = item.productId?._id || item.productId;
    return !(currId === productId && item.size === size && item.color === color);
  });

  saveLocalCart(updated);
  return updated;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getLocalCart(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      saveLocalCart([]);
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
      saveLocalCart(action.payload);
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

export const { clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
