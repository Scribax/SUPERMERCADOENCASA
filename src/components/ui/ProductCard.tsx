'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart, Product } from '@/hooks/useCart';
import { Heart, ShoppingCart, Eye, Star, Plus, Minus, X } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const favorited = isFavorite(product.id);
  const discountPercent = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  const currentPrice = product.offerPrice !== null && product.offerPrice !== undefined ? product.offerPrice : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div
        className="product-card"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '0',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'all 0.25s ease',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
          e.currentTarget.style.borderColor = '#CBD5E1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
          e.currentTarget.style.borderColor = '#E2E8F0';
        }}
      >
        <Link href={`/productos/${product.slug}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Card Top / Image + Badges */}
          <div style={{ position: 'relative', overflow: 'hidden', height: '190px' }}>
            <img
              src={product.images.split(',')[0]}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />

            {/* Discount Badge - naranja destacado */}
            {discountPercent > 0 && (
              <span style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '800',
                padding: '5px 10px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(239,68,68,0.35)',
                letterSpacing: '0.3px',
              }}>
                -{discountPercent}% OFF
              </span>
            )}

            {/* Nuevo Badge */}
            {discountPercent === 0 && product.stock > 0 && (
              <span style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: '#10B981',
                color: 'white',
                fontSize: '11px',
                fontWeight: '800',
                padding: '4px 8px',
                borderRadius: '6px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}>
                Nuevo
              </span>
            )}

            {/* Out of stock overlay */}
            {product.stock === 0 && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: 'rgba(0,0,0,0.75)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '6px',
              }}>
                Sin stock
              </div>
            )}

            {/* Favorites Icon */}
            <button
              onClick={handleFavoriteToggle}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: '1px solid #E2E8F0',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                color: favorited ? '#EF4444' : '#94A3B8',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Heart size={16} fill={favorited ? '#EF4444' : 'none'} />
            </button>

            {/* Quick View */}
            <button
              onClick={handleOpenQuickView}
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '5px 14px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                color: '#475569',
              }}
            >
              <Eye size={12} /> Vista rápida
            </button>
          </div>

          {/* Card Body */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 14px', gap: '6px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              height: '36px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.35',
              color: '#1E293B',
              margin: 0,
            }}>
              {product.name}
            </h3>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', color: '#F59E0B' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={11} fill="#F59E0B" />)}
              </div>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>(5)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto' }}>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#0E4FAF' }}>
                ${currentPrice.toLocaleString('es-AR')}
              </span>
              {product.offerPrice && (
                <span style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'line-through' }}>
                  ${product.price.toLocaleString('es-AR')}
                </span>
              )}
            </div>

            {/* Installments hint */}
            <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: '600' }}>
              {product.offerPrice ? '¡Oferta por tiempo limitado!' : '3 cuotas sin interés'}
            </span>
          </div>
        </Link>

        {/* Add to Cart Button */}
        <div style={{ padding: '0 14px 14px' }}>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              width: '100%',
              backgroundColor: product.stock === 0 ? '#CBD5E1' : '#0E4FAF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              if (product.stock > 0) {
                e.currentTarget.style.backgroundColor = '#1565C0';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (product.stock > 0) {
                e.currentTarget.style.backgroundColor = '#0E4FAF';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <ShoppingCart size={15} />
            {product.stock === 0 ? 'Sin stock' : 'Agregar'}
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <>
          <div
            onClick={() => setIsQuickViewOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '800px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              borderRadius: '16px',
              padding: '28px',
              zIndex: 10001,
            }}
            className="quickview-modal"
          >
            <button
              onClick={() => setIsQuickViewOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '6px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={product.images.split(',')[0]}
                  alt={product.name}
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '12px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>SKU: {product.sku}</span>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', marginTop: '4px', marginBottom: '8px' }}>{product.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#0E4FAF' }}>
                      ${currentPrice.toLocaleString('es-AR')}
                    </span>
                    {product.offerPrice && (
                      <span style={{ fontSize: '16px', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ${product.price.toLocaleString('es-AR')}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px', lineHeight: '1.6' }}>
                    {product.description}
                  </p>
                  <div style={{ fontSize: '13px', marginBottom: '16px' }}>
                    {product.stock > 0 ? (
                      <span style={{ color: '#22C55E', fontWeight: '600' }}>Stock disponible: {product.stock} unidades</span>
                    ) : (
                      <span style={{ color: '#EF4444', fontWeight: '600' }}>Sin stock disponible</span>
                    )}
                  </div>
                </div>
                {product.stock > 0 && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                      <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '8px 12px', backgroundColor: '#F8FAFC', border: 'none', cursor: 'pointer' }}>
                        <Minus size={16} />
                      </button>
                      <span style={{ padding: '0 16px', fontWeight: '600' }}>{qty}</span>
                      <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ padding: '8px 12px', backgroundColor: '#F8FAFC', border: 'none', cursor: 'pointer' }}>
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => { addToCart(product, qty); setIsQuickViewOpen(false); }}
                      style={{
                        flex: 1,
                        backgroundColor: '#0E4FAF',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes modal-scale-up {
          from { transform: translate(-50%, -40%) scale(0.95); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .quickview-modal {
          animation: modal-scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}
