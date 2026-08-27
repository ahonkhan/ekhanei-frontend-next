import React from 'react';
import { CATEGORIES } from '@/data/mockData';
import { CategoryPageContent } from '@/components/category/CategoryPageContent';

export function generateStaticParams() {
  const list = CATEGORIES.map((cat) => ({
    slug: cat.id,
  }));
  list.push({ slug: 'category' });
  return list;
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CategoryPageContent slug={resolvedParams.slug} />;
}
