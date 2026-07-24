'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/productos?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', alignItems: 'center', maxWidth: '520px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos, marcas y más..."
        style={{ flex: 1, padding: '10px 16px', border: '2px solid #E2E8F0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '14px', outline: 'none', backgroundColor: '#F8FAFC', color: '#0F172A' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#0E4FAF'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; }}
      />
      <button
        type="submit"
        style={{ backgroundColor: '#0E4FAF', color: '#FFFFFF', padding: '10px 16px', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Search size={20} />
      </button>
    </form>
  );
}
