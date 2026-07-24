'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { X, Plus, Minus, Trash2, ShoppingBag, Truck, Tag } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    promoDiscount,
    couponDiscount,
    shippingCost,
    freeShippingThreshold,
    coupon,
    applyCoupon,
    removeCoupon,
    total,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    setApplying(true);
    await applyCoupon(couponInput);
    setApplying(false);
    setCouponInput('');
  };

  const handleCheckoutRedirect = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  // Progress for free shipping
  const totalBeforeShipping = subtotal - promoDiscount - couponDiscount;
  const freeShippingProgress = Math.min(100, (totalBeforeShipping / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - totalBeforeShipping);

  return (
    <>
      {/* Background Overlay */}
      <div
        onClick={() => setCartOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          animation: 'fade-in 0.2s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--card-bg)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Mi Carrito ({cart.length})</h3>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            style={{
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
        </div>

        {/* Free Shipping Meter */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--background-alt)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px' }}>
              <Truck size={16} style={{ color: amountToFreeShipping === 0 ? 'var(--success)' : 'var(--primary)' }} />
              {amountToFreeShipping === 0 ? (
                <span style={{ fontWeight: '600', color: 'var(--success)' }}>¡Felicitaciones! Tenés envío gratis.</span>
              ) : (
                <span>
                  Faltan <strong style={{ color: 'var(--primary)' }}>${amountToFreeShipping.toFixed(0)}</strong> para
                  el <strong>Envío Gratis</strong>
                </span>
              )}
            </div>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'var(--border)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${freeShippingProgress}%`,
                  height: '100%',
                  backgroundColor: amountToFreeShipping === 0 ? 'var(--success)' : 'var(--primary)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cart.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--foreground-muted)',
              }}
            >
              <ShoppingBag size={64} strokeWidth={1} style={{ marginBottom: '16px', color: 'var(--border)' }} />
              <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'var(--foreground)' }}>
                Tu carrito está vacío
              </p>
              <p style={{ fontSize: '14px', maxWidth: '280px', marginBottom: '20px' }}>
                Agregá los productos que necesitás y compralos sin salir de casa.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '600',
                }}
              >
                Volver a la tienda
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((item) => {
                const price =
                  item.product.offerPrice !== null && item.product.offerPrice !== undefined
                    ? item.product.offerPrice
                    : item.product.price;
                return (
                  <div
                    key={item.product.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid var(--border-light)',
                    }}
                  >
                    <img
                      src={item.product.images.split(',')[0]}
                      alt={item.product.name}
                      style={{
                        width: '70px',
                        height: '70px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', lineBreak: 'anywhere' }}>
                        {item.product.name}
                      </h4>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
                        ${price.toFixed(2)}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Quantity controls */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: 'var(--background-alt)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ padding: '0 12px', fontSize: '14px', fontWeight: '600' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: 'var(--background-alt)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          style={{ color: 'var(--error)', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '20px',
              borderTop: '1px solid var(--border)',
              backgroundColor: 'var(--background-alt)',
            }}
          >
            {/* Coupon form */}
            {!coupon ? (
              <form onSubmit={handleCouponSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Cupón de descuento"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                  }}
                />
                <button
                  type="submit"
                  disabled={applying}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {applying ? 'Aplicando...' : 'Aplicar'}
                </button>
              </form>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--accent-light)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)' }}>
                  <Tag size={14} />
                  <span>
                    Cupón <strong>{coupon.code}</strong> aplicado (-${coupon.discountAmount.toFixed(0)})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--error)',
                  }}
                >
                  Quitar
                </button>
              </div>
            )}

            {/* Calculations summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {promoDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>Descuento Promos</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>Descuento Cupón</span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Envío</span>
                <span>{shippingCost === 0 ? <strong style={{ color: 'var(--success)' }}>Gratis</strong> : `$${shippingCost.toFixed(2)}`}</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckoutRedirect}
              style={{
                width: '100%',
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                fontSize: '16px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
