'use client';
import React from 'react';
import Link from 'next/link';
import CategorySidebar from './CategorySidebar';
import { Check } from 'lucide-react';

export default function HeroBannerSection() {
  return (
    <div className="container" style={{ display: 'flex', gap: '20px', alignItems: 'stretch', marginTop: '20px' }}>
      {/* Left: Category Sidebar */}
      <CategorySidebar />

      {/* Center: Main Hero Banner */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #0A3663 0%, #15528D 100%)', borderRadius: '12px', padding: '40px', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', minHeight: '440px' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '440px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#FFFFFF', lineHeight: 1.15, marginBottom: '16px' }}>
            Tu supermercado en casa, <span style={{ color: '#7CB518' }}>todos los días</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#E2E8F0', marginBottom: '28px', lineHeight: 1.5 }}>
            Miles de productos, las mejores marcas y entrega rápida en tu ciudad.
          </p>
          <Link href="/productos" style={{ display: 'inline-block', backgroundColor: '#7CB518', color: '#FFFFFF', padding: '14px 32px', borderRadius: '8px', fontWeight: '800', fontSize: '16px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(124, 181, 24, 0.4)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            Comprar ahora
          </Link>
        </div>
        
        {/* Shopping Basket Image */}
        <div style={{ position: 'absolute', right: '-10px', bottom: '10px', zIndex: 1, pointerEvents: 'none' }}>
          <img
            src="/images/hero_shopping_basket.png"
            alt="Canasta de supermercado"
            style={{ width: '320px', height: '320px', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
          />
        </div>

        {/* Bottom Benefit Strip */}
        <div style={{ display: 'flex', gap: '20px', zIndex: 2, flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF', fontWeight: '600' }}>
            <span style={{ fontSize: '16px' }}>🚚</span> Envíos gratis (en compras +$25.000)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF', fontWeight: '600' }}>
            <span style={{ fontSize: '16px' }}>🏷️</span> Descuentos (exclusivos online)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF', fontWeight: '600' }}>
            <span style={{ fontSize: '16px' }}>💳</span> Pagá como quieras (Tarjeta, transferencia y más)
          </div>
        </div>
      </div>

      {/* Right: Promo Card */}
      <div style={{ width: '260px', flexShrink: 0, backgroundColor: '#0B2238', borderRadius: '12px', padding: '28px 20px', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #1E3A5F' }}>
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#FFFFFF', marginBottom: '24px', lineHeight: 1.25 }}>
            Comprá, recomendá <span style={{ color: '#7CB518' }}>y ganá</span>
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#FFFFFF' }}>
              <span style={{ color: '#7CB518', fontSize: '16px' }}>✓</span> 
              <span><strong style={{ color: '#FFFFFF' }}>Revendedores</strong> <span style={{ color: '#CBD5E1' }}>(Precios mayoristas)</span></span>
            </li>
            <li style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#FFFFFF' }}>
              <span style={{ color: '#7CB518', fontSize: '16px' }}>✓</span> 
              <span><strong style={{ color: '#FFFFFF' }}>Recomendadores</strong> <span style={{ color: '#CBD5E1' }}>(Ganancias por tus recomendaciones)</span></span>
            </li>
            <li style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#FFFFFF' }}>
              <span style={{ color: '#7CB518', fontSize: '16px' }}>✓</span> 
              <span><strong style={{ color: '#FFFFFF' }}>Clientes</strong> <span style={{ color: '#CBD5E1' }}>(Ofertas y beneficios)</span></span>
            </li>
          </ul>
        </div>
        <Link href="/afiliados" style={{ display: 'block', textAlign: 'center', backgroundColor: '#7CB518', color: '#FFFFFF', padding: '12px', borderRadius: '8px', fontWeight: '800', fontSize: '14px', textDecoration: 'none', marginTop: '24px', boxShadow: '0 4px 12px rgba(124, 181, 24, 0.3)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          Sumate ahora
        </Link>
      </div>
    </div>
  );
}
