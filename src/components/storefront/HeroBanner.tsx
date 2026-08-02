'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSlider from '@/components/ui/HeroSlider';

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  type: string;
  isActive: boolean;
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    hero_title: 'Tu supermercado en casa, todos los días',
    hero_subtitle: 'Miles de productos, las mejores marcas y entrega rápida en tu ciudad.',
    hero_badge: '🚀 ENVÍOS GRATIS +$25.000',
    hero_button: 'Comprar ahora',
  });

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

    fetch('/api/config')
      .then(res => res.json())
      .then(data => { if (data.config) setConfig(prev => ({ ...prev, ...data.config })); })
      .catch(() => {});
  }, []);

  const hasBanners = banners.length > 0;

  if (loading) {
    return (
      <div style={{
        width: '100%',
        minHeight: '440px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #E2E8F0, #F1F5F9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ color: '#94A3B8' }}>Cargando banners...</span>
      </div>
    );
  }

  if (hasBanners) {
    return <HeroSlider banners={banners} />;
  }

  // Fallback: diseño por defecto
  return (
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
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(116,195,61,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '30%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '500px' }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(116,195,61,0.2)', color: '#A3E635', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '16px', border: '1px solid rgba(116,195,61,0.3)' }}>
          {config.hero_badge}
        </div>
        <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#FFFFFF', lineHeight: 1.12, margin: '0 0 16px', paddingBottom: '16px' }}>
          {config.hero_title}
        </h1>
        <p style={{ fontSize: '16px', color: '#DBEAFE', margin: '0 0 32px', paddingBottom: '32px', lineHeight: 1.6, maxWidth: '420px' }}>
          {config.hero_subtitle}
        </p>
        <motion.a href="/productos" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={{ backgroundColor: '#74C33D', color: '#FFFFFF', padding: '16px 36px', borderRadius: '12px', fontWeight: '800', fontSize: '17px', textDecoration: 'none', display: 'inline-block', boxShadow: '0 6px 20px rgba(116, 195, 61, 0.45)', border: 'none', cursor: 'pointer', letterSpacing: '0.3px' }}>
          {config.hero_button}
        </motion.a>
      </div>

      <div style={{ position: 'absolute', right: '-15px', bottom: '-5px', zIndex: 2, pointerEvents: 'none' }}>
        <img src="/images/hero_shopping_basket.png" alt="Canasta" style={{ width: '340px', height: '340px', objectFit: 'contain', filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.35))' }} />
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.18)', borderTop: '1px solid rgba(255,255,255,0.12)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#FFFFFF', zIndex: 10, backdropFilter: 'blur(8px)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>🚚</span> Envío gratis<br /><span style={{ fontSize: '10px', opacity: 0.7 }}>en compras +$25.000</span></span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>🏷️</span> Descuentos<br /><span style={{ fontSize: '10px', opacity: 0.7 }}>exclusivos online</span></span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>💳</span> Pagá como quieras<br /><span style={{ fontSize: '10px', opacity: 0.7 }}>Tarjeta, transferencia y más</span></span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>📦</span> Entrega rápida<br /><span style={{ fontSize: '10px', opacity: 0.7 }}>El día que elegís</span></span>
      </div>
    </div>
  );
}
