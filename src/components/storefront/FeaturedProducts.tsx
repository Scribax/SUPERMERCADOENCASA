'use client';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

const PRODUCTS = [
  { id: 1, title: 'Yerba Mate Playadito', presentation: 'Paquete 1 Kg', price: 3450, originalPrice: 4200, discount: '15%', color: '#F0FDF4' },
  { id: 2, title: 'Café Molido La Virginia', presentation: 'Paquete 500 gr', price: 4200, originalPrice: 5100, discount: '20%', color: '#FFF7ED' },
  { id: 3, title: 'Leche Entera La Serenísima', presentation: 'Sachet 1 L', price: 980, color: '#EFF6FF' },
  { id: 4, title: 'Galletitas Chocolinas', presentation: 'Paquete 250 gr', price: 890, originalPrice: 1050, discount: '15%', color: '#FEFCE8' },
  { id: 5, title: 'Papel Higiénico Elite', presentation: '4 Unidades x 30m', price: 2100, color: '#F8FAFC' },
];

export default function FeaturedProducts() {
  return (
    <section style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0 }}>
            Ofertas <span style={{ color: '#0E4FAF' }}>destacadas</span>
          </h2>
          <p style={{ color: '#64748B', marginTop: '4px', margin: 0 }}>Los mejores precios para tu hogar</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0E4FAF', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
          Ver todas las ofertas <ArrowRight size={18} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
        {PRODUCTS.map((prod) => (
          <ProductCard 
            key={prod.id}
            title={prod.title}
            presentation={prod.presentation}
            price={prod.price}
            originalPrice={prod.originalPrice}
            discount={prod.discount}
            imagePlaceholderColor={prod.color}
          />
        ))}
      </div>
    </section>
  );
}
