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
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #0A3663 0%, #1E5086 100%)', borderRadius: '8px', padding: '40px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
          <h1 style={{ fontSize: '38px', fontWeight: '800', lineHeight: 1.2, marginBottom: '16px' }}>
            Tu supermercado en casa, <span style={{ color: '#7CB518' }}>todos los días</span>
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '30px', lineHeight: 1.5 }}>
            Miles de productos, las mejores marcas y entrega rápida en tu ciudad.
          </p>
          <Link href="/productos" style={{ display: 'inline-block', backgroundColor: '#7CB518', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            Comprar ahora
          </Link>
        </div>
        
        {/* Graphic Image placeholder */}
        <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.3, zIndex: 1 }}>
          <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        </div>

        {/* Bottom Benefit Strip */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '40px', zIndex: 2, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ fontSize: '16px' }}>🚚</span> Envíos gratis (en compras +$25.000)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ fontSize: '16px' }}>🏷️</span> Descuentos (exclusivos online)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ fontSize: '16px' }}>💳</span> Pagá como quieras (Tarjeta, transferencia y más)
          </div>
        </div>
      </div>

      {/* Right: Promo Card */}
      <div style={{ width: '260px', flexShrink: 0, backgroundColor: '#0D233A', borderRadius: '8px', padding: '24px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', lineHeight: 1.3 }}>
            Comprá, recomendá <span style={{ color: '#7CB518' }}>y ganá</span>
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: '#7CB518' }}>✅</span> 
              <span><strong>Revendedores</strong> (Precios mayoristas)</span>
            </li>
            <li style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: '#7CB518' }}>✅</span> 
              <span><strong>Recomendadores</strong> (Ganancias por tus recomendaciones)</span>
            </li>
            <li style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: '#7CB518' }}>✅</span> 
              <span><strong>Clientes</strong> (Ofertas y beneficios)</span>
            </li>
          </ul>
        </div>
        <Link href="/afiliados" style={{ display: 'block', textAlign: 'center', backgroundColor: '#7CB518', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', marginTop: '24px', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
          Sumate ahora
        </Link>
      </div>
    </div>
  );
}
