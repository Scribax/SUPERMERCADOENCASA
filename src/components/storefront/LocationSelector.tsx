'use client';
import { MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LocationSelector() {
  return (
    <motion.button
      whileHover={{ backgroundColor: '#F1F5F9' }}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '9999px', fontSize: '14px', fontWeight: '500', color: '#334155', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', cursor: 'pointer' }}
    >
      <MapPin size={16} color="#0E4FAF" />
      <span>Enviar a: Pigué</span>
      <ChevronDown size={14} color="#64748B" />
    </motion.button>
  );
}
