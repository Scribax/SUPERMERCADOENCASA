'use client';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function HeroAffiliateCard() {
  return (
    <div style={{ backgroundColor: '#0A192F', borderRadius: '16px', padding: '24px', color: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', border: '1px solid #162A45' }}>
      <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', lineHeight: 1.25, margin: 0, paddingBottom: '16px' }}>
        Comprá, recomendá <br />
        <span style={{ color: '#74C33D' }}>y ganá</span>
      </h3>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <CheckCircle2 color="#74C33D" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={{ fontWeight: '700', display: 'block', margin: 0 }}>Revendedores</span>
            <span style={{ fontSize: '14px', color: '#CBD5E1' }}>Precios mayoristas</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <CheckCircle2 color="#74C33D" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={{ fontWeight: '700', display: 'block', margin: 0 }}>Recomendadores</span>
            <span style={{ fontSize: '14px', color: '#CBD5E1' }}>Ganancias por tus recomendaciones</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <CheckCircle2 color="#74C33D" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={{ fontWeight: '700', display: 'block', margin: 0 }}>Clientes</span>
            <span style={{ fontSize: '14px', color: '#CBD5E1' }}>Ofertas y beneficios</span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ width: '100%', backgroundColor: '#74C33D', color: '#FFFFFF', fontWeight: '700', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
      >
        Sumate ahora
      </motion.button>
    </div>
  );
}
