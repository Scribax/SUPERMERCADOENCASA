'use client';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/5491112345678"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02, backgroundColor: '#62A933' }}
      whileTap={{ scale: 0.98 }}
      style={{ backgroundColor: '#74C33D', color: '#FFFFFF', padding: '8px 16px', borderRadius: '6px', fontWeight: '500', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', textDecoration: 'none' }}
    >
      <span style={{ fontSize: '18px' }}>🟢</span>
      ¿Necesitás ayuda? Escribinos por WhatsApp
    </motion.a>
  );
}
