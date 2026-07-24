'use client';
import { motion } from 'framer-motion';
import { 
  ChevronRight, ShoppingBasket, Wine, Egg, Beef, 
  Apple, Droplets, Smile, Dog, Snowflake, 
  Croissant, Home, MonitorSmartphone, Hammer 
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Almacén', icon: ShoppingBasket },
  { name: 'Bebidas', icon: Wine },
  { name: 'Lácteos y Huevos', icon: Egg },
  { name: 'Carnes y Pescados', icon: Beef },
  { name: 'Frutas y Verduras', icon: Apple },
  { name: 'Limpieza y Hogar', icon: Droplets },
  { name: 'Perfumería y Cuidado', icon: Smile },
  { name: 'Mascotas', icon: Dog },
  { name: 'Congelados', icon: Snowflake },
  { name: 'Panadería', icon: Croissant },
  { name: 'Bazar y Hogar', icon: Home },
  { name: 'Electro y Tecnología', icon: MonitorSmartphone },
  { name: 'Construcción y Ferretería', icon: Hammer },
];

export default function SidebarCategories() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #F1F5F9' }}>
      <div style={{ backgroundColor: '#0E4FAF', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: '700' }}>
        <span style={{ fontSize: '20px' }}>≡</span>
        <span>Todos los rubros</span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', listStyle: 'none', margin: 0, padding: 0 }}>
          {CATEGORIES.map((cat, i) => (
            <motion.li
              key={i}
              whileHover={{ x: 4, backgroundColor: '#F1F5F9' }}
              style={{ padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#334155' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <cat.icon size={18} color="#94A3B8" />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{cat.name}</span>
              </div>
              <ChevronRight size={16} color="#CBD5E1" />
            </motion.li>
          ))}
        </ul>
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
        <div style={{ backgroundColor: '#EBF5FF', borderRadius: '12px', padding: '16px', border: '1px solid #DBEAFE' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0E4FAF', marginBottom: '4px', lineHeight: 1.25, margin: 0 }}>
            ¿Sos revendedor o recomendador?
          </h4>
          <p style={{ fontSize: '12px', color: '#475569', marginBottom: '12px', margin: 0, marginTop: '4px' }}>
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
