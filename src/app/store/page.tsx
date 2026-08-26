import React from 'react';
import { STORES, getProductsByStore } from '@/data/mockData';
import { StoreProfileContent } from '@/components/store/StoreProfileContent';

export default function DefaultStorePage() {
  const store = STORES[0]; // Default store (Sultan's Dine & Grill)
  const products = getProductsByStore(store);

  return <StoreProfileContent store={store} products={products} />;
}
