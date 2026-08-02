'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Eye, ChevronUp, Printer, Phone, MapPin, X, FileText, Trash2 } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [localityFilter, setLocalityFilter] = useState('ALL');

  // Manifest Modal State
  const [isManifestOpen, setIsManifestOpen] = useState(false);
  const [manifestLocality, setManifestLocality] = useState('');
  const [manifestStatus, setManifestStatus] = useState('PENDING');

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

  const fetchLocalities = async () => {
    try {
      const res = await fetch('/api/localities');
      if (res.ok) {
        const data = await res.json();
        setLocalities(data.localities || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchLocalities();
  }, []);

  // Filter local array when filter updates
  useEffect(() => {
    let result = orders;
    if (statusFilter !== 'ALL') {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (localityFilter !== 'ALL') {
      result = result.filter((o) => o.locality === localityFilter);
    }
    setFilteredOrders(result);
  }, [statusFilter, localityFilter, orders]);

  // Export filtered orders to Excel (CSV)
  const exportToCSV = () => {
    if (!filteredOrders || filteredOrders.length === 0) {
      toast.error('No hay pedidos para exportar');
      return;
    }

    const headers = [
      'ID Pedido',
      'Fecha',
      'Cliente',
      'Email',
      'Telefono',
      'Localidad',
      'Direccion de Envio',
      'Metodo de Pago',
      'Estado de Pago',
      'Estado del Pedido',
      'Subtotal',
      'Costo Envio',
      'Descuento',
      'Total',
      'Productos Comprados'
    ];

    const rows = filteredOrders.map((o) => {
      const itemsList = o.items ? o.items.map((i: any) => `${i.name} (x${i.quantity})`).join(' | ') : '';
      return [
        `"#${o.id.slice(0, 8)}"`,
        `"${new Date(o.createdAt).toLocaleString('es-AR')}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `"${(o.customerEmail || '').replace(/"/g, '""')}"`,
        `"${(o.customerPhone || '').replace(/"/g, '""')}"`,
        `"${(o.locality || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress || '').replace(/"/g, '""')}"`,
        `"${o.paymentMethod}"`,
        `"${o.paymentStatus === 'PAID' ? 'Acreditado' : 'Pendiente'}"`,
        `"${translateStatus(o.status)}"`,
        o.subtotal.toFixed(2),
        o.shippingCost.toFixed(2),
        o.discount.toFixed(2),
        o.total.toFixed(2),
        `"${itemsList.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `planilla_pedidos_superencasa_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Planilla de pedidos descargada en formato Excel (CSV)');
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Pedido #${orderId.slice(0, 8)} actualizado a ${translateStatus(newStatus)}`);
        // Auto-notificar por WhatsApp al despachar o entregar
        if (newStatus === 'SHIPPED' || newStatus === 'DELIVERED' || newStatus === 'PREPARING') {
          const order = orders.find(o => o.id === orderId);
          if (order) sendWhatsAppUpdate({ ...order, status: newStatus });
        }
        fetchOrders();
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

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('¿Estás seguro de eliminar este pedido cancelado? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Pedido eliminado');
        fetchOrders();
      } else {
        toast.error(data.error || 'Error al eliminar');
      }
    } catch { toast.error('Error de red'); }
  };

  // Prefilled WhatsApp Status message trigger
  const sendWhatsAppUpdate = (order: any) => {
    let msg = '';
    if (order.status === 'PREPARING') {
      msg = `Hola ${order.customerName}! Tu pedido #${order.id.slice(0, 8)} en Superencasa ya se encuentra en preparación. ¡Te avisaremos apenas sea despachado!`;
    } else if (order.status === 'SHIPPED') {
      msg = `¡Hola ${order.customerName}! Tu pedido #${order.id.slice(0, 8)} de Superencasa ya está en camino a tu domicilio en ${order.shippingAddress}.`;
    } else if (order.status === 'DELIVERED') {
      msg = `¡Hola ${order.customerName}! Tu pedido #${order.id.slice(0, 8)} de Superencasa ya fue entregado. ¡Muchas gracias por tu compra!`;
    } else {
      msg = `Hola ${order.customerName}! Nos comunicamos desde Superencasa por tu pedido #${order.id.slice(0, 8)} de $${order.total.toFixed(2)}.`;
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

  // Generate Manifest Data
  const manifestOrders = orders.filter(
    (o) => o.locality === manifestLocality && o.status === manifestStatus
  );

  const consolidatedItems = manifestOrders.reduce((acc, order) => {
    order.items.forEach((item: any) => {
      if (acc[item.name]) {
        acc[item.name] += item.quantity;
      } else {
        acc[item.name] = item.quantity;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return <div>Cargando pedidos...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="admin-orders-page">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }} className="no-print">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Gestión de Pedidos</h1>
          <p style={{ color: 'var(--foreground-muted)' }}>Visualizá, prepará, exportá y actualizá los pedidos de tus clientes.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={exportToCSV}
            style={{
              backgroundColor: '#107C41',
              color: 'white',
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '700',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <FileText size={16} /> Exportar Excel (CSV)
          </button>

          <button
            onClick={() => setIsManifestOpen(true)}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '700',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Printer size={16} /> Hoja de Ruta por Localidad
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }} className="no-print">
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} style={{ color: 'var(--foreground-muted)' }} />
          <select
            value={localityFilter}
            onChange={(e) => setLocalityFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--card-bg)',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            <option value="ALL">Todas las localidades</option>
            {localities.map(loc => (
              <option key={loc.id} value={loc.name}>{loc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }} className="no-print">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--foreground-muted)' }}>
                <th style={{ padding: '16px' }}>Pedido</th>
                <th style={{ padding: '16px' }}>Cliente</th>
                <th style={{ padding: '16px' }}>Localidad</th>
                <th style={{ padding: '16px' }}>Total</th>
                <th style={{ padding: '16px' }}>Estado</th>
                <th style={{ padding: '16px' }}>Pago</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Acciones</th>
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
                      <td style={{ padding: '16px' }}>{order.locality || '-'}</td>
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
                        >
                          <option value="PENDING">Pendiente</option>
                          <option value="PREPARING">Preparando</option>
                          <option value="SHIPPED">En camino</option>
                          <option value="DELIVERED">Entregado</option>
                          <option value="CANCELLED">Cancelado</option>
                        </select>
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
                        >
                          <option value="PENDING">Pendiente</option>
                          <option value="PAID">Pagado</option>
                          <option value="REFUNDED">Reembolsado</option>
                        </select>
                      </td>

                      {/* Expand / Actions */}
                      <td style={{ padding: '16px', textAlign: 'right' }}>
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
                          {order.status === 'CANCELLED' && (
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              style={{
                                padding: '6px',
                                borderRadius: 'var(--radius-xs)',
                                backgroundColor: '#FFEBEE',
                                color: '#C62828',
                              }}
                              title="Eliminar pedido cancelado"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
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
                              <p style={{ margin: '4px 0' }}><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString('es-AR')}</p>
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

      {/* Manifest Modal */}
      {isManifestOpen && (
        <div className="manifest-modal">
          <div className="no-print" onClick={() => setIsManifestOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
          
          <div
            className="manifest-content"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '95%',
              maxWidth: '900px',
              height: '90vh',
              backgroundColor: 'white',
              color: 'black',
              zIndex: 1001,
              padding: '30px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              overflowY: 'auto',
            }}
          >
            <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <select
                  value={manifestLocality}
                  onChange={(e) => setManifestLocality(e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="">Seleccionar Localidad</option>
                  {localities.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
                <select
                  value={manifestStatus}
                  onChange={(e) => setManifestStatus(e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="PENDING">Pendientes</option>
                  <option value="PREPARING">Preparando</option>
                </select>
                <button
                  onClick={() => window.print()}
                  disabled={!manifestLocality || manifestOrders.length === 0}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: (!manifestLocality || manifestOrders.length === 0) ? 'not-allowed' : 'pointer',
                    opacity: (!manifestLocality || manifestOrders.length === 0) ? 0.5 : 1
                  }}
                >
                  <Printer size={16} /> Imprimir Hoja de Ruta
                </button>
              </div>
              <button onClick={() => setIsManifestOpen(false)}><X size={24} /></button>
            </div>

            {manifestLocality ? (
              <div className="print-area">
                <div style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>Hoja de Ruta y Despacho de Entrega</h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <p style={{ margin: 0, fontSize: '16px' }}><strong>Localidad:</strong> {manifestLocality}</p>
                    <p style={{ margin: 0, fontSize: '16px' }}><strong>Fecha y Hora:</strong> {new Date().toLocaleString('es-AR')}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>Sección 1: Listado de Entregas y Cobros</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ccc' }}>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>#Pedido</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Cliente</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Dirección Exacta</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Teléfono</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Método</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Est. Pago</th>
                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>Total a Cobrar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manifestOrders.map(o => {
                        const isCashPending = (o.paymentMethod === 'CASH' || o.paymentMethod === 'TRANSFER') && o.paymentStatus === 'PENDING';
                        return (
                          <tr key={o.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>#{o.id.slice(0, 8)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{o.customerName}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{o.shippingAddress}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                <span>{o.customerPhone}</span>
                                <button
                                  className="no-print"
                                  onClick={() => {
                                    const cleanPhone = o.customerPhone.replace(/[^0-9]/g, '');
                                    const msg = `¡Hola ${o.customerName}! Te contactamos del reparto de Superencasa. Estamos en camino a tu domicilio (${o.shippingAddress}) para entregarte el pedido #${o.id.slice(0, 8)}. Total a cobrar: $${o.total.toFixed(2)}.`;
                                    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                                  }}
                                  style={{
                                    backgroundColor: '#25D366',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '3px 6px',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                  }}
                                  title="Avisar por WhatsApp al cliente"
                                >
                                  <Phone size={10} /> Avisar
                                </button>
                              </div>
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{o.paymentMethod}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{o.paymentStatus === 'PAID' ? 'Acreditado' : 'Pendiente'}</td>
                            <td style={{ 
                              padding: '8px', 
                              border: '1px solid #ddd', 
                              textAlign: 'right', 
                              fontWeight: 'bold',
                              backgroundColor: isCashPending ? '#ffebee' : 'transparent',
                              WebkitPrintColorAdjust: 'exact',
                              printColorAdjust: 'exact'
                            }}>
                              ${o.total.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                      {manifestOrders.length === 0 && (
                        <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center', border: '1px solid #ddd' }}>No hay pedidos {translateStatus(manifestStatus).toLowerCase()} en {manifestLocality}.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>Sección 2: Resumen Consolidado de Carga para Vehículo</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '13px' }}>
                    {Object.entries(consolidatedItems).map(([name, qty]) => (
                      <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', borderBottom: '1px dashed #eee' }}>
                        <span>{name}</span>
                        <strong style={{ fontSize: '14px' }}>x {String(qty)}</strong>
                      </div>
                    ))}
                    {Object.keys(consolidatedItems).length === 0 && (
                      <div style={{ gridColumn: 'span 2', color: '#666' }}>No hay productos para cargar.</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-print" style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                Por favor, selecciona una localidad en la parte superior para generar la hoja de ruta.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Local prints override */}
      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          aside, header, footer, .admin-orders-page > div:not(.manifest-modal) { display: none !important; }
          main { padding: 0 !important; }
          
          .manifest-modal { position: static !important; }
          .manifest-content { 
            position: static !important; 
            transform: none !important; 
            width: 100% !important; 
            max-width: none !important; 
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
