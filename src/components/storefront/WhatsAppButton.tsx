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
      style={{ backgroundColor: '#74C33D', color: '#FFFFFF', padding: '5px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', whiteSpace: 'nowrap', border: 'none' }}
    >
      <span style={{ fontSize: '14px' }}>💬</span>
      Escribinos por WhatsApp
    </motion.a>
  );
}
