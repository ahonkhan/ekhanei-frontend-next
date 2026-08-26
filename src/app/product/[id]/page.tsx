import React from 'react';
import { PRODUCTS } from '@/data/mockData';
import { ProductDetailsContent } from '@/components/product/ProductDetailsContent';

export function generateStaticParams() {
  return PRODUCTS.map((prod) => ({
    id: prod.id,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <ProductDetailsContent productId={resolvedParams.id} />;
}
