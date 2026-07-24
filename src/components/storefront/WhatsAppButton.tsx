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
      className="bg-[#74C33D] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 shadow-sm"
    >
      <span className="text-lg">🟢</span>
      ¿Necesitás ayuda? Escribinos por WhatsApp
    </motion.a>
  );
}
