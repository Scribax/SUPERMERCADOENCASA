'use client';
import { MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LocationSelector() {
  return (
    <motion.button
      whileHover={{ backgroundColor: '#F1F5F9' }}
      className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 rounded-full text-sm font-medium text-slate-700 shadow-sm transition-colors"
    >
      <MapPin size={16} className="text-[#0E4FAF]" />
      <span>Enviar a: Pigué</span>
      <ChevronDown size={14} className="text-slate-500" />
    </motion.button>
  );
}
