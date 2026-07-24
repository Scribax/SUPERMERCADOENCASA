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

function getIcon(name: string) {
  const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [k, Icon] of Object.entries(ICON_MAP)) {
    if (key.includes(k)) return Icon;
  }
  return Package;
}

interface SidebarCategoriesProps {
  categories: { id: string; name: string; slug: string; icon: string | null }[];
}

export default function SidebarCategories({ categories }: SidebarCategoriesProps) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #F1F5F9' }}>
      <div style={{ backgroundColor: '#0E4FAF', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: '700', fontSize: '15px' }}>
        <span style={{ fontSize: '20px' }}>≡</span>
        <span>Todos los rubros</span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
          {categories.map((cat) => {
            const Icon = getIcon(cat.name);
            return (
              <li key={cat.id}>
                <Link href={`/productos?categoria=${cat.slug}`} style={{ textDecoration: 'none', color: '#475569' }}>
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: '#F1F5F9' }}
                    style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.15s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon size={18} style={{ color: '#94A3B8' }} />
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>{cat.name}</span>
                    </div>
                    <ChevronRight size={16} style={{ color: '#CBD5E1' }} />
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
        <div style={{ backgroundColor: '#EBF5FF', borderRadius: '12px', padding: '16px', border: '1px solid #DBEAFE' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0E4FAF', marginBottom: '4px', lineHeight: '1.3' }}>
            ¿Sos revendedor o recomendador?
          </h4>
          <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '12px' }}>
            Sumate a nuestra red y empezá a ganar
          </p>
          <button style={{ width: '100%', backgroundColor: '#0E4FAF', color: '#FFFFFF', fontSize: '12px', fontWeight: '600', padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
            Más información
          </button>
        </div>
      </div>
    </div>
  );
}
