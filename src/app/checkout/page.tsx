'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';
import { ShoppingBag, CreditCard, Landmark, Truck, Wallet, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, subtotal, promoDiscount, couponDiscount, shippingCost, total, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    zip: '',
    localidadId: '',
  });

  const [localities, setLocalities] = useState<any[]>([]);

  const [deliveryDate, setDeliveryDate] = useState<string>('Hoy');
  const [deliverySlot, setDeliverySlot] = useState<string>('Turno Mañana (09:00 - 12:00)');
  const [paymentMethod, setPaymentMethod] = useState<'MERCADO_PAGO' | 'TRANSFER' | 'CASH'>('MERCADO_PAGO');
  const [submitting, setSubmitting] = useState(false);

  // Sync user details if logged in
  useEffect(() => {
    if (user) {
      const parts = user.name.split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';
      
      setFormData((prev) => ({
        ...prev,
        nombre: firstName,
        apellido: lastName,
        email: user.email,
        telefono: user.profile?.phone || '',
      }));

      // Fetch default address
      const fetchDefaultAddress = async () => {
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            if (data.user && data.user.addresses && data.user.addresses.length > 0) {
              const defAddr = data.user.addresses.find((a: any) => a.isDefault) || data.user.addresses[0];
              setFormData((prev) => ({
                ...prev,
                direccion: defAddr.street,
                ciudad: defAddr.city,
                provincia: defAddr.province,
                zip: defAddr.zipCode,
              }));
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchDefaultAddress();
    }
  }, [user]);

  useEffect(() => {
    const fetchLocalities = async () => {
      try {
        const res = await fetch('/api/localities');
        if (res.ok) {
          const data = await res.json();
          setLocalities((data.localities || []).filter((l: any) => l.isActive));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLocalities();
  }, []);

  // If cart is empty, redirect back to products
  useEffect(() => {
    if (cart.length === 0 && !submitting) {
      toast.info('Tu carrito está vacío. Agregá productos para poder comprar.');
      router.push('/productos');
    }
  }, [cart, router, toast, submitting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);

    try {
      // 1. Compile order details
      const orderData = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        couponCode: coupon?.code || null,
        customerName: `${formData.nombre} ${formData.apellido}`.trim(),
        customerEmail: formData.email,
        customerPhone: formData.telefono,
        shippingAddress: `${formData.direccion}, ${formData.ciudad}, ${formData.provincia} (CP: ${formData.zip})`,
        locality: localities.find(l => l.id === formData.localidadId)?.name || null,
        deliveryDate,
        deliverySlot,
        paymentMethod,
      };

      // 2. Call POST API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('¡Pedido creado con éxito!');
        const orderId = data.order.id;

        // Clear local shopping cart state
        clearCart();

        // 3. Handle Mercado Pago payment redirect simulation
        if (paymentMethod === 'MERCADO_PAGO') {
          toast.info('Redirigiendo a Mercado Pago...');
          setTimeout(() => {
            // Simulated payment screen, redirect directly to success page with parameters
            router.push(`/checkout/success?orderId=${orderId}&payment=mp_success`);
          }, 1500);
        } else {
          router.push(`/checkout/success?orderId=${orderId}`);
        }
      } else {
        toast.error(data.error || 'Error al procesar el pedido. Intentá de nuevo.');
        setSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de red al procesar el pedido');
      setSubmitting(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      
      {/* Return link */}
      <Link href="/productos" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-muted)', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>
        <ArrowLeft size={16} /> Volver a la tienda
      </Link>

      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '30px' }}>Finalizar Compra</h1>

      {/* Two-Column Checkout Grid */}
      <div className="checkout-grid">
        
        {/* Left Column: Form & Payment */}
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Section 1: Contact info */}
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              1. Datos de Contacto
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="grid-2-col">
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2-col">
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Ej: +5491122334455"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping details */}
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              2. Dirección de Entrega
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Calle y Altura (Dpto / Oficina si aplica)</label>
              <input
                type="text"
                name="direccion"
                placeholder="Ej: Av. Santa Fe 1234 3°B"
                value={formData.direccion}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Localidad de Entrega (Zonas Habilitadas)</label>
              <select
                name="localidadId"
                value={formData.localidadId}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
              >
                <option value="">Seleccione una localidad...</option>
                {localities.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name} - Envío ${loc.shippingCost.toFixed(2)}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Ciudad / Localidad</label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Provincia</label>
                <input
                  type="text"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Código Postal</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Delivery Slot Choice */}
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              3. Día y Horario de Entrega 🚚
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2-col">
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Fecha Preferida</label>
                <select
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                >
                  <option value="Hoy">Hoy mismo</option>
                  <option value="Mañana">Mañana</option>
                  <option value="Pasado mañana">Pasado mañana</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Turno Horario</label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                >
                  <option value="Turno Mañana (09:00 - 12:00)">Turno Mañana (09:00 - 12:00)</option>
                  <option value="Turno Tarde (15:00 - 18:00)">Turno Tarde (15:00 - 18:00)</option>
                  <option value="Turno Noche (18:00 - 21:00)">Turno Noche (18:00 - 21:00)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Payment Choice */}
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              4. Método de Pago
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Mercado Pago */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  border: paymentMethod === 'MERCADO_PAGO' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'MERCADO_PAGO' ? 'var(--primary-light)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'MERCADO_PAGO'}
                  onChange={() => setPaymentMethod('MERCADO_PAGO')}
                  style={{ width: '18px', height: '18px' }}
                />
                <CreditCard size={24} style={{ color: 'var(--primary)' }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '15px' }}>Mercado Pago</strong>
                  <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>Tarjetas de crédito/débito, dinero en cuenta o Mercado Crédito.</span>
                </div>
              </label>

              {/* Bank Transfer */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  border: paymentMethod === 'TRANSFER' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'TRANSFER' ? 'var(--primary-light)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'TRANSFER'}
                  onChange={() => setPaymentMethod('TRANSFER')}
                  style={{ width: '18px', height: '18px' }}
                />
                <Landmark size={24} style={{ color: 'var(--success)' }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '15px' }}>Transferencia Bancaria</strong>
                  <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>Transferí desde tu homebanking. Te mostraremos los datos CBU al finalizar.</span>
                </div>
              </label>

              {/* Cash / Contra entrega */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  border: paymentMethod === 'CASH' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'CASH' ? 'var(--primary-light)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CASH'}
                  onChange={() => setPaymentMethod('CASH')}
                  style={{ width: '18px', height: '18px' }}
                />
                <Wallet size={24} style={{ color: 'var(--accent)' }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '15px' }}>Efectivo contra entrega</strong>
                  <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>Pagá en efectivo en la puerta al recibir tu pedido.</span>
                </div>
              </label>
            </div>

            {/* If transfer chosen, show details preview */}
            {paymentMethod === 'TRANSFER' && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: 'var(--background-alt)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  lineHeight: '1.6',
                }}
              >
                <strong>Datos de transferencia:</strong><br />
                Banco Galicia • Cta Cte: 3450-9 123-1<br />
                CBU: 0070123420000003450918<br />
                Alias: SUPERENCASA.OFICIAL
              </div>
            )}
          </div>
        </form>

        {/* Right Column: Order items and subtotal summary */}
        <div>
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '100px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={20} /> Resumen de Compra
            </h3>

            {/* Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
              {cart.map((item) => {
                const price =
                  item.product.offerPrice !== null && item.product.offerPrice !== undefined
                    ? item.product.offerPrice
                    : item.product.price;
                return (
                  <div key={item.product.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img
                      src={item.product.images.split(',')[0]}
                      alt={item.product.name}
                      style={{
                        width: '45px',
                        height: '45px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-light)',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product.name}
                      </h4>
                      <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                        Cant: {item.quantity} • ${price.toFixed(2)} c/u
                      </span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>
                      ${(price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

            {/* Totals */}
            {(() => {
              const selectedLocality = localities.find(l => l.id === formData.localidadId);
              // Use dynamic shipping cost if a locality is selected, otherwise fallback to the cart's default
              const finalShippingCost = selectedLocality ? selectedLocality.shippingCost : shippingCost;
              const totalBeforeShipping = subtotal - promoDiscount - couponDiscount;
              // Assume free shipping if cost is 0 or if the cart logic sets shippingCost to 0 indicating free shipping threshold was met.
              // Wait, if cart says shipping is 0, we should preserve that if free shipping was applied.
              // But for simplicity, we'll just use the locality cost, or free if locality cost is 0.
              const dynamicFinalShippingCost = (shippingCost === 0 && finalShippingCost > 0) ? 0 : finalShippingCost; 
              const finalTotal = totalBeforeShipping + dynamicFinalShippingCost;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                      <span>Descuento Promociones</span>
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
                    <span>Costo de Envío</span>
                    <span>{dynamicFinalShippingCost === 0 ? <strong style={{ color: 'var(--success)' }}>Gratis</strong> : `$${dynamicFinalShippingCost.toFixed(2)}`}</span>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '4px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)' }}>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })()}

            {/* Buy / Submit button */}
            <button
              onClick={handleFormSubmit}
              disabled={submitting}
              style={{
                width: '100%',
                backgroundColor: submitting ? 'var(--border)' : 'var(--primary)',
                color: 'white',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                fontWeight: '700',
                fontSize: '16px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
                marginTop: '10px',
              }}
            >
              {submitting ? 'Procesando Compra...' : 'Realizar Pedido'}
            </button>

            <p style={{ fontSize: '11px', color: 'var(--foreground-muted)', textAlign: 'center', lineHeight: '1.4' }}>
              Al completar la compra, aceptás nuestras políticas de privacidad y condiciones de servicio.
            </p>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media (max-width: 991px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
