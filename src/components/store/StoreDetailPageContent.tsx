'use client';

import React from 'react';
import { useGetStoreByIdQuery, useGetProductsQuery } from '@/store/services/apiService';
import { useLocation } from '@/context/LocationContext';
import { StoreProfileContent } from '@/components/store/StoreProfileContent';

export const StoreDetailPageContent: React.FC<{ storeId: string }> = ({ storeId }) => {
  const { userCoords } = useLocation();
  const { data: store, isLoading: isStoreLoading } = useGetStoreByIdQuery({
    id: storeId,
    lat: userCoords?.lat,
    lng: userCoords?.lng,
  });
  const { data: products = [] } = useGetProductsQuery({ storeId });

  if (isStoreLoading || !store) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return <StoreProfileContent store={store} products={products} />;
};
