'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setCompleted(true);
        toast.success(data.message);
        setTimeout(() => router.push('/login'), 2500);
      } else {
        toast.error(data.error || 'Error al restablecer la contraseña');
      }
    } catch (e) {
      toast.error('Error de red');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
        <p style={{ color: '#EF4444', fontWeight: '600' }}>Token de recuperación no válido o ausente.</p>
        <Link href="/login/olvide-password" style={{ color: '#0E4FAF', fontWeight: '700' }}>
          Solicitar un nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#0F172A' }}>Nueva Contraseña</h1>
      <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px', lineHeight: 1.4 }}>
        Ingresa tu nueva contraseña para ingresar a tu cuenta de Superencasa.
      </p>

      {completed ? (
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <CheckCircle2 color="#22C55E" size={40} style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#166534', margin: '0 0 6px' }}>¡Contraseña Actualizada!</h3>
          <p style={{ fontSize: '13px', color: '#15803D', margin: 0 }}>
            Redirigiendo al inicio de sesión...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Nueva Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Confirmar Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              backgroundColor: '#74C33D',
              color: '#FFFFFF',
              fontWeight: '800',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              boxShadow: '0 3px 10px rgba(116,195,61,0.3)',
              marginTop: '8px',
            }}
          >
            {submitting ? 'Guardando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container" style={{ maxWidth: '440px', margin: '60px auto', padding: '0 20px' }}>
      <Suspense fallback={<div>Cargando formulario...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
