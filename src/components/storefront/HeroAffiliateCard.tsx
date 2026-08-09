'use client';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

const BENEFITS = [
  { title: 'Revendedores', desc: 'Precios personalizados' },
  { title: 'Recomendadores', desc: 'Ganancias por tus recomendaciones' },
  { title: 'Clientes', desc: 'Ofertas y beneficios' },
];

export default function HeroAffiliateCard() {
  return (
    <div className="hero-affiliate-card-box" style={{
      backgroundColor: '#0F172A',
      borderRadius: '14px',
      padding: '22px 20px',
      color: '#FFFFFF',
      boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
      border: '1px solid #1E293B',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(116,195,61,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Sparkles size={14} color="#74C33D" />
          <span style={{ fontSize: '9px', fontWeight: '700', color: '#74C33D', textTransform: 'uppercase', letterSpacing: '1px' }}>
            PROGRAMA DE AFILIADOS
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: '800',
          marginBottom: '16px',
          lineHeight: 1.25,
          margin: 0,
          paddingBottom: '16px',
          color: '#FFFFFF',
        }}>
          Comprá, recomendá{' '}
          <span style={{ color: '#74C33D' }}>y ganá</span>
        </h3>

        {/* Bullets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
          {BENEFITS.map((item) => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'rgba(116,195,61,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px',
              }}>
                <CheckCircle2 color="#74C33D" size={13} />
              </div>
              <div>
                <span style={{ fontWeight: '700', display: 'block', fontSize: '13px', color: '#FFFFFF', margin: 0 }}>
                  {item.title}
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.3 }}>
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #74C33D 0%, #65B030 100%)',
            color: '#FFFFFF',
            fontWeight: '800',
            padding: '11px 14px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            letterSpacing: '0.3px',
            boxShadow: '0 4px 12px rgba(116,195,61,0.35)',
          }}
        >
          Sumate ahora
        </motion.button>
      </div>

      <style jsx global>{`
        @media (max-width: 991px) {
          .hero-affiliate-card-box {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
