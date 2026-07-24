import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  let product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    product = await prisma.product.findUnique({
      where: { slug: id },
    });
  }

  if (!product) {
    return {
      title: 'Producto no encontrado | Superencasa',
    };
  }

  const currentPrice = product.offerPrice !== null ? product.offerPrice : product.price;

  return {
    title: `${product.name} | Superencasa`,
    description: product.description.slice(0, 155),
    openGraph: {
      title: `${product.name} al mejor precio | Superencasa`,
      description: product.description.slice(0, 155),
      images: [
        {
          url: product.images.split(',')[0],
          alt: product.name,
        },
      ],
    },
    other: {
      'product:price:amount': currentPrice.toString(),
      'product:price:currency': 'ARS',
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  // Fetch product detail
  let product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      reviews: {
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    product = await prisma.product.findUnique({
      where: { slug: id },
      include: {
        category: true,
        brand: true,
        reviews: {
          include: {
            user: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current product)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  // Calculate average rating
  const reviewCount = product.reviews.length;
  const avgRating =
    reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 5;

  // JSON-LD structured schema for Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.split(','),
    description: product.description,
    sku: product.sku,
    mpn: product.barcode || product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'Superencasa',
    },
    offers: {
      '@type': 'Offer',
      url: `http://localhost:3000/productos/${product.slug}`,
      priceCurrency: 'ARS',
      price: product.offerPrice !== null ? product.offerPrice : product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    aggregateRating:
      reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: avgRating.toFixed(1),
            reviewCount: reviewCount.toString(),
          }
        : undefined,
  };

  return (
    <>
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ProductDetailClient
        product={product as any}
        relatedProducts={relatedProducts as any[]}
        avgRating={avgRating}
        reviewCount={reviewCount}
      />
    </>
  );
}
