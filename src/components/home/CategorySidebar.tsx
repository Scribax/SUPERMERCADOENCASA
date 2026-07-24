'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Package, Wine, Egg, Beef, Apple, Sparkles, Heart, PawPrint, Snowflake, Croissant, Home, Tv, Hammer, Users } from 'lucide-react';

const categories = [
  { name: 'Almacén', icon: Package, href: '/productos?categoria=almacen' },
  { name: 'Bebidas', icon: Wine, href: '/productos?categoria=bebidas' },
  { name: 'Lácteos y Huevos', icon: Egg, href: '/productos?categoria=lacteos-y-huevos' },
  { name: 'Carnes y Pescados', icon: Beef, href: '/productos?categoria=carnes-y-pescados' },
  { name: 'Frutas y Verduras', icon: Apple, href: '/productos?categoria=frutas-y-verduras' },
  { name: 'Limpieza y Hogar', icon: Sparkles, href: '/productos?categoria=limpieza-y-hogar' },
  { name: 'Perfumería y Cuidado', icon: Heart, href: '/productos?categoria=perfumeria-y-cuidado' },
  { name: 'Mascotas', icon: PawPrint, href: '/productos?categoria=mascotas' },
  { name: 'Congelados', icon: Snowflake, href: '/productos?categoria=congelados' },
  { name: 'Panadería', icon: Croissant, href: '/productos?categoria=panaderia' },
  { name: 'Bazar y Hogar', icon: Home, href: '/productos?categoria=bazar-y-hogar' },
  { name: 'Electro y Tecnología', icon: Tv, href: '/productos?categoria=electro-y-tecnologia' },
  { name: 'Construcción y Ferretería', icon: Hammer, href: '/productos?categoria=construccion-y-ferreteria' },
];

export default function CategorySidebar() {
  return (
    <div style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%' }}>
      <div style={{ backgroundColor: '#0A2540', color: '#FFFFFF', padding: '14px 18px', fontWeight: '800', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '18px' }}>≡</span> Todos los rubros
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 0', flex: 1, overflowY: 'auto' }}>
        {categories.map((cat, idx) => (
          <Link key={idx} href={cat.href} style={{ display: 'flex', alignItems: 'center', padding: '7px 16px', textDecoration: 'none', color: '#334155', fontSize: '13px', fontWeight: '600', transition: 'all 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0F4C81'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#334155'; }}>
            <cat.icon size={16} style={{ marginRight: '10px', color: '#64748B' }} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span>
            <ChevronRight size={14} style={{ color: '#94A3B8' }} />
          </Link>
        ))}
      </div>
      
      {/* Bottom Promo Card */}
      <div style={{ padding: '14px', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ backgroundColor: '#EBF5FF', border: '1px solid #BFDBFE', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
          <Users size={22} style={{ color: '#0F4C81', margin: '0 auto 6px' }} />
          <h4 style={{ color: '#0F4C81', fontWeight: '800', fontSize: '13px', marginBottom: '4px', lineHeight: 1.2 }}>¿Sos revendedor o recomendador?</h4>
          <p style={{ color: '#475569', fontSize: '11px', marginBottom: '10px', lineHeight: 1.3 }}>Sumate a nuestra red y empezá a ganar</p>
          <Link href="/afiliados" style={{ display: 'block', backgroundColor: '#0F4C81', color: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 2px 6px rgba(15,76,129,0.2)' }}>
            Más información
          </Link>
        </div>
      </div>
    </div>
  );
}
