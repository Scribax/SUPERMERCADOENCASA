'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroAffiliateCard from './HeroAffiliateCard';
import HeroSlider from '@/components/ui/HeroSlider';

interface HeroProps {
  categories: { id: string; name: string; slug: string; icon: string | null }[];
}

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  type: string;
  isActive: boolean;
}

export default function Hero({ categories }: HeroProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (data.banners) {
          setBanners(data.banners.filter((b: Banner) => b.isActive && b.type === 'HERO'));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hasBanners = banners.length > 0;

  return (
    <section style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', minHeight: '440px' }}>
        {/* Main Hero Banner */}
        <div style={{ flex: '3 1 400px', display: 'flex' }}>
          {loading ? (
            <div style={{
              width: '100%',
              minHeight: '440px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #E2E8F0, #F1F5F9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#94A3B8' }}>Cargando...</span>
            </div>
          ) : hasBanners ? (
            /* Banners dinámicos desde el admin */
            <div style={{ width: '100%' }}>
              <HeroSlider banners={banners} />
            </div>
          ) : (
            /* Fallback: diseño por defecto */
            <div style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0E4FAF 0%, #1565C0 40%, #1976D2 100%)',
              borderRadius: '20px',
              padding: '40px 44px',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '440px',
              boxShadow: '0 12px 24px -8px rgba(14, 79, 175, 0.35), 0 4px 8px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              {/* Fondo decorativo */}
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(116,195,61,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-80px', left: '30%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 10, maxWidth: '500px' }}>
                <div style={{ display: 'inline-block', backgroundColor: 'rgba(116,195,61,0.2)', color: '#A3E635', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '16px', border: '1px solid rgba(116,195,61,0.3)' }}>
                  🚀 ENVÍOS GRATIS +$25.000
                </div>
                <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#FFFFFF', lineHeight: 1.12, margin: '0 0 16px', paddingBottom: '16px' }}>
                  Tu supermercado en casa,{' '}
                  <span style={{ color: '#74C33D' }}>todos los días</span>
                </h1>
                <p style={{ fontSize: '16px', color: '#DBEAFE', margin: '0 0 32px', paddingBottom: '32px', lineHeight: 1.6, maxWidth: '420px' }}>
                  Miles de productos, las mejores marcas y entrega rápida en tu ciudad.
                </p>
                <motion.a href="/productos" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ backgroundColor: '#74C33D', color: '#FFFFFF', padding: '16px 36px', borderRadius: '12px', fontWeight: '800', fontSize: '17px', textDecoration: 'none', display: 'inline-block', boxShadow: '0 6px 20px rgba(116, 195, 61, 0.45)', border: 'none', cursor: 'pointer', letterSpacing: '0.3px' }}>
                  Comprar ahora
                </motion.a>
              </div>

              <div style={{ position: 'absolute', right: '-15px', bottom: '-5px', zIndex: 2, pointerEvents: 'none' }}>
                <img src="/images/hero_shopping_basket.png" alt="Canasta" style={{ width: '340px', height: '340px', objectFit: 'contain', filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.35))' }} />
              </div>

              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)', borderTop: '1px solid rgba(255,255,255,0.12)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#FFFFFF', zIndex: 10, backdropFilter: 'blur(8px)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>🚚</span> Entrega el día que elegís</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>🏷️</span> Descuentos exclusivos online</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>💳</span> Pagá como quieras</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Affiliate Card */}
        <div style={{ flex: '1 1 270px', maxWidth: '290px', display: 'flex' }}>
          <div style={{ width: '100%' }}>
            <HeroAffiliateCard />
          </div>
        </div>
      </div>
    </section>
  );
}
