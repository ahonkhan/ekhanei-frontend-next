import React from 'react';
import { CATEGORIES, CATEGORY_DETAILS_DATA } from '@/data/mockData';
import { SubCategoryPageContent } from '@/components/category/SubCategoryPageContent';

export function generateStaticParams() {
  const params: { slug: string; subSlug: string }[] = [];

  CATEGORIES.forEach(cat => {
    const meta = CATEGORY_DETAILS_DATA[cat.id];
    const subCats = meta?.subCategories || [
      { id: 'all', name: 'All Products' },
      { id: 'popular', name: 'Popular Items' },
    ];
    subCats.forEach(sub => {
      params.push({
        slug: cat.id,
        subSlug: sub.id,
      });
    });
  });

  return params;
}

export default async function SubCategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const resolvedParams = await params;
  return <SubCategoryPageContent slug={resolvedParams.slug} subSlug={resolvedParams.subSlug} />;
}
