'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBasket, Wine, Egg, Beef, Apple, Droplets, Smile, Dog, Snowflake, Croissant, Home, MonitorSmartphone, Hammer, Package } from 'lucide-react';

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

interface CategorySliderProps {
  categories: { id: string; name: string; slug: string; icon: string | null }[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  return (
    <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 16px 16px' }}>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '24px', paddingBottom: '16px' }}>
        {categories.map((cat) => {
          const Icon = getIcon(cat.name);
          return (
            <Link key={cat.id} href={`/productos?categoria=${cat.slug}`} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ y: -6, scale: 1.05 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', minWidth: '90px', cursor: 'pointer' }}
              >
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0E4FAF', transition: 'all 0.3s' }}>
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#475569', textAlign: 'center', lineHeight: '1.3' }}>
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
