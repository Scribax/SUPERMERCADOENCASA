'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Eye, ChevronDown, ChevronUp, Printer, Phone, Check } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');

  const toast = useToast();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter local array when filter updates
  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Pedido #${orderId.slice(0, 8)} actualizado a ${newStatus}`);
        fetchOrders(); // Refresh table
      } else {
        toast.error(data.error || 'Error al actualizar pedido');
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newPayStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPayStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Pago del pedido #${orderId.slice(0, 8)} actualizado a ${newPayStatus}`);
        fetchOrders();
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  // Prefilled WhatsApp Status message trigger
  const sendWhatsAppUpdate = (order: any) => {
    let msg = '';
    if (order.status === 'PREPARING') {
      msg = `Hola ${order.customerName}! Tu pedido #${order.id.slice(0, 8)} en Superencasa ya se encuentra en preparación. ¡Te avisaremos apenas sea despachado!`;
    } else if (order.status === 'SHIPPED') {
      msg = `¡Hola ${order.customerName}! Tu pedido #${order.id.slice(0, 8)} de Superencasa ya está en camino a tu domicilio.`;
    } else if (order.status === 'DELIVERED') {
      msg = `¡Hola ${order.customerName}! Tu pedido #${order.id.slice(0, 8)} de Superencasa ya fue entregado. ¡Muchas gracias por tu compra!`;
    } else {
      msg = `Hola ${order.customerName}! Nos comunicamos desde Superencasa por tu pedido #${order.id.slice(0, 8)}.`;
    }

    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const translateStatus = (s: string) => {
    switch (s) {
      case 'PENDING': return 'Pendiente';
      case 'PREPARING': return 'Preparando';
      case 'SHIPPED': return 'Despachado';
      case 'DELIVERED': return 'Entregado';
      case 'CANCELLED': return 'Cancelado';
      default: return s;
    }
  };

  if (loading) {
    return <div>Cargando pedidos...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="admin-orders-page">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }} className="no-print">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Gestión de Pedidos</h1>
          <p style={{ color: 'var(--foreground-muted)' }}>Visualizá, prepará y actualizá los pedidos de tus clientes.</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                fontSize: '12px',
                fontWeight: '700',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: statusFilter === status ? 'var(--primary)' : 'var(--card-bg)',
                color: statusFilter === status ? 'white' : 'var(--foreground)',
              }}
            >
              {status === 'ALL' ? 'Todos' : translateStatus(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--foreground-muted)' }}>
                <th style={{ padding: '16px' }}>Pedido</th>
                <th style={{ padding: '16px' }}>Cliente</th>
                <th style={{ padding: '16px' }}>Fecha</th>
                <th style={{ padding: '16px' }}>Total</th>
                <th style={{ padding: '16px' }}>Estado</th>
                <th style={{ padding: '16px' }}>Pago</th>
                <th style={{ padding: '16px', textAlign: 'right' }} className="no-print">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                return (
                  <React.Fragment key={order.id}>
                    <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--border-light)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px', fontWeight: '700' }}>#{order.id.slice(0, 8)}</td>
                      <td style={{ padding: '16px' }}>
                        <div><strong>{order.customerName}</strong></div>
                        <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{order.customerPhone}</div>
                      </td>
                      <td style={{ padding: '16px' }}>{new Date(order.createdAt).toLocaleDateString('es-AR')}</td>
                      <td style={{ padding: '16px', fontWeight: '700', color: 'var(--primary)' }}>${order.total.toFixed(2)}</td>
                      
                      {/* Status select dropdown */}
                      <td style={{ padding: '16px' }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--background)',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                          className="no-print"
                        >
                          <option value="PENDING">Pendiente</option>
                          <option value="PREPARING">Preparando</option>
                          <option value="SHIPPED">En camino</option>
                          <option value="DELIVERED">Entregado</option>
                          <option value="CANCELLED">Cancelado</option>
                        </select>
                        <span style={{ display: 'none' }} className="print-only">{translateStatus(order.status)}</span>
                      </td>

                      {/* Payment Status select dropdown */}
                      <td style={{ padding: '16px' }}>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--background)',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                          className="no-print"
                        >
                          <option value="PENDING">Pendiente</option>
                          <option value="PAID">Pagado</option>
                          <option value="REFUNDED">Reembolsado</option>
                        </select>
                        <span style={{ display: 'none' }} className="print-only">{order.paymentStatus}</span>
                      </td>

                      {/* Expand / Actions */}
                      <td style={{ padding: '16px', textAlign: 'right' }} className="no-print">
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => toggleExpand(order.id)}
                            style={{
                              padding: '6px',
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: 'var(--background-alt)',
                            }}
                            title="Ver detalles"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            onClick={() => sendWhatsAppUpdate(order)}
                            style={{
                              padding: '6px',
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: '#E8F5E9',
                              color: '#2E7D32',
                            }}
                            title="Notificar por WhatsApp"
                          >
                            <Phone size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Collapsible Details Row */}
                    {isExpanded && (
                      <tr style={{ backgroundColor: 'var(--background-alt)', borderBottom: '1px solid var(--border)' }}>
                        <td colSpan={7} style={{ padding: '24px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }} className="order-details-drawer">
                            {/* Left: Info */}
                            <div>
                              <h4 style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', color: 'var(--foreground-muted)', marginBottom: '8px' }}>
                                Datos de Envío & Facturación
                              </h4>
                              <p style={{ margin: '4px 0' }}><strong>Dirección:</strong> {order.shippingAddress}</p>
                              <p style={{ margin: '4px 0' }}><strong>Email:</strong> {order.customerEmail}</p>
                              <p style={{ margin: '4px 0' }}><strong>Pago:</strong> {order.paymentMethod} ({order.paymentStatus === 'PAID' ? 'Acreditado' : 'Pendiente'})</p>
                              
                              <button
                                onClick={() => window.print()}
                                style={{
                                  marginTop: '16px',
                                  padding: '8px 16px',
                                  backgroundColor: 'var(--card-bg)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                                className="no-print"
                              >
                                <Printer size={15} /> Imprimir Remito de Despacho
                              </button>
                            </div>

                            {/* Right: Items */}
                            <div>
                              <h4 style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', color: 'var(--foreground-muted)', marginBottom: '8px' }}>
                                Productos
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {order.items.map((item: any) => (
                                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span>{item.name} <strong>x {item.quantity}</strong></span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '14px' }}>
                                <span>Total del pedido:</span>
                                <span>${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--foreground-muted)', padding: '30px' }}>
                    No se encontraron pedidos con este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Local prints override */}
      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: inline !important; }
          aside, header, footer, .whatsapp-btn { display: none !important; }
          main { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
