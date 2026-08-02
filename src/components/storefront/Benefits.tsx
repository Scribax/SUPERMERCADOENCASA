'use client';
import { useState, useEffect } from 'react';
import { Users, Store, Tag, ShieldCheck } from 'lucide-react';

const ICONS = [Users, Store, Tag, ShieldCheck];

export default function Benefits() {
  const [items, setItems] = useState([
    { title: 'Miles de clientes', desc: 'ya confían en nosotros' },
    { title: 'Comercios locales', desc: 'productos de tu zona' },
    { title: 'Precios justos', desc: 'ofertas todos los días' },
    { title: '100% seguro', desc: 'datos protegidos' },
  ]);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.config) {
          const c = data.config;
          setItems([
            { title: c.benefits_1_title || items[0].title, desc: c.benefits_1_desc || items[0].desc },
            { title: c.benefits_2_title || items[1].title, desc: c.benefits_2_desc || items[1].desc },
            { title: c.benefits_3_title || items[2].title, desc: c.benefits_3_desc || items[2].desc },
            { title: c.benefits_4_title || items[3].title, desc: c.benefits_4_desc || items[3].desc },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section style={{ padding: '40px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {items.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <div key={i} style={{
              backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '20px 16px',
              border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px',
            }}>
              <div style={{ width: '52px', height: '52px', backgroundColor: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color="#74C33D" strokeWidth={1.8} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', color: '#1E293B', fontSize: '15px', margin: '0 0 2px' }}>{item.title}</h4>
                <p style={{ color: '#94A3B8', fontSize: '12px', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
