'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, CartItem } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AuthModal } from '@/components/auth/AuthModal';
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
  openAuthModal: (redirectTo?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const isCartOpen = useAppSelector((state) => state.cart.isCartOpen);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const openAuthModal = (redirectTo?: string) => {
    if (redirectTo) {
      setRedirectPath(redirectTo);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('post_login_redirect', redirectTo);
      }
    } else {
      setRedirectPath(null);
    }
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    const targetRedirect =
      redirectPath ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('post_login_redirect') : null);

    if (targetRedirect) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('post_login_redirect');
      }
      setRedirectPath(null);
      router.push(targetRedirect);
    }
  };

  const handleAddItem = (product: Product) => {
    dispatch(addItem(product));
  };

  const handleIncrement = (id: string) => {
    dispatch(increment(id));
  };

  const handleDecrement = (id: string) => {
    dispatch(decrement(id));
  };

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
        openAuthModal,
      }}
    >
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
