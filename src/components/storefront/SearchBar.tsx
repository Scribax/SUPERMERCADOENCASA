'use client';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div className="flex w-full max-w-lg relative group">
      <input
        type="text"
        placeholder="Buscar productos, marcas y más..."
        className="w-full border border-slate-300 rounded-l-md px-4 py-2 outline-none focus:border-[#0E4FAF] focus:ring-1 focus:ring-[#0E4FAF]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="bg-[#0E4FAF] text-white px-4 rounded-r-md flex items-center justify-center hover:bg-[#1662C9] transition-colors">
        <Search size={20} />
      </button>
    </div>
  );
}
