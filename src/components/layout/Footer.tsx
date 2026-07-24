'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+54 9 11 2233-4455');
  const [supportEmail, setSupportEmail] = useState('soporte@superencasa.com');
  const [hours, setHours] = useState('Lunes a Sábado de 08:00 a 21:00 hs');
  const [categories, setCategories] = useState<any[]>([]);

  const toast = useToast();

  useEffect(() => {
    const fetchConfigAndCategories = async () => {
      try {
        const [configRes, catRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/categories'),
        ]);

        if (configRes.ok) {
          const data = await configRes.json();
          if (data.config) {
            if (data.config.whatsapp_number) setPhone(data.config.whatsapp_number);
            if (data.config.support_email) setSupportEmail(data.config.support_email);
            if (data.config.business_hours) setHours(data.config.business_hours);
          }
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.categories) {
            setCategories(catData.categories.slice(0, 5));
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchConfigAndCategories();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate signup
    toast.success('¡Gracias por suscribirte a nuestro Newsletter!');
    setEmail('');
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--background-alt)',
        borderTop: '1px solid var(--border)',
        paddingTop: '60px',
        paddingBottom: '30px',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        {/* Newsletter & Top section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginBottom: '50px',
            paddingBottom: '40px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Superencasa</h3>
            <p style={{ color: 'var(--foreground-muted)', maxWidth: '400px' }}>
              Tu supermercado 100% online. Productos frescos y de almacén, entregados con amor directo a tu domicilio.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '15px' }}>Suscribite a nuestras ofertas</h4>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="email"
                placeholder="Ingresá tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontSize: '14px',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600',
                }}
              >
                Unirse <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Links & Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '50px',
          }}
        >
          {/* Col 1: Links */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Navegación</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link href="/" style={{ color: 'var(--foreground-muted)' }}>Inicio</Link></li>
              <li><Link href="/productos" style={{ color: 'var(--foreground-muted)' }}>Productos</Link></li>
              <li><Link href="/blog" style={{ color: 'var(--foreground-muted)' }}>Recetas & Blog</Link></li>
              <li><Link href="/cuenta" style={{ color: 'var(--foreground-muted)' }}>Mi Cuenta</Link></li>
            </ul>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Categorías</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/productos?categoria=${cat.slug}`} style={{ color: 'var(--foreground-muted)' }}>
                    {cat.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <>
                  <li><Link href="/productos?categoria=almacen" style={{ color: 'var(--foreground-muted)' }}>Almacén</Link></li>
                  <li><Link href="/productos?categoria=bebidas" style={{ color: 'var(--foreground-muted)' }}>Bebidas</Link></li>
                  <li><Link href="/productos?categoria=frutas-y-verduras" style={{ color: 'var(--foreground-muted)' }}>Frutas y Verduras</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Contacto</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--foreground-muted)' }}>
                <Phone size={18} style={{ color: 'var(--primary)' }} />
                <span>{phone}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--foreground-muted)' }}>
                <Mail size={18} style={{ color: 'var(--primary)' }} />
                <span>{supportEmail}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--foreground-muted)' }}>
                <MapPin size={18} style={{ color: 'var(--primary)' }} />
                <span>Envío a domicilio en CABA y GBA</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Hours & Payments */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Horarios de Atención</h5>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--foreground-muted)', marginBottom: '25px' }}>
              <Clock size={18} style={{ color: 'var(--primary)' }} />
              <span>{hours}</span>
            </div>
            <h5 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>Medios de Pago</h5>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Mercado Pago', 'Transferencia', 'Efectivo'].map((method) => (
                <span
                  key={method}
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '4px 8px',
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--foreground-muted)',
                  }}
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            textAlign: 'center',
            paddingTop: '30px',
            borderTop: '1px solid var(--border)',
            color: 'var(--foreground-muted)',
            fontSize: '14px',
          }}
        >
          <p>© {new Date().getFullYear()} Superencasa. Todos los derechos reservados. Desarrollado con tecnología de producción.</p>
        </div>
      </div>
    </footer>
  );
}
