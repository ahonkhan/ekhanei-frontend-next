import React from 'react';
import { SubCategoryPageContent } from '@/components/category/SubCategoryPageContent';

export const dynamicParams = true;

export function generateStaticParams() {
  const serviceSlugs = [
    'fresh-fish', 'fashion', 'men-fashion', 'women-fashion', 'gadget-electronics', 'pharmacy', 
    'grocery', 'cake-bakery', 'food', 'gas-cylinder', 'ready-to-cook', 'category'
  ];
  const subSlugs = [
    'all', 'popular', 'men-footwear', 'men-bottomwear', 'women-fashion-wear',
    'women-bottom-wear', 'men-topwear', 'women-footwear', 'health-beauty',
    'kids-kurti', 'baby-clothing-set', 'fresh-fish', 'fashion', 'electronics',
    ...Array.from({ length: 50 }, (_, i) => String(i + 1))
  ];

  const params: { slug: string; subSlug: string }[] = [];
  serviceSlugs.forEach((slug) => {
    subSlugs.forEach((subSlug) => {
      params.push({ slug, subSlug });
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
