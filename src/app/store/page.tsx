'use client';

import React from 'react';
import { useGetStoresQuery, useGetProductsQuery } from '@/store/services/apiService';
import { StoreProfileContent } from '@/components/store/StoreProfileContent';

export default function DefaultStorePage() {
  const { data: stores = [], isLoading: isStoreLoading } = useGetStoresQuery({});
  const firstStore = stores[0];
  
  const { data: products = [] } = useGetProductsQuery(
    firstStore ? { storeId: firstStore.id } : {},
    { skip: !firstStore }
  );

  if (isStoreLoading || !firstStore) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return <StoreProfileContent store={firstStore} products={products} />;
}
