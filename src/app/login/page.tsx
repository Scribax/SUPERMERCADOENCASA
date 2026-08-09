'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';
import { User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

function LoginContent() {
  const { user, login, register, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const redirectUrl = searchParams.get('redirect') || '/cuenta';

  // Toggle between login and register
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Local loading
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'ADMIN' || user.role === 'EMPLOYEE') {
        router.push('/admin');
      } else {
        router.push(redirectUrl);
      }
    }
  }, [user, loading, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLoginTab && !name)) {
      toast.error('Por favor completá todos los campos.');
      return;
    }

    setSubmitting(true);

    if (isLoginTab) {
      const res = await login(email, password);
      if (res.success) {
        toast.success('¡Sesión iniciada con éxito!');
      } else {
        toast.error(res.error || 'Error al iniciar sesión');
        setSubmitting(false);
      }
    } else {
      const res = await register(name, email, password);
      if (res.success) {
        toast.success('¡Cuenta creada e inicio de sesión exitoso!');
      } else {
        toast.error(res.error || 'Error al crear la cuenta');
        setSubmitting(false);
      }
    }
  };

  if (loading || (user && !submitting)) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h3>Cargando sesión...</h3>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Tabs selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => {
              setIsLoginTab(true);
              setEmail('');
              setPassword('');
            }}
            style={{
              flex: 1,
              padding: '16px',
              fontWeight: '700',
              fontSize: '15px',
              color: isLoginTab ? 'var(--primary)' : 'var(--foreground-muted)',
              backgroundColor: isLoginTab ? 'transparent' : 'var(--background-alt)',
              borderBottom: isLoginTab ? '3px solid var(--primary)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <LogIn size={18} /> Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setEmail('');
              setPassword('');
              setName('');
            }}
            style={{
              flex: 1,
              padding: '16px',
              fontWeight: '700',
              fontSize: '15px',
              color: !isLoginTab ? 'var(--primary)' : 'var(--foreground-muted)',
              backgroundColor: !isLoginTab ? 'transparent' : 'var(--background-alt)',
              borderBottom: !isLoginTab ? '3px solid var(--primary)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <UserPlus size={18} /> Registrarse
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <h2 style={{ fontSize: '22px', fontWeight: '800', textAlign: 'center', color: 'var(--primary)', marginBottom: '8px' }}>
            {isLoginTab ? '¡Hola de nuevo!' : 'Crea tu cuenta gratis'}
          </h2>
          
          {/* Name Field (Signup only) */}
          {!isLoginTab && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Nombre Completo</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLoginTab}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--background)',
                    fontSize: '14px',
                  }}
                />
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-muted)' }} />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--background)',
                  fontSize: '14px',
                }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-muted)' }} />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--background)',
                  fontSize: '14px',
                }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-muted)' }} />
            </div>
            {isLoginTab && (
              <div style={{ textAlign: 'right', marginTop: '6px' }}>
                <Link href="/login/olvide-password" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              backgroundColor: submitting ? 'var(--border)' : 'var(--primary)',
              color: 'white',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '700',
              fontSize: '15px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
              marginTop: '10px',
            }}
          >
            {submitting ? 'Procesando...' : isLoginTab ? 'Ingresar' : 'Registrarme'}
          </button>
        </form>

        {/* Demo credentials notice */}
        {isLoginTab && (
          <div
            style={{
              padding: '15px 20px',
              backgroundColor: 'var(--background-alt)',
              borderTop: '1px solid var(--border-light)',
              fontSize: '12px',
              lineHeight: '1.4',
              color: 'var(--foreground-muted)',
            }}
          >
            <strong>Cuentas de prueba predeterminadas:</strong><br />
            • Administrador: <code style={{ color: 'var(--primary)' }}>admin@superencasa.com</code> / <code style={{ color: 'var(--primary)' }}>admin123</code><br />
            • Cliente Común: <code style={{ color: 'var(--success)' }}>cliente@test.com</code> / <code style={{ color: 'var(--success)' }}>cliente123</code>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '80px', textAlign: 'center' }}>
        <h3>Cargando acceso...</h3>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
