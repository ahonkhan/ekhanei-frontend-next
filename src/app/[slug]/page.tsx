import React from 'react';
import { CategoryPageContent } from '@/components/category/CategoryPageContent';
import { PolicyPageContent } from '@/components/policy/PolicyPageContent';
import { policiesData } from '@/data/policiesData';

export function generateStaticParams() {
  const serviceSlugs = [
    'fresh-fish', 'fashion', 'gadget-electronics', 'pharmacy', 
    'grocery', 'cake-bakery', 'food', 'gas-cylinder', 'ready-to-cook'
  ];
  const policySlugs = policiesData.map((p) => p.id);
  return [...serviceSlugs, ...policySlugs].map((slug) => ({ slug }));
}

export default async function DynamicSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const policy = policiesData.find((p) => p.id === resolvedParams.slug);

  if (policy) {
    return <PolicyPageContent policy={policy} />;
  }

  return <CategoryPageContent slug={resolvedParams.slug} />;
}

