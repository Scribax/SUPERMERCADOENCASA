'use client';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function HeroAffiliateCard() {
  return (
    <div className="bg-[#0A192F] rounded-2xl p-6 text-white h-full flex flex-col shadow-lg border border-[#162A45]">
      <h3 className="text-2xl font-bold mb-4 leading-tight">
        Comprá, recomendá <br />
        <span className="text-[#74C33D]">y ganá</span>
      </h3>
      
      <div className="flex-1 space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-[#74C33D] shrink-0 mt-0.5" size={20} />
          <div>
            <span className="font-bold block">Revendedores</span>
            <span className="text-sm text-slate-300">Precios mayoristas</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-[#74C33D] shrink-0 mt-0.5" size={20} />
          <div>
            <span className="font-bold block">Recomendadores</span>
            <span className="text-sm text-slate-300">Ganancias por tus recomendaciones</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-[#74C33D] shrink-0 mt-0.5" size={20} />
          <div>
            <span className="font-bold block">Clientes</span>
            <span className="text-sm text-slate-300">Ofertas y beneficios</span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[#74C33D] hover:bg-[#62A933] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
      >
        Sumate ahora
      </motion.button>
    </div>
  );
}
