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
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full border border-slate-100">
      <div className="bg-[#0E4FAF] px-4 py-3 flex items-center gap-2 text-white font-bold">
        <span className="text-xl">≡</span>
        <span>Todos los rubros</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        <ul className="flex flex-col">
          {CATEGORIES.map((cat, i) => (
            <motion.li
              key={i}
              whileHover={{ x: 4, backgroundColor: '#F1F5F9' }}
              className="px-4 py-2 cursor-pointer flex items-center justify-between text-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <cat.icon size={18} className="text-slate-400" />
                <span className="text-sm font-medium">{cat.name}</span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="bg-[#EBF5FF] rounded-xl p-4 border border-blue-100">
          <h4 className="text-sm font-bold text-[#0E4FAF] mb-1 leading-tight">
            ¿Sos revendedor o recomendador?
          </h4>
          <p className="text-xs text-slate-600 mb-3">
            Sumate a nuestra red y empezá a ganar
          </p>
          <button className="w-full bg-[#0E4FAF] hover:bg-[#1662C9] text-white text-xs font-semibold py-2 rounded-md transition-colors">
            Más información
          </button>
        </div>
      </div>
    </div>
  );
}
