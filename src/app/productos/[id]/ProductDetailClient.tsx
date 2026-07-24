'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart, Product } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import ProductCard from '@/components/ui/ProductCard';
import { Heart, ShoppingCart, Plus, Minus, Star, Share2, Clipboard, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';

interface ClientProps {
  product: Product & {
    category?: { id: string; name: string; slug: string } | null;
    brand?: { id: string; name: string; slug: string } | null;
    reviews: any[];
  };
  relatedProducts: Product[];
  avgRating: number;
  reviewCount: number;
}

export default function ProductDetailClient({ product, relatedProducts, avgRating, reviewCount }: ClientProps) {
  const { addToCart, toggleFavorite, isFavorite, addToHistory } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  // Gallery
  const imagesArray = product.images.split(',');
  const [activeImage, setActiveImage] = useState(imagesArray[0]);

  // Quantity selection
  const [quantity, setQuantity] = useState(1);

  // Tabs
  const [activeTab, setActiveTab] = useState<'desc' | 'nutrition' | 'specs'>('desc');

  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Add to recently viewed on mount
  useEffect(() => {
    addToHistory(product.id);
  }, [product.id, addToHistory]);

  const currentPrice = product.offerPrice !== null && product.offerPrice !== undefined ? product.offerPrice : product.price;
  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('¡Enlace copiado al portapapeles!');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('¡Gracias por tu opinión! Se ha guardado.');
        setComment('');
        router.refresh(); // Refresh page to load the new review
      } else {
        toast.error(data.error || 'Error al guardar la opinión');
      }
    } catch (err) {
      toast.error('Error de red al guardar la opinión');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      
      {/* Breadcrumbs */}
      <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginBottom: '24px' }}>
        Inicio &gt; Productos &gt; {product.category?.name || 'Supermercado'} &gt; <strong style={{ color: 'var(--foreground)' }}>{product.name}</strong>
      </p>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginBottom: '50px' }}>
        
        {/* Left Column: Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Large Main Image */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              height: '420px',
              position: 'relative',
            }}
          >
            <img
              src={activeImage}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />

            {/* Float badges */}
            {product.offerPrice && (
              <span
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '700',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                OFERTA
              </span>
            )}
          </div>

          {/* Thumbnail list (if more than 1 image) */}
          {imagesArray.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {imagesArray.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: 'var(--radius-md)',
                    border: activeImage === img ? '2px solid var(--primary)' : '1px solid var(--border)',
                    padding: '4px',
                    backgroundColor: 'var(--card-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Buying info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Category / Brand / Share / Favs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                {product.brand?.name || 'Generico'} • {product.category?.name}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleShare}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--background-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Compartir"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--background-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: favorited ? 'var(--error)' : 'var(--foreground-muted)',
                  }}
                  title="Añadir a Favoritos"
                >
                  <Heart size={16} fill={favorited ? 'var(--error)' : 'none'} />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px', lineHeight: '1.2' }}>{product.name}</h1>

            {/* Ratings Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', color: '#FFB300' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} fill={s <= Math.round(avgRating) ? '#FFB300' : 'none'} />
                ))}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{avgRating.toFixed(1)}</span>
              <span style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>({reviewCount} opiniones)</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '20px' }} />

            {/* Prices */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)' }}>
                ${currentPrice.toFixed(2)}
              </span>
              {product.offerPrice && (
                <>
                  <span style={{ fontSize: '20px', color: 'var(--foreground-muted)', textDecoration: 'line-through' }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    ¡Ahorrás ${ (product.price - product.offerPrice).toFixed(0) }!
                  </span>
                </>
              )}
            </div>

            {/* Stock Levels */}
            <div style={{ marginBottom: '30px' }}>
              {product.stock > 10 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: '600', fontSize: '14px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
                  <span>Stock disponible ({product.stock} unidades)</span>
                </div>
              ) : product.stock > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontWeight: '600', fontSize: '14px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span>
                  <span>¡Últimas {product.stock} unidades disponibles!</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', fontWeight: '600', fontSize: '14px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--error)' }}></span>
                  <span>Sin stock momentáneamente</span>
                </div>
              )}
            </div>
          </div>

          {/* Action box */}
          {product.stock > 0 && (
            <div
              style={{
                backgroundColor: 'var(--background-alt)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Cantidad</span>
                
                {/* Quantity adjustments */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--background)',
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '8px 14px' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 16px', fontWeight: '700', fontSize: '15px' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{ padding: '8px 14px' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Buying Buttons */}
              <div className="buying-actions">
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '700',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <ShoppingCart size={18} /> Agregar al Carrito
                </button>
                <button
                  onClick={handleBuyNow}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--success)',
                    color: 'white',
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '700',
                    fontSize: '15px',
                    textAlign: 'center',
                  }}
                >
                  Comprar Ahora
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Layout */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: '20px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('desc')}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: '700',
              color: activeTab === 'desc' ? 'var(--primary)' : 'var(--foreground-muted)',
              borderBottom: activeTab === 'desc' ? '3px solid var(--primary)' : 'none',
            }}
          >
            Descripción
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: '700',
              color: activeTab === 'nutrition' ? 'var(--primary)' : 'var(--foreground-muted)',
              borderBottom: activeTab === 'nutrition' ? '3px solid var(--primary)' : 'none',
            }}
          >
            Información Nutricional
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: '700',
              color: activeTab === 'specs' ? 'var(--primary)' : 'var(--foreground-muted)',
              borderBottom: activeTab === 'specs' ? '3px solid var(--primary)' : 'none',
            }}
          >
            Ficha Técnica
          </button>
        </div>

        {/* Tab Contents */}
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
          {activeTab === 'desc' && (
            <p style={{ lineHeight: '1.7', fontSize: '15px', color: 'var(--foreground)' }}>
              {product.description}
            </p>
          )}

          {activeTab === 'nutrition' && (
            <div style={{ maxWidth: '320px', border: '3px solid black', padding: '16px', fontFamily: 'Arial, sans-serif' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '800', textAlign: 'center', borderBottom: '10px solid black', paddingBottom: '4px', textTransform: 'uppercase' }}>
                Información Nutricional
              </h3>
              <p style={{ fontSize: '12px', borderBottom: '1px solid black', padding: '4px 0' }}>
                Porción: 100g (Medida de referencia)
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '5px solid black', fontWeight: '800', fontSize: '14px', padding: '6px 0' }}>
                <span>Cantidad por porción</span>
                <span>% VD *</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid black', fontSize: '13px', padding: '4px 0' }}>
                <span><strong>Valor Energético</strong> (120 kcal)</span>
                <span>6%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid black', fontSize: '13px', padding: '4px 0' }}>
                <span>Carbohidratos (15g)</span>
                <span>5%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid black', fontSize: '13px', padding: '4px 0' }}>
                <span>Proteínas (3.2g)</span>
                <span>4%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid black', fontSize: '13px', padding: '4px 0' }}>
                <span>Grasas Totales (2.5g)</span>
                <span>3%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid black', fontSize: '13px', padding: '4px 0' }}>
                <span>Fibra Alimentaria (1g)</span>
                <span>4%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '5px solid black', fontSize: '13px', padding: '4px 0' }}>
                <span>Sodio (85mg)</span>
                <span>4%</span>
              </div>
              <p style={{ fontSize: '11px', color: '#555555', marginTop: '8px', lineHeight: '1.3' }}>
                * % Valores Diarios con base a una dieta de 2.000 kcal u 8.400 kJ. Sus valores diarios pueden ser mayores o menores dependiendo de sus necesidades energéticas.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span style={{ width: '180px', fontWeight: '700', color: 'var(--foreground-muted)' }}>Marca:</span>
                <span>{product.brand?.name || 'Genérico'}</span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span style={{ width: '180px', fontWeight: '700', color: 'var(--foreground-muted)' }}>SKU:</span>
                <span>{product.sku}</span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span style={{ width: '180px', fontWeight: '700', color: 'var(--foreground-muted)' }}>Código de barras:</span>
                <span>{product.barcode || 'No registrado'}</span>
              </div>
              <div style={{ display: 'flex', paddingBottom: '8px' }}>
                <span style={{ width: '180px', fontWeight: '700', color: 'var(--foreground-muted)' }}>Peso unitario:</span>
                <span>{product.weight} kg</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews and Ratings Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Opiniones de nuestros clientes</h2>
        <div className="reviews-grid">
          
          {/* Review scores summary */}
          <div
            style={{
              backgroundColor: 'var(--background-alt)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'fit-content',
            }}
          >
            <span style={{ fontSize: '48px', fontWeight: '800', color: 'var(--primary)' }}>{avgRating.toFixed(1)}</span>
            <div style={{ display: 'flex', color: '#FFB300', marginBottom: '8px' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} fill={s <= Math.round(avgRating) ? '#FFB300' : 'none'} />
              ))}
            </div>
            <span style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>Promedio sobre {reviewCount} opiniones</span>
          </div>

          {/* Reviews list & Write Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Form */}
            {user ? (
              <form
                onSubmit={handleReviewSubmit}
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <h4 style={{ fontSize: '16px', fontWeight: '700' }}>Dejanos tu opinión</h4>
                
                {/* Rating selection stars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>Calificación:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        style={{ color: s <= rating ? '#FFB300' : 'var(--border)' }}
                      >
                        <Star size={20} fill={s <= rating ? '#FFB300' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Escribí aquí tu comentario sobre el producto..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />

                <button
                  type="submit"
                  disabled={submittingReview}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '14px',
                    fontWeight: '600',
                    alignSelf: 'flex-end',
                  }}
                >
                  {submittingReview ? 'Guardando...' : 'Enviar opinión'}
                </button>
              </form>
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--background-alt)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  textAlign: 'center',
                  fontSize: '14px',
                }}
              >
                ¿Ya compraste este producto? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Iniciá sesión</Link> para dejar tu calificación.
              </div>
            )}

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--card-bg)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>{rev.user.name}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                      {new Date(rev.createdAt).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', color: '#FFB300', marginBottom: '8px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={s <= rev.rating ? '#FFB300' : 'none'} />
                    ))}
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: '1.5' }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
              {product.reviews.length === 0 && (
                <p style={{ color: 'var(--foreground-muted)', textAlign: 'center', fontSize: '14px', padding: '20px 0' }}>
                  Aún no hay opiniones sobre este producto. ¡Sé el primero en calificarlo!
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '24px' }}>Productos relacionados</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
