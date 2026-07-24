import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import ProductCard from '@/components/ui/ProductCard';
import HeroSlider from '@/components/ui/HeroSlider';
import { Truck, ShieldCheck, Headphones, ArrowRight } from 'lucide-react';

export const revalidate = 60; // Revalidate home page cache every minute

export default async function HomePage() {
  // Fetch banners, categories and products directly from DB (SSR)
  const [banners, categories, offerProducts, newProducts] = await Promise.all([
    prisma.banner.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    prisma.category.findMany({ orderBy: { order: 'asc' }, take: 6 }),
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

  // Fallback banners if none seeded
  const activeBanners = banners.length > 0 ? banners : [
    {
      id: 'default-1',
      title: 'Frescura que llega a tu puerta',
      subtitle: 'Frutas y verduras seleccionadas del día. Envío gratis en tu primera compra.',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600',
      linkUrl: '/productos?categoria=frutas-y-verduras',
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', paddingBottom: '60px' }}>
      
      {/* 1. HERO BANNER SLIDER */}
      <section style={{ width: '100%' }} id="home-hero-slider">
        <HeroSlider banners={activeBanners} />
      </section>

      {/* 2. BENEFITS / TRUST BADGES */}
      <section className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Entrega Rápida</h4>
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>Recibí tu pedido en el día y horario elegido.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Compra Segura</h4>
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>Cifrado SSL y pasarelas de pago de confianza.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Headphones size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Atención Personalizada</h4>
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>Soporte directo por WhatsApp y email.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES WITH IMAGES */}
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '800' }}>Explorar Categorías</h2>
            <p style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>Buscá lo que necesitás por departamento</p>
          </div>
          <Link href="/productos" style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Ver Todo <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '20px' }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.slug}`}
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)',
              }}
              className="category-tile"
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  🥗
                </div>
              )}
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED OFFERS */}
      <section className="container">
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

      {/* 5. NEW ARRIVALS */}
      <section className="container">
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

    </div>
  );
}
