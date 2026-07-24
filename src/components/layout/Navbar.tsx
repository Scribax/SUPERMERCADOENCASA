'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Search, ShoppingBag, Heart, User, Sun, Moon, LogOut, LayoutDashboard, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart, favorites, setCartOpen, addToCart } = useCart();
  const router = useRouter();

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Category States
  const [categories, setCategories] = useState<any[]>([]);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  // Theme State
  const [theme, setTheme] = useState('light');

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profile dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('superencasa_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('superencasa_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Fetch categories & handle click outside search
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Predictive search query trigger
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.products || []);
          setShowResults(true);
        }
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowResults(false);
    router.push(`/productos?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleResultClick = (slug: string) => {
    setShowResults(false);
    setSearchQuery('');
    router.push(`/productos/${slug}`);
  };

  return (
    <>
      {/* Top Benefit Strip */}
      <div style={{ backgroundColor: '#F4F9F1', borderBottom: '1px solid #E5E7EB', fontSize: '12px', padding: '8px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
              <span style={{ fontSize: '14px' }}>🚚</span> <strong>Entrega rápida:</strong> Recibí tu pedido el día y horario elegido.
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
              <span style={{ fontSize: '14px' }}>🛡️</span> <strong>Compra segura:</strong> Cifrado SSL y pasarelas de pago confiables.
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
              <span style={{ fontSize: '14px' }}>🎧</span> <strong>Atención personalizada:</strong> Soporte directo por WhatsApp y email.
            </span>
          </div>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#7CB518', color: 'white', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none' }}>
            🟢 ¿Necesitás ayuda? Escribinos por WhatsApp
          </a>
        </div>
      </div>

      <header
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          padding: '16px 0',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          
          {/* Logo & Tagline */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#7CB518', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={24} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#0A2540', lineHeight: 1 }}>
                Super<span style={{ color: '#7CB518' }}>encasa</span>
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500', marginTop: '2px' }}>
                Comprá fácil, recibí en tu casa
              </div>
            </div>
          </Link>

          {/* Locality Selector */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#334155', cursor: 'pointer', backgroundColor: '#F1F5F9', padding: '8px 14px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '14px' }}>📍</span>
            <span>Enviar a: <strong style={{ color: '#0F4C81' }}>Pigué</strong></span>
            <ChevronDown size={14} style={{ color: '#64748B' }} />
          </div>

          {/* Search Bar */}
          <div ref={searchRef} style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%', height: '42px' }}>
              <input
                type="text"
                placeholder="Buscar marcas, productos y más..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowResults(true);
                }}
                style={{
                  flex: 1,
                  padding: '0 16px',
                  border: '1px solid #CBD5E1',
                  borderRight: 'none',
                  borderRadius: '8px 0 0 8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#0F4C81',
                  color: '#FFFFFF',
                  padding: '0 22px',
                  border: 'none',
                  borderRadius: '0 8px 8px 0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Search size={18} />
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px',
                  zIndex: 110,
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}
              >
                {searchResults.map((product) => {
                  const price = product.offerPrice !== null ? product.offerPrice : product.price;
                  return (
                    <div
                      key={product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      onClick={() => handleResultClick(product.slug)}
                    >
                      <img
                        src={product.images.split(',')[0]}
                        alt={product.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-xs)',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.name}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                          {product.category?.name}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                          ${price.toFixed(2)}
                        </span>
                        {/* Direct Add Shortcut */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                          style={{
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-xs)',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* User & Cart Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            
            {/* User Account */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              {user ? (
                <>
                  <button
                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <User size={24} style={{ color: '#0A2540' }} />
                    <div className="profile-name">
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>Bienvenido</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0A2540' }}>{user.name.split(' ')[0]}</div>
                    </div>
                    <ChevronDown size={14} style={{ color: '#6B7280' }} />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-lg)',
                        width: '200px',
                        padding: '8px 0',
                        zIndex: 100,
                        animation: 'fade-in 0.2s ease',
                      }}
                    >
                      {(user.role === 'ADMIN' || user.role === 'EMPLOYEE') && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: 'var(--foreground)',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <LayoutDashboard size={16} /> Panel Admin
                        </Link>
                      )}
                      <Link
                        href="/cuenta"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          fontSize: '14px',
                          color: 'var(--foreground)',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <User size={16} /> Mi Perfil
                      </Link>
                      <Link
                        href="/cuenta?tab=pedidos"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          fontSize: '14px',
                          color: 'var(--foreground)',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <ShoppingCart size={16} /> Mis Pedidos
                      </Link>
                      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '6px 0' }} />
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          width: '100%',
                          padding: '10px 16px',
                          fontSize: '14px',
                          color: 'var(--error)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <LogOut size={16} /> Cerrar Sesión
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none'
                  }}
                >
                  <User size={24} style={{ color: '#0A2540' }} />
                  <div className="profile-name">
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>Ingresar</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0A2540' }}>Mi cuenta</div>
                  </div>
                </Link>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={24} style={{ color: '#0A2540' }} />
                {cart.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: '#7CB518',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '700',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
              <div className="profile-name">
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0A2540' }}>Mi carrito</div>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                padding: '8px',
                color: 'var(--foreground)',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
              }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'var(--card-bg)',
              borderBottom: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              zIndex: 999,
            }}
            className="mobile-menu"
          >
            <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--foreground-muted)' }}>Categorías</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/productos?categoria=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '14px',
                    backgroundColor: 'var(--background-alt)',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: 'var(--foreground)'
                  }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
            <Link
              href="/productos"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: '600', fontSize: '15px', textDecoration: 'none', color: 'var(--foreground)' }}
            >
              Ver todos los productos
            </Link>
          </div>
        )}

        {/* Responsive media overrides using global styles */}
        <style jsx global>{`
          @media (min-width: 768px) {
            .mobile-menu-btn { display: none !important; }
          }
          @media (max-width: 767px) {
            .profile-name { display: none !important; }
          }
        `}</style>
      </header>
    </>
  );
}
