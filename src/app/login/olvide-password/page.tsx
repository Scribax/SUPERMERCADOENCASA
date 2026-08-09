'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast.success('Solicitud enviada correctamente');
      } else {
        toast.error(data.error || 'Error al procesar la solicitud');
      }
    } catch (e) {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px', margin: '60px auto', padding: '0 20px' }}>
      <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '14px', textDecoration: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Volver al Login
      </Link>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#0F172A' }}>Recuperar Contraseña</h1>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px', lineHeight: 1.4 }}>
          Ingresa tu dirección de correo electrónico registrada y te enviaremos un enlace seguro para restablecer tu clave.
        </p>

        {submitted ? (
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <CheckCircle2 color="#22C55E" size={40} style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#166534', margin: '0 0 6px' }}>¡Correo Enviado!</h3>
            <p style={{ fontSize: '13px', color: '#15803D', margin: 0, lineHeight: 1.4 }}>
              Revisa tu bandeja de entrada en <strong>{email}</strong> y sigue las instrucciones para crear tu nueva contraseña.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                backgroundColor: '#0E4FAF',
                color: '#FFFFFF',
                fontWeight: '700',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                boxShadow: '0 3px 10px rgba(14,79,175,0.25)',
              }}
            >
              {submitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
