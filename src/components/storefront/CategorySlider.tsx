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
    <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 scrollbar-hide snap-x">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6, scale: 1.05 }}
            className="flex flex-col items-center gap-3 min-w-[100px] cursor-pointer snap-start group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#0E4FAF] group-hover:shadow-md group-hover:border-blue-100 transition-all duration-300">
              <cat.icon size={32} strokeWidth={1.5} />
            </div>
            <span className="text-sm font-medium text-slate-700 text-center leading-tight">
              {cat.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
