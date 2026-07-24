'use client';
import { motion } from 'framer-motion';
import SidebarCategories from './SidebarCategories';
import HeroAffiliateCard from './HeroAffiliateCard';
import Image from 'next/image';

interface HeroProps {
  categories: { id: string; name: string; slug: string; icon: string | null }[];
}

export default function Hero({ categories }: HeroProps) {
  return (
    <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px', width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', minHeight: '440px' }}>
        {/* Left Column: Sidebar Categories */}
        <div style={{ flex: '1 1 260px', maxWidth: '280px', display: 'flex' }}>
          <div style={{ width: '100%', display: 'block' }}>
            <SidebarCategories categories={categories} />
          </div>
        </div>

        {/* Center Column: Main Hero Banner */}
        <div style={{ flex: '3 1 400px', display: 'flex' }}>
          <div style={{ width: '100%', background: 'linear-gradient(135deg, #0E4FAF 0%, #1662C9 100%)', borderRadius: '16px', padding: '36px 40px', color: '#FFFFFF', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '440px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', border: '1px solid rgba(30, 64, 175, 0.3)' }}>
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '420px' }}>
              <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#FFFFFF', lineHeight: 1.15, marginBottom: '16px', margin: 0, paddingBottom: '16px' }}>
                Tu supermercado en casa, <br />
                <span style={{ color: '#74C33D' }}>todos los días</span>
              </h1>
              <p style={{ fontSize: '15px', color: '#E2E8F0', marginBottom: '28px', lineHeight: 1.5, margin: 0, paddingBottom: '28px' }}>
                Miles de productos, las mejores marcas y entrega rápida en tu ciudad.
              </p>
              
              <motion.a
                href="/productos"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{ backgroundColor: '#74C33D', color: '#FFFFFF', padding: '14px 32px', borderRadius: '10px', fontWeight: '800', fontSize: '16px', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 14px rgba(116, 195, 61, 0.4)', border: 'none', cursor: 'pointer' }}
              >
                Comprar ahora
              </motion.a>
            </div>

            {/* 3D shopping basket image */}
            <div style={{ position: 'absolute', right: '-10px', bottom: '10px', zIndex: 1, pointerEvents: 'none' }}>
              <img
                src="/images/hero_shopping_basket.png"
                alt="Canasta de supermercado"
                style={{ width: '300px', height: '300px', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
              />
            </div>
            
            {/* Bottom Benefit Strip */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.15)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#FFFFFF', zIndex: 10, backdropFilter: 'blur(4px)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>🚀</span> Envíos gratis (+$25.000)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>🏷️</span> Descuentos (exclusivos online)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>💳</span> Pagá como quieras</span>
            </div>
          </div>
        </div>

        {/* Right Column: Affiliate Card */}
        <div style={{ flex: '1 1 260px', maxWidth: '280px', display: 'flex' }}>
          <div style={{ width: '100%', display: 'block' }}>
            <HeroAffiliateCard />
          </div>
        </div>
      </div>
    </section>
  );
}
