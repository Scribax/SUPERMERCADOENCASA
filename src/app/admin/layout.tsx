'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Tags, Percent, Settings, Bookmark, LogOut, ArrowLeft, Loader2, Home, Image as ImageIcon } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE'))) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <Loader2 className="animate-spin" size={32} />
        <span>Verificando permisos de administración...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Admin Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--card-bg)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 10,
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>
            Super<span style={{ color: 'var(--success)' }}>Panel</span>
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Rol: {user.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
          </span>
        </div>

        {/* Sidebar Links */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            href="/admin"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--foreground)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            href="/admin/pedidos"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--foreground)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ShoppingBag size={18} /> Pedidos
          </Link>
          <Link
            href="/admin/productos"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--foreground)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ShoppingCart size={18} /> Productos
          </Link>
          <Link
            href="/admin/categorias"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--foreground)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Bookmark size={18} /> Categorías
          </Link>
          <Link
            href="/admin/marcas"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--foreground)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Tags size={18} /> Marcas
          </Link>
          <Link
            href="/admin/cupones"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--foreground)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Percent size={18} /> Cupones
          </Link>
          <Link
            href="/admin/promociones"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--foreground)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Percent size={18} /> Promociones
          </Link>
          <Link
            href="/admin/banners"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--foreground)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ImageIcon size={18} /> Banners
          </Link>
          <Link
            href="/admin/config"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--foreground)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Settings size={18} /> Configuración
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            href="/"
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--foreground-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Home size={16} /> Ir a la tienda
          </Link>
          <button
            onClick={logout}
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'left',
            }}
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Admin Work Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', height: '100vh' }}>{children}</main>
    </div>
  );
}
