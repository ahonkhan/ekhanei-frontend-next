'use client';

import React, { createContext, useContext } from 'react';
import { Product, CartItem } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addItem,
  increment,
  decrement,
  removeItem,
  clearCart,
  setIsCartOpen,
} from '@/store/slices/cartSlice';

interface CartContextType {
  cart: CartItem[];
  addItem: (product: Product) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  totalAmount: number;
  getItem: (id: string) => CartItem | undefined;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const isCartOpen = useAppSelector((state) => state.cart.isCartOpen);

  const handleAddItem = (product: Product) => dispatch(addItem(product));
  const handleIncrement = (id: string) => dispatch(increment(id));
  const handleDecrement = (id: string) => dispatch(decrement(id));
  const handleRemoveItem = (id: string) => dispatch(removeItem(id));
  const handleClearCart = () => dispatch(clearCart());
  const handleSetIsCartOpen = (open: boolean) => dispatch(setIsCartOpen(open));

  const getItem = (id: string) => cart.find((item) => item.id === id);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem: handleAddItem,
        increment: handleIncrement,
        decrement: handleDecrement,
        removeItem: handleRemoveItem,
        clearCart: handleClearCart,
        totalItemsCount,
        totalAmount,
        getItem,
        isCartOpen,
        setIsCartOpen: handleSetIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
