import React from 'react';
import { STORES, getStoreById, getProductsByStore } from '@/data/mockData';
import { StoreProfileContent } from '@/components/store/StoreProfileContent';

export function generateStaticParams() {
  return STORES.map((store) => ({
    id: store.id,
  }));
}

export default async function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const store = getStoreById(resolvedParams.id);
  const products = getProductsByStore(store);

  return <StoreProfileContent store={store} products={products} />;
}
