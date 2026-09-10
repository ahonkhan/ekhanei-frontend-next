import React from 'react';
import { SubCategoryPageContent } from '@/components/category/SubCategoryPageContent';

export const dynamicParams = true;

export default async function ChildSubCategoryPage({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string; childSlug: string }>;
}) {
  const resolvedParams = await params;
  return (
    <SubCategoryPageContent
      slug={resolvedParams.slug}
      subSlug={resolvedParams.subSlug}
      childSlug={resolvedParams.childSlug}
    />
  );
}
