'use client';
import { motion } from 'framer-motion';
import { 
  ShoppingBasket, Wine, Egg, Beef, 
  Apple, Droplets, Smile, Dog, Snowflake
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Almacén', icon: ShoppingBasket },
  { name: 'Bebidas', icon: Wine },
  { name: 'Lácteos', icon: Egg },
  { name: 'Carnes', icon: Beef },
  { name: 'Frutas', icon: Apple },
  { name: 'Limpieza', icon: Droplets },
  { name: 'Perfumería', icon: Smile },
  { name: 'Mascotas', icon: Dog },
  { name: 'Congelados', icon: Snowflake },
];

export default function CategorySlider() {
  return (
    <section style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '24px', paddingBottom: '16px' }}>
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6, scale: 1.05 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '100px', cursor: 'pointer' }}
          >
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0E4FAF' }}>
              <cat.icon size={32} strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#334155', textAlign: 'center', lineHeight: 1.25 }}>
              {cat.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
