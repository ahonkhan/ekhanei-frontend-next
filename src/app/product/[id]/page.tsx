import React from 'react';
import { ProductDetailsContent } from '@/components/product/ProductDetailsContent';

export function generateStaticParams() {
  const defaultProductIds = ['1', '2', '3', '4', '5', '6', 'padma-hilsha-fish', 'fresh-ruhi-fish-cleaned', 'napa-extra-500mg', 'mutton-kacchi-biryani'];
  return defaultProductIds.map(id => ({ id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <ProductDetailsContent productId={resolvedParams.id} />;
}
