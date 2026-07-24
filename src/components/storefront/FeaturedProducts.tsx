'use client';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

const PRODUCTS = [
  { id: 1, title: 'Yerba Mate Playadito', presentation: 'Paquete 1 Kg', price: 3450, originalPrice: 4200, discount: '15%', color: 'bg-green-50' },
  { id: 2, title: 'Café Molido La Virginia', presentation: 'Paquete 500 gr', price: 4200, originalPrice: 5100, discount: '20%', color: 'bg-orange-50' },
  { id: 3, title: 'Leche Entera La Serenísima', presentation: 'Sachet 1 L', price: 980, color: 'bg-blue-50' },
  { id: 4, title: 'Galletitas Chocolinas', presentation: 'Paquete 250 gr', price: 890, originalPrice: 1050, discount: '15%', color: 'bg-yellow-50' },
  { id: 5, title: 'Papel Higiénico Elite', presentation: '4 Unidades x 30m', price: 2100, color: 'bg-slate-50' },
];

export default function FeaturedProducts() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            Ofertas <span className="text-[#0E4FAF]">destacadas</span>
          </h2>
          <p className="text-slate-500 mt-1">Los mejores precios para tu hogar</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 text-[#0E4FAF] font-semibold hover:underline">
          Ver todas las ofertas <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
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
      
      <button className="sm:hidden w-full mt-6 flex items-center justify-center gap-2 text-[#0E4FAF] font-semibold bg-blue-50 py-3 rounded-xl border border-blue-100">
        Ver todas las ofertas <ArrowRight size={18} />
      </button>
    </section>
  );
}
