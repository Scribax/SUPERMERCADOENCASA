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
    <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BENEFITS.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-[#F4F9F1] rounded-full flex items-center justify-center mb-4">
              <item.icon size={28} className="text-[#74C33D]" />
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h4>
            <p className="text-slate-500 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
