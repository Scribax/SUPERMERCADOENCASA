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
    <div style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', borderRight: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#0A2540', color: 'white', padding: '12px 16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>≡</span> Todos los rubros
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
        {categories.map((cat, idx) => (
          <Link key={idx} href={cat.href} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', textDecoration: 'none', color: '#374151', fontSize: '14px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <cat.icon size={18} style={{ marginRight: '12px', color: '#6B7280' }} />
            <span style={{ flex: 1 }}>{cat.name}</span>
            <ChevronRight size={16} style={{ color: '#9CA3AF' }} />
          </Link>
        ))}
      </div>
      <div style={{ margin: '16px', backgroundColor: '#EBF3FC', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
        <Users size={24} style={{ color: '#0A2540', margin: '0 auto 8px' }} />
        <h4 style={{ color: '#0A2540', fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>¿Sos revendedor o recomendador?</h4>
        <p style={{ color: '#4B5563', fontSize: '12px', marginBottom: '12px' }}>Sumate a nuestra red y empezá a ganar</p>
        <Link href="/afiliados" style={{ display: 'block', backgroundColor: '#0A2540', color: 'white', padding: '8px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>
          Más información
        </Link>
      </div>
    </div>
  );
}
