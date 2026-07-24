'use client';
import LocationSelector from './LocationSelector';
import SearchBar from './SearchBar';
import CartButton from './CartButton';
import { ShoppingCart } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-[1000] bg-white border-b border-slate-200 shadow-sm w-full" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', width: '100%' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4" style={{ maxWidth: '1240px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%' }}>
        {/* Logo Section */}
        <div className="flex items-center gap-2 flex-shrink-0" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ backgroundColor: '#74C33D', color: '#FFFFFF', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={22} />
          </div>
          <div className="flex flex-col" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="text-xl font-bold" style={{ fontSize: '22px', fontWeight: '900', lineHeight: 1 }}>
              <span className="text-[#0E4FAF]" style={{ color: '#0E4FAF' }}>Super</span>
              <span className="text-[#74C33D]" style={{ color: '#74C33D' }}>encasa</span>
            </span>
            <span className="text-[10px] text-slate-500 hidden md:block" style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', fontWeight: '500' }}>
              Comprá fácil, recibí en tu casa
            </span>
          </div>
        </div>

        {/* Center Section: Location and Search */}
        <div className="flex-1 flex items-center gap-4 px-4 justify-center" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
          <div className="hidden lg:block">
            <LocationSelector />
          </div>
          <SearchBar />
        </div>

        {/* Right Section: Account and Cart */}
        <div className="flex items-center gap-4 flex-shrink-0" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <div className="hidden md:flex flex-col text-right text-sm" style={{ display: 'flex', flexDirection: 'column', textAlign: 'right', fontSize: '13px' }}>
            <span className="text-slate-500" style={{ color: '#64748B', fontSize: '12px' }}>Bienvenido</span>
            <a href="/cuenta" className="font-semibold text-[#0E4FAF] hover:underline" style={{ color: '#0E4FAF', fontWeight: '700', textDecoration: 'none' }}>
              Ingresar / Mi cuenta
            </a>
          </div>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
