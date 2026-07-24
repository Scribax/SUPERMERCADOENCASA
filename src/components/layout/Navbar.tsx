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
    <header
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--card-bg)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 1000,
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Left: Brand Logo & MegaMenu Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '24px',
                fontWeight: '800',
                fontFamily: 'var(--font-primary)',
                color: 'var(--primary)',
                letterSpacing: '-0.5px',
              }}
            >
              Super<span style={{ color: 'var(--success)' }}>encasa</span>
            </span>
          </Link>

          <div
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => setShowMegaMenu(false)}
            style={{ position: 'relative' }}
            className="desktop-nav"
          >
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '600',
                fontSize: '15px',
                color: 'var(--foreground)',
                padding: '8px 0',
              }}
            >
              Categorías <ChevronDown size={16} />
            </button>
            {showMegaMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  width: '240px',
                  padding: '12px 0',
                  zIndex: 100,
                  animation: 'fade-in 0.2s ease',
                }}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/productos?categoria=${cat.slug}`}
                    onClick={() => setShowMegaMenu(false)}
                    style={{
                      display: 'block',
                      padding: '10px 20px',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Search Bar */}
        <div ref={searchRef} style={{ flex: 1, maxWidth: '500px', margin: '0 20px', position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="Buscar marcas, productos y más..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowResults(true);
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                paddingRight: '45px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background-alt)',
                fontSize: '14px',
                transition: 'all var(--transition-fast)',
              }}
              className="search-input"
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--foreground-muted)',
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

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px',
              borderRadius: '50%',
              color: 'var(--foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Cambiar tema"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Favorites */}
          <Link
            href="/cuenta?tab=favoritos"
            style={{
              padding: '8px',
              position: 'relative',
              color: 'var(--foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Mis Favoritos"
          >
            <Heart size={20} />
            {favorites.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '700',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Cart Bag */}
          <button
            onClick={() => setCartOpen(true)}
            style={{
              padding: '8px',
              position: 'relative',
              color: 'var(--foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Ver carrito"
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '700',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* Profile / Account Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setProfileDropdownOpen(true)}
            onMouseLeave={() => setProfileDropdownOpen(false)}
          >
            {user ? (
              <>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                    fontSize: '14px',
                    padding: '8px 0',
                  }}
                >
                  <User size={20} style={{ color: 'var(--primary)' }} />
                  <span className="profile-name">{user.name.split(' ')[0]}</span>
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
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          fontSize: '14px',
                          color: 'var(--foreground)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <LayoutDashboard size={16} /> Panel Admin
                      </Link>
                    )}
                    <Link
                      href="/cuenta"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '14px',
                        color: 'var(--foreground)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <User size={16} /> Mi Perfil
                    </Link>
                    <Link
                      href="/cuenta?tab=pedidos"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '14px',
                        color: 'var(--foreground)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-alt)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <ShoppingCart size={16} /> Mis Pedidos
                    </Link>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '6px 0' }} />
                    <button
                      onClick={logout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '10px 16px',
                        fontSize: '14px',
                        color: 'var(--error)',
                        textAlign: 'left',
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
                  gap: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: 'var(--foreground)',
                }}
              >
                <User size={20} />
                <span className="profile-name">Ingresar</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '8px',
              color: 'var(--foreground)',
              alignItems: 'center',
              justifyContent: 'center',
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
            top: 'var(--header-height)',
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
            style={{ fontWeight: '600', fontSize: '15px' }}
          >
            Ver todos los productos
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: '600', fontSize: '15px' }}
          >
            Recetas y Blog
          </Link>
        </div>
      )}

      {/* Responsive media overrides using global styles */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .desktop-nav { display: block !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .profile-name { display: none !important; }
        }
      `}</style>
    </header>
  );
}
