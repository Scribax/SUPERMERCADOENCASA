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
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all var(--transition-normal)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--border-light)';
        }}
      >
        <Link href={`/productos/${product.slug}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Card Top / Badges */}
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
            {/* Image */}
            <img
              src={product.images.split(',')[0]}
              alt={product.name}
              style={{
                width: '100%',
                height: '180px',
                objectFit: 'cover',
                transition: 'transform var(--transition-slow)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-xs)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {discountPercent}% OFF
              </span>
            )}

            {/* Favorites Icon */}
            <button
              onClick={handleFavoriteToggle}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                color: favorited ? 'var(--error)' : 'var(--foreground-muted)',
                transition: 'transform var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Heart size={16} fill={favorited ? 'var(--error)' : 'none'} />
            </button>

            {/* Quick View Button (Reveals on hover desktop) */}
            <button
              onClick={handleOpenQuickView}
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: 'var(--shadow-md)',
                color: 'var(--foreground)',
              }}
            >
              <Eye size={12} /> Vista rápida
            </button>
          </div>

          {/* Card Middle / Details */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {product.sku}
            </span>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: '600',
                height: '42px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.4',
                color: 'var(--foreground)',
              }}
            >
              {product.name}
            </h3>

            {/* Simulated Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', color: '#FFB300' }}>
                <Star size={12} fill="#FFB300" />
                <Star size={12} fill="#FFB300" />
                <Star size={12} fill="#FFB300" />
                <Star size={12} fill="#FFB300" />
                <Star size={12} fill="#FFB300" />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--foreground-muted)' }}>(5)</span>
            </div>

            {/* Price display */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                ${currentPrice.toFixed(2)}
              </span>
              {product.offerPrice && (
                <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', textDecoration: 'line-through' }}>
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Card Bottom / Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{
            width: '100%',
            backgroundColor: product.stock === 0 ? 'var(--border)' : 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '10px',
            marginTop: '12px',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            if (product.stock > 0) e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
          }}
          onMouseLeave={(e) => {
            if (product.stock > 0) e.currentTarget.style.backgroundColor = 'var(--primary)';
          }}
        >
          <ShoppingCart size={15} />
          {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
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
              backgroundColor: 'var(--card-bg)',
              boxShadow: 'var(--shadow-xl)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              zIndex: 10001,
              animation: 'modal-scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="quickview-modal"
          >
            {/* Close */}
            <button
              onClick={() => setIsQuickViewOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--background-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} />
            </button>

            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
              {/* Left Column: Image */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={product.images.split(',')[0]}
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-md)',
                  }}
                />
              </div>

              {/* Right Column: Info */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>SKU: {product.sku}</span>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', marginTop: '4px', marginBottom: '8px' }}>{product.name}</h2>
                  
                  {/* Prices */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)' }}>
                      ${currentPrice.toFixed(2)}
                    </span>
                    {product.offerPrice && (
                      <span style={{ fontSize: '16px', color: 'var(--foreground-muted)', textDecoration: 'line-through' }}>
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', marginBottom: '20px', lineHeight: '1.6' }}>
                    {product.description}
                  </p>

                  {/* Stock Alert */}
                  <div style={{ fontSize: '13px', marginBottom: '16px' }}>
                    {product.stock > 0 ? (
                      <span style={{ color: 'var(--success)', fontWeight: '600' }}>Stock disponible: {product.stock} unidades</span>
                    ) : (
                      <span style={{ color: 'var(--error)', fontWeight: '600' }}>Sin stock disponible</span>
                    )}
                  </div>
                </div>

                {/* Direct Action */}
                {product.stock > 0 && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Qty Counter */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        style={{ padding: '8px 12px', backgroundColor: 'var(--background-alt)' }}
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{ padding: '0 16px', fontWeight: '600' }}>{qty}</span>
                      <button
                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                        style={{ padding: '8px 12px', backgroundColor: 'var(--background-alt)' }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product, qty);
                        setIsQuickViewOpen(false);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      Añadir al carrito
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
      `}</style>
    </>
  );
}
