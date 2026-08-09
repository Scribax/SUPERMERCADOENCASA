'use client';
import { useState, useEffect } from 'react';
import { Truck, ShieldCheck, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BENEFITS = [
  { icon: Truck, title: 'Entrega rápida', desc: 'Recibe tu pedido el día y horario elegido.' },
  { icon: ShieldCheck, title: 'Compra segura', desc: 'Cifrado SSL y pasarelas confiables.' },
];

export default function TopBenefits() {
  const [whatsapp, setWhatsapp] = useState('5492923651516');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.config?.whatsapp_number) {
          const raw = data.config.whatsapp_number.replace(/[^0-9]/g, '');
          if (raw) setWhatsapp(raw);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="top-benefits-wrapper" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', width: '100%' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          {BENEFITS.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.icon size={17} color="#74C33D" strokeWidth={1.8} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1E293B', lineHeight: 1.2 }}>{item.title}</span>
                <span style={{ display: 'block', fontSize: '11px', color: '#64748B', lineHeight: 1.2, marginTop: '2px' }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right', lineHeight: 1.2 }}>
            <span style={{ fontSize: '11px', color: '#64748B' }}>¿Necesitas ayuda?</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>Escríbenos por WhatsApp</span>
          </div>
          <motion.a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06, backgroundColor: '#5CB82A' }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '38px', height: '38px', borderRadius: '50%',
              backgroundColor: '#74C33D', color: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, textDecoration: 'none',
              boxShadow: '0 3px 10px rgba(116,195,61,0.3)',
            }}
          >
            <MessageCircle size={18} fill="white" strokeWidth={0} />
          </motion.a>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 991px) {
          .top-benefits-wrapper {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
