'use client';
import React from 'react';
import Link from 'next/link';

const circleCategories = [
  { name: 'Almacén', icon: '🧺', href: '/productos?categoria=almacen' },
  { name: 'Bebidas', icon: '🍾', href: '/productos?categoria=bebidas' },
  { name: 'Lácteos y Huevos', icon: '🥛', href: '/productos?categoria=lacteos-y-huevos' },
  { name: 'Carnes y Pescados', icon: '🥩', href: '/productos?categoria=carnes-y-pescados' },
  { name: 'Frutas y Verduras', icon: '🍎', href: '/productos?categoria=frutas-y-verduras' },
  { name: 'Limpieza y Hogar', icon: '🧹', href: '/productos?categoria=limpieza-y-hogar' },
  { name: 'Perfumería y Cuidado', icon: '🧴', href: '/productos?categoria=perfumeria-y-cuidado' },
  { name: 'Mascotas', icon: '🐾', href: '/productos?categoria=mascotas' },
  { name: 'Congelados', icon: '❄️', href: '/productos?categoria=congelados' },
  { name: 'Panadería', icon: '🥖', href: '/productos?categoria=panaderia' },
  { name: 'Bazar y Hogar', icon: '🏠', href: '/productos?categoria=bazar-y-hogar' },
  { name: 'Electro y Tecnología', icon: '📺', href: '/productos?categoria=electro-y-tecnologia' },
  { name: 'Construcción y Ferretería', icon: '🛠️', href: '/productos?categoria=construccion-y-ferreteria' },
];

export default function CircleCategories() {
  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '40px' }}>
      <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {circleCategories.map((cat, idx) => (
          <Link key={idx} href={cat.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textDecoration: 'none', minWidth: '90px' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: '1px solid #F3F4F6', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'; }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
