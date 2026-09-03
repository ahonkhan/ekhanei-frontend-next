import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem } from '@/types';

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('shym_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const initialState: CartState = {
  cart: [],
  isCartOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart: (state) => {
      state.cart = loadCartFromStorage();
    },
    addItem: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existing = state.cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('shym_cart', JSON.stringify(state.cart));
      }
    },
    increment: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.cart.find(i => i.id === id);
      if (item) {
        item.quantity += 1;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('shym_cart', JSON.stringify(state.cart));
      }
    },
    decrement: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const itemIndex = state.cart.findIndex(i => i.id === id);
      if (itemIndex !== -1) {
        if (state.cart[itemIndex].quantity > 1) {
          state.cart[itemIndex].quantity -= 1;
        } else {
          state.cart.splice(itemIndex, 1);
        }
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('shym_cart', JSON.stringify(state.cart));
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('shym_cart', JSON.stringify(state.cart));
      }
    },
    clearCart: (state) => {
      state.cart = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('shym_cart');
      }
    },
    setIsCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    },
  },
});

export const {
  initializeCart,
  addItem,
  increment,
  decrement,
  removeItem,
  clearCart,
  setIsCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
