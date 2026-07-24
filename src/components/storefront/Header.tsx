'use client';
import LocationSelector from './LocationSelector';
import SearchBar from './SearchBar';
import CartButton from './CartButton';
import { ShoppingCart } from 'lucide-react';

export default function Header() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', width: '100%' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ backgroundColor: '#74C33D', color: '#FFFFFF', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '22px', fontWeight: '900', lineHeight: 1 }}>
              <span style={{ color: '#0E4FAF' }}>Super</span>
              <span style={{ color: '#74C33D' }}>encasa</span>
            </span>
            <span style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', fontWeight: '500' }}>
              Comprá fácil, recibí en tu casa
            </span>
          </div>
        </div>

        {/* Center Section: Location and Search */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', minWidth: '300px' }}>
          <div>
            <LocationSelector />
          </div>
          <SearchBar />
        </div>

        {/* Right Section: Account and Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right', fontSize: '13px' }}>
            <span style={{ color: '#64748B', fontSize: '12px' }}>Bienvenido</span>
            <a href="/cuenta" style={{ color: '#0E4FAF', fontWeight: '700', textDecoration: 'none' }}>
              Ingresar / Mi cuenta
            </a>
          </div>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
