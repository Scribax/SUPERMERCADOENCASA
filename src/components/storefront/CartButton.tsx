'use client';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', color: '#334155', cursor: 'pointer', background: 'transparent', border: 'none' }}
    >
      <ShoppingBag size={24} />
      <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#74C33D', color: '#FFFFFF', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '9999px' }}>
        3
      </span>
      <span style={{ marginLeft: '8px', fontWeight: '500' }}>Mi carrito</span>
    </motion.button>
  );
}
