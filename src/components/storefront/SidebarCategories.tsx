'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingBasket, Wine, Egg, Beef, Apple, Droplets, Smile, Dog, Snowflake, Croissant, Home, MonitorSmartphone, Hammer, Package } from 'lucide-react';

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

interface SidebarCategoriesProps {
  categories: { id: string; name: string; slug: string; icon: string | null }[];
}

export default function SidebarCategories({ categories }: SidebarCategoriesProps) {
  return (
    <div className="sidebar-categories-box" style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #E2E8F0',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0E4FAF 0%, #1565C0 100%)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: '14px',
        letterSpacing: '0.3px',
      }}>
        <span style={{ fontSize: '18px', lineHeight: 1 }}>☰</span>
        <span>Todos los rubros</span>
      </div>

      {/* Lista de categorías con scroll */}
      <div style={{ padding: '4px 0', maxHeight: '390px', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
          {categories.map((cat) => {
            const Icon = getIcon(cat.name);
            const color = getIconColor(cat.name);
            return (
              <li key={cat.id}>
                <Link href={`/productos?categoria=${cat.slug}`} style={{ textDecoration: 'none', color: '#334155' }}>
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: '#F1F5F9' }}
                    style={{
                      padding: '9px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.15s',
                      borderLeft: '3px solid transparent',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        backgroundColor: `${color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon size={15} style={{ color }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600' }}>{cat.name}</span>
                    </div>
                    <ChevronRight size={14} style={{ color: '#CBD5E1' }} />
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Caja Revendedor */}
      <div style={{ padding: '12px', borderTop: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
        <div style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          borderRadius: '10px',
          padding: '14px',
          border: '1px solid #BFDBFE',
          textAlign: 'center',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#0E4FAF',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px',
            fontSize: '16px',
          }}>
            💰
          </div>
          <h4 style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#0E4FAF',
            marginBottom: '4px',
            lineHeight: 1.3,
            margin: 0,
            paddingBottom: '4px',
          }}>
            ¿Sos revendedor?
          </h4>
          <p style={{
            fontSize: '10px',
            color: '#64748B',
            marginBottom: '10px',
            lineHeight: 1.3,
          }}>
            Sumate y empezá a ganar
          </p>
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0E4FAF 0%, #1565C0 100%)',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '700',
            padding: '8px 12px',
            borderRadius: '7px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(14, 79, 175, 0.3)',
          }}>
            Sumate ahora
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 991px) {
          .sidebar-categories-box {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
