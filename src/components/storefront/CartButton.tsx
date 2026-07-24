'use client';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center justify-center p-2 text-slate-700 hover:text-[#0E4FAF] transition-colors"
    >
      <ShoppingBag size={24} />
      <span className="absolute -top-1 -right-1 bg-[#74C33D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
        3
      </span>
      <span className="ml-2 hidden md:inline font-medium">Mi carrito</span>
    </motion.button>
  );
}
