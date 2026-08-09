'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Loader2, ArrowRight, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface ProductResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  offerPrice: number | null;
  stock: number;
  images: string;
}

export default function LiveSearchModal() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
          setIsOpen(true);
        }
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/productos?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const parseImage = (imagesStr: string) => {
    if (!imagesStr) return '/placeholder.png';
    try {
      const parsed = JSON.parse(imagesStr);
      return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      return imagesStr.split(',')[0] || '/placeholder.png';
    }
  };

  return (
    <div ref={containerRef} style={{ flex: 1, position: 'relative', maxWidth: '520px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setIsOpen(true); }}
            placeholder="Buscar productos, marcas y más..."
            style={{
              width: '100%',
              padding: '10px 36px 10px 16px',
              border: '2px solid #E2E8F0',
              borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#F8FAFC',
              color: '#0F172A',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
              style={{
                position: 'absolute',
                right: '10px',
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#0E4FAF',
            color: '#FFFFFF',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        </button>
      </form>

      {/* DROPDOWN RESULTS */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            border: '1px solid #E2E8F0',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {results.length === 0 && !loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
              No encontramos productos que coincidan con &quot;{query}&quot;
            </div>
          ) : (
            <div>
              <div style={{ padding: '8px 16px', fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9' }}>
                Sugerencias ({results.length})
              </div>
              <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                {results.map((product) => {
                  const hasOffer = product.offerPrice !== null && product.offerPrice < product.price;
                  const finalPrice = hasOffer ? product.offerPrice! : product.price;

                  return (
                    <div
                      key={product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderBottom: '1px solid #F8FAFC',
                        transition: 'background-color 0.15s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                    >
                      <Link
                        href={`/productos/${product.slug}`}
                        onClick={() => setIsOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, textDecoration: 'none', color: 'inherit' }}
                      >
                        <img
                          src={parseImage(product.images)}
                          alt={product.name}
                          style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '6px', backgroundColor: '#F1F5F9' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A', lineHeight: '1.3' }}>
                            {product.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            <span style={{ fontWeight: '700', color: '#0E4FAF', fontSize: '14px' }}>
                              ${finalPrice.toFixed(2)}
                            </span>
                            {hasOffer && (
                              <span style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '12px' }}>
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                      {product.stock > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product as any, 1);
                          }}
                          title="Agregar al carrito"
                          style={{
                            backgroundColor: '#0E4FAF',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          <ShoppingBag size={14} /> + Cart
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <Link
                href={`/productos?search=${encodeURIComponent(query.trim())}`}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  backgroundColor: '#F8FAFC',
                  borderTop: '1px solid #E2E8F0',
                  color: '#0E4FAF',
                  fontWeight: '700',
                  fontSize: '13px',
                  textDecoration: 'none',
                }}
              >
                Ver todos los resultados para &quot;{query}&quot; <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
