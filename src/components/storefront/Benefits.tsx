'use client';
import { Users, Store, Tag, ShieldCheck } from 'lucide-react';

const BENEFITS = [
  {
    icon: Users,
    title: 'Miles de clientes',
    description: 'ya confían en Superencasa',
  },
  {
    icon: Store,
    title: 'Comercios locales',
    description: 'vendé tus productos online',
  },
  {
    icon: Tag,
    title: 'Precios justos',
    description: 'ofertas todos los días',
  },
  {
    icon: ShieldCheck,
    title: '100% seguro',
    description: 'tus datos siempre protegidos',
  },
];

export default function Benefits() {
  return (
    <section style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '48px 16px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {BENEFITS.map((item, i) => (
          <div key={i} style={{ flex: '1 1 250px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: '#F4F9F1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <item.icon size={28} color="#74C33D" />
            </div>
            <h4 style={{ fontWeight: '700', color: '#1E293B', fontSize: '18px', marginBottom: '4px' }}>{item.title}</h4>
            <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
