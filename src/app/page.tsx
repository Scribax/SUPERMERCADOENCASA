import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import ProductCard from '@/components/ui/ProductCard';
import HeroBannerSection from '@/components/home/HeroBannerSection';
import CircleCategories from '@/components/home/CircleCategories';
import TrustFooterBar from '@/components/home/TrustFooterBar';
import { ArrowRight } from 'lucide-react';

export const revalidate = 60; // Revalidate home page cache every minute

export default async function HomePage() {
  // Fetch products directly from DB (SSR)
  const [offerProducts, newProducts] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, offerPrice: { not: null } },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '0' }}>
      
      {/* 1. HERO BANNER SECTION (Includes Sidebar, Main Banner, Promo Card) */}
      <HeroBannerSection />

      {/* 2. CIRCLE CATEGORIES */}
      <CircleCategories />

      {/* 3. FEATURED OFFERS */}
      <section className="container" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '800' }}>Ofertas Destacadas</h2>
            <p style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>Descuentos exclusivos y precios especiales</p>
          </div>
          <Link href="/productos?orden=mayor-precio" style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Ver Más <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {offerProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
          {offerProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--foreground-muted)' }}>
              No hay ofertas activas en este momento. Volvé a consultar pronto!
            </div>
          )}
        </div>
      </section>

      {/* 4. NEW ARRIVALS */}
      <section className="container" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '800' }}>Nuevos Ingresos</h2>
            <p style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>Lo último que sumamos a nuestras góndolas</p>
          </div>
          <Link href="/productos?orden=mas-recientes" style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Ver Todo <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {newProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
        </div>
      </section>

      {/* 5. TRUST FOOTER BAR */}
      <TrustFooterBar />

    </div>
  );
}
