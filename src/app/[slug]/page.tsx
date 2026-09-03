import React from 'react';
import { CategoryPageContent } from '@/components/category/CategoryPageContent';

export function generateStaticParams() {
  const serviceSlugs = [
    'fresh-fish', 'fashion', 'gadget-electronics', 'pharmacy', 
    'grocery', 'cake-bakery', 'food', 'gas-cylinder', 'ready-to-cook'
  ];
  return serviceSlugs.map(slug => ({ slug }));
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CategoryPageContent slug={resolvedParams.slug} />;
}
