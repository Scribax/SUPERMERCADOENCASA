'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [phone, setPhone] = useState('5492923651516');
  const [storeName, setStoreName] = useState('Superencasa');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          if (data.config) {
            if (data.config.whatsapp_number) setPhone(data.config.whatsapp_number);
            if (data.config.store_name) setStoreName(data.config.store_name);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchConfig();
  }, []);

  const message = `Hola! Vengo de la tienda online de ${storeName} y quería hacer una consulta.`;
  const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        backgroundColor: '#25D366',
        color: '#FFFFFF',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 999,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
      }}
      className="whatsapp-btn"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      title="Escribinos por WhatsApp"
      id="whatsapp-floating-bubble"
    >
      <MessageCircle size={32} />
    </a>
  );
}
