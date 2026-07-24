'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, PhoneCall, Printer, ShoppingBag, Landmark, Wallet, CreditCard } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const payment = searchParams.get('payment'); // mp_success

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('+5491122334455');

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        } else {
          router.push('/');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          if (data.config && data.config.whatsapp_number) {
            setWhatsappNumber(data.config.whatsapp_number);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchOrder();
    fetchConfig();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h3>Cargando confirmación de pedido...</h3>
      </div>
    );
  }

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  // Prefilled WhatsApp link
  const waMessage = `Hola! Realicé el pedido #${order.id.slice(0, 8)} en Superencasa por un total de $${order.total.toFixed(2)}. Mi nombre es ${order.customerName}.`;
  const waUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="container print-container" style={{ paddingTop: '50px', paddingBottom: '8px', maxWidth: '680px' }}>
      
      {/* SUCCESS BANNER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="no-print">
        <div style={{ display: 'inline-flex', color: 'var(--success)', marginBottom: '16px' }}>
          <CheckCircle2 size={64} />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>¡Muchas gracias por tu compra!</h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px' }}>
          Tu pedido <strong style={{ color: 'var(--foreground)' }}>#{order.id.slice(0, 8)}</strong> se ha creado correctamente.
        </p>
      </div>

      {/* TICKET DETAILS */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '30px',
        }}
      >
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Detalle de Recibo</h3>
          <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
            {new Date(order.createdAt).toLocaleDateString('es-AR')}
          </span>
        </div>

        {/* Dynamic Payment Alert Box */}
        <div style={{ marginBottom: '24px' }} className="no-print">
          {order.paymentMethod === 'TRANSFER' && (
            <div
              style={{
                backgroundColor: 'var(--success-light)',
                border: '1px dashed var(--success)',
                color: 'var(--foreground)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--success)' }}>
                <Landmark size={20} /> <strong>Pasos para Transferencia Bancaria</strong>
              </div>
              <p style={{ marginBottom: '10px' }}>
                Transferí el importe total de <strong>${order.total.toFixed(2)}</strong> a la siguiente cuenta:
              </p>
              <div style={{ backgroundColor: 'var(--card-bg)', padding: '12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '12px' }}>
                Banco Galicia • Cta Cte: 3450-9 123-1<br />
                CBU: 0070123420000003450918<br />
                Alias: SUPERENCASA.OFICIAL
              </div>
              <p style={{ marginTop: '10px' }}>
                Una vez realizada, envianos el comprobante por WhatsApp usando el botón de abajo.
              </p>
            </div>
          )}

          {order.paymentMethod === 'CASH' && (
            <div
              style={{
                backgroundColor: 'var(--accent-light)',
                border: '1px dashed var(--accent)',
                color: 'var(--foreground)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent)' }}>
                <Wallet size={20} /> <strong>Pago Contra Entrega</strong>
              </div>
              El cadete te cobrará en efectivo al entregarte la mercadería en la dirección indicada. Si es posible, prepará el monto exacto: <strong>${order.total.toFixed(2)}</strong>.
            </div>
          )}

          {order.paymentMethod === 'MERCADO_PAGO' && (
            <div
              style={{
                backgroundColor: 'var(--primary-light)',
                border: '1px dashed var(--primary)',
                color: 'var(--foreground)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary)' }}>
                <CreditCard size={20} /> <strong>Pago por Mercado Pago</strong>
              </div>
              ¡Pago procesado con éxito! Recibirás un correo electrónico de confirmación con los detalles de tu cobro.
            </div>
          )}
        </div>

        {/* Shipping address details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', fontSize: '14px' }}>
          <div>
            <h4 style={{ fontWeight: '700', color: 'var(--foreground-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Entregar a:
            </h4>
            <p><strong>{order.customerName}</strong></p>
            <p>{order.customerPhone}</p>
            <p>{order.customerEmail}</p>
          </div>
          <div>
            <h4 style={{ fontWeight: '700', color: 'var(--foreground-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Dirección de Envío:
            </h4>
            <p>{order.shippingAddress}</p>
          </div>
        </div>

        {/* Order Items Table */}
        <h4 style={{ fontWeight: '700', color: 'var(--foreground-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
          Productos
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {order.items.map((item: any) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>
                {item.name} <strong style={{ color: 'var(--foreground-muted)' }}>x {item.quantity}</strong>
              </span>
              <span style={{ fontWeight: '600' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '16px' }} />

        {/* Totals breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
              <span>Descuentos</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Envío</span>
            <span>{order.shippingCost === 0 ? 'Gratis' : `$${order.shippingCost.toFixed(2)}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', marginTop: '8px' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="no-print">
        {order.paymentMethod === 'TRANSFER' && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#25D366',
              color: 'white',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '700',
              fontSize: '16px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <PhoneCall size={18} /> Enviar Comprobante por WhatsApp
          </a>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handlePrint}
            style={{
              flex: 1,
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Printer size={16} /> Imprimir Recibo
          </button>
          <Link
            href="/cuenta?tab=pedidos"
            style={{
              flex: 1,
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textAlign: 'center',
            }}
          >
            <ShoppingBag size={16} /> Ver mis pedidos
          </Link>
        </div>

        <Link
          href="/"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            fontWeight: '700',
            fontSize: '16px',
            textAlign: 'center',
            marginTop: '12px',
          }}
        >
          Volver al Inicio
        </Link>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          header, footer, .whatsapp-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '80px', textAlign: 'center' }}>
        <h3>Cargando confirmación...</h3>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
