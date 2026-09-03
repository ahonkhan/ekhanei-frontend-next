'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { initializeCart } from './slices/cartSlice';

function StoreInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(initializeCart());
  }, []);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreInitializer>{children}</StoreInitializer>
    </Provider>
  );
}
