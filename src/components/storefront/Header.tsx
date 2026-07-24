'use client';
import LocationSelector from './LocationSelector';
import SearchBar from './SearchBar';
import CartButton from './CartButton';
import { ShoppingCart } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-[1000] bg-white border-b border-slate-200 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ShoppingCart size={28} className="text-[#74C33D]" />
          <div className="flex flex-col">
            <span className="text-xl font-bold">
              <span className="text-[#0E4FAF]">Super</span>
              <span className="text-[#74C33D]">encasa</span>
            </span>
            <span className="text-[10px] text-slate-500 hidden md:block">
              Comprá fácil, recibí en tu casa
            </span>
          </div>
        </div>

        {/* Center Section: Location and Search */}
        <div className="flex-1 flex items-center gap-4 px-4 justify-center">
          <div className="hidden lg:block">
            <LocationSelector />
          </div>
          <SearchBar />
        </div>

        {/* Right Section: Account and Cart */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden md:flex flex-col text-right text-sm">
            <span className="text-slate-500">Bienvenido</span>
            <a href="#" className="font-semibold text-[#0E4FAF] hover:underline">
              Ingresar / Mi cuenta
            </a>
          </div>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
