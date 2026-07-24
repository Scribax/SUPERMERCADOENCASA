'use client';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div style={{ display: 'flex', width: '100%', maxWidth: '500px', position: 'relative' }}>
      <input
        type="text"
        placeholder="Buscar productos, marcas y más..."
        style={{ width: '100%', border: '1px solid #CBD5E1', borderRight: 'none', borderRadius: '6px 0 0 6px', padding: '8px 16px', outline: 'none', fontSize: '14px', color: '#334155' }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button style={{ backgroundColor: '#0E4FAF', color: '#FFFFFF', padding: '0 16px', borderRadius: '0 6px 6px 0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <Search size={20} />
      </button>
    </div>
  );
}
