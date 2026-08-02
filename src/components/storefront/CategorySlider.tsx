'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBasket, Wine, Egg, Beef, Apple, Droplets, Smile, Dog, Snowflake, Croissant, Home, MonitorSmartphone, Hammer, Package } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  'almacen': ShoppingBasket,
  'bebidas': Wine,
  'lacteos': Egg,
  'carnes': Beef,
  'frutas': Apple,
  'limpieza': Droplets,
  'perfumeria': Smile,
  'mascotas': Dog,
  'congelados': Snowflake,
  'panaderia': Croissant,
  'bazar': Home,
  'electro': MonitorSmartphone,
  'ferreteria': Hammer,
};

const ICON_COLORS: Record<string, string> = {
  'almacen': '#D97706',
  'bebidas': '#DC2626',
  'lacteos': '#F59E0B',
  'carnes': '#EF4444',
  'frutas': '#22C55E',
  'limpieza': '#3B82F6',
  'perfumeria': '#EC4899',
  'mascotas': '#8B5CF6',
  'congelados': '#06B6D4',
  'panaderia': '#D97706',
  'bazar': '#6366F1',
  'electro': '#0EA5E9',
  'ferreteria': '#78716C',
};

function getIcon(name: string) {
  const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [k, Icon] of Object.entries(ICON_MAP)) {
    if (key.includes(k)) return Icon;
  }
  return Package;
}

function getIconColor(name: string): string {
  const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [k, color] of Object.entries(ICON_COLORS)) {
    if (key.includes(k)) return color;
  }
  return '#94A3B8';
}

interface CategorySliderProps {
  categories: { id: string; name: string; slug: string; icon: string | null }[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  return (
    <section style={{ padding: '8px 0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B', margin: 0 }}>
          Comprá por rubro
        </h2>
        <Link
          href="/productos"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#0E4FAF',
            fontWeight: '700',
            textDecoration: 'none',
            fontSize: '13px',
          }}
        >
          Ver todas las ofertas <ArrowRight size={16} />
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
        gap: '8px',
      }}>
        {categories.map((cat) => {
          const Icon = getIcon(cat.name);
          const color = getIconColor(cat.name);
          return (
            <Link key={cat.id} href={`/productos?categoria=${cat.slug}`} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ y: -6, scale: 1.06 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '8px 4px',
                }}
              >
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: `${color}12`,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  border: `1.5px solid ${color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                }}>
                  <Icon size={30} strokeWidth={1.5} style={{ color }} />
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#475569',
                  textAlign: 'center',
                  lineHeight: '1.3',
                  maxWidth: '88px',
                }}>
                  {cat.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
