import type { Metadata } from 'next';
import React from 'react';
import { ProductDetailsContent } from '@/components/product/ProductDetailsContent';

export function generateStaticParams() {
  const defaultProductIds = ['1', '2', '3', '4', '5', '6', 'padma-hilsha-fish', 'fresh-ruhi-fish-cleaned', 'napa-extra-500mg', 'mutton-kacchi-biryani'];
  return defaultProductIds.map(id => ({ id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://admin.ekhanei.bd/api/v1';

  try {
    const res = await fetch(`${apiBase}/products/${productId}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const json = await res.json();
      const product = json?.data;

      if (product) {
        const title = `${product.name} - ৳${product.price} | Ekhanei`;
        const rawDesc = product.description ? product.description.replace(/<[^>]*>?/gm, '').trim() : '';
        const description = rawDesc
          ? (rawDesc.length > 155 ? rawDesc.substring(0, 155) + '...' : rawDesc)
          : `Buy ${product.name} online at ৳${product.price} on Ekhanei with fast home delivery in Bangladesh.`;

        // Format Image URL
        let imageUrl = product.image || '';
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://admin.ekhanei.bd/storage/${imageUrl.replace(/^\/+/, '')}`;
        }
        if (!imageUrl) {
          imageUrl = 'https://govaly.com.bd/assets/logo/SSLCommerze_desktop.png';
        }

        const keywords = [
          product.name,
          product.categoryName,
          product.subcategoryName,
          product.brandName,
          'Ekhanei',
          'Ekhanei Online Shop',
          'Buy Online Bangladesh',
          'Hyperlocal Delivery',
        ].filter(Boolean) as string[];

        const pageUrl = `https://ekhanei-frontend-next.vercel.app/product/${product.id}`;

        return {
          title,
          description,
          keywords,
          alternates: {
            canonical: pageUrl,
          },
          openGraph: {
            title: `${product.name} - ৳${product.price}`,
            description,
            url: pageUrl,
            siteName: 'Ekhanei',
            images: [
              {
                url: imageUrl,
                width: 800,
                height: 800,
                alt: product.name,
              },
            ],
            locale: 'en_US',
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: `${product.name} - ৳${product.price}`,
            description,
            images: [imageUrl],
          },
        };
      }
    }
  } catch (error) {
    console.error('Error generating metadata for product page:', error);
  }

  return {
    title: 'Product Details | Ekhanei',
    description: 'Shop quality products on Ekhanei with fast home delivery.',
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  return <ProductDetailsContent productId={resolvedParams.id} />;
}
