'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/hooks/useCart';

interface FeaturedProductsProps {
  title: string;
  products: Product[];
}

export default function FeaturedProducts({ title, products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A' }}>
            {title}
          </h2>
          <p style={{ color: '#64748B', marginTop: '4px', fontSize: '14px' }}>Los mejores precios para tu hogar</p>
        </div>
        <Link href="/productos" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0E4FAF', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
          Ver todas <ArrowRight size={18} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
