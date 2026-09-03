import React from 'react';
import { StoreDetailPageContent } from '@/components/store/StoreDetailPageContent';

export function generateStaticParams() {
  const storeIds = ['1', '2', '3', '4', 'sultan-dine', 'lazz-pharma', 'gadget-world', 'bengal-super-mart'];
  return storeIds.map((id) => ({ id }));
}

export default async function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <StoreDetailPageContent storeId={resolvedParams.id} />;
}
