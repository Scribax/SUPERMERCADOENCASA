'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { DollarSign, ShoppingBag, Users, AlertTriangle, ArrowUpRight, TrendingUp, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReport(data.data);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar métricas del reporte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleQuickAddStock = async (productId: string, currentStock: number) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: currentStock + 20 }), // Quick add 20 units
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Stock actualizado (+20 unidades)');
        fetchReports(); // Refresh statistics
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  if (loading) {
    return <div>Cargando estadísticas del panel...</div>;
  }

  if (!report) {
    return <div>Ocurrió un error al compilar los reportes de ventas.</div>;
  }

  const { kpis, statusCounts, lowStockProducts, chartData, topSellingProducts } = report;

  // Calculate SVG dimensions for the Sales Trend chart
  const svgWidth = 600;
  const svgHeight = 200;
  const maxSales = Math.max(...chartData.map((d: any) => d.sales), 1000); // at least 1000 for scaling

  const points = chartData.map((d: any, i: number) => {
    const x = (i / (chartData.length - 1)) * (svgWidth - 60) + 30;
    const y = svgHeight - (d.sales / maxSales) * (svgHeight - 60) - 30;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Panel de Control</h1>
        <p style={{ color: 'var(--foreground-muted)' }}>Métricas clave y estado general de la tienda online.</p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* Sales Today */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: '600' }}>Ventas Hoy</span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>${kpis.salesToday.toFixed(2)}</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
        </div>

        {/* Sales Month */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: '600' }}>Ventas del Mes</span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>${kpis.salesMonth.toFixed(2)}</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        {/* Total Orders */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: '600' }}>Pedidos Totales</span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>{kpis.totalOrdersCount}</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={22} />
          </div>
        </div>

        {/* Registered Customers */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: '600' }}>Clientes Activos</span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>{kpis.clientCount}</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--background-alt)', color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* Graphs & Sales Trend Panel */}
      <div className="admin-grid-2col">
        
        {/* Trend line chart */}
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Tendencia de Ventas (Últimos 14 días)</h3>
          
          {/* Responsive SVG line graph */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="240">
              {/* Grid Lines */}
              <line x1="30" y1="30" x2={svgWidth - 30} y2="30" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4" />
              <line x1="30" y1="85" x2={svgWidth - 30} y2="85" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4" />
              <line x1="30" y1="140" x2={svgWidth - 30} y2="140" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4" />
              <line x1="30" y1="170" x2={svgWidth - 30} y2="170" stroke="var(--border)" strokeWidth="1" />

              {/* Trend line */}
              <polyline
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                points={points}
              />

              {/* Data circles & labels */}
              {chartData.map((d: any, i: number) => {
                const x = (i / (chartData.length - 1)) * (svgWidth - 60) + 30;
                const y = svgHeight - (d.sales / maxSales) * (svgHeight - 60) - 30;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="var(--primary)" stroke="white" strokeWidth="1.5" />
                    <text x={x} y={svgHeight - 10} fontSize="10" textAnchor="middle" fill="var(--foreground-muted)">
                      {d.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Top Products Sales */}
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Más Vendidos (Mes)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topSellingProducts.map((p: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--foreground-muted)' }}>{p.quantity} unidades vendidas</span>
                </div>
                <strong style={{ fontSize: '14px', color: 'var(--success)', marginLeft: '12px' }}>
                  ${p.totalSales.toFixed(0)}
                </strong>
              </div>
            ))}
            {topSellingProducts.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--foreground-muted)', fontSize: '13px', padding: '20px 0' }}>
                Esperando primeras ventas para registrar tendencias.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stock Alerts Warning Section */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', marginBottom: '20px' }}>
          <AlertTriangle size={18} /> Alertas de Inventario Crítico
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--foreground-muted)' }}>
                <th style={{ padding: '12px 8px' }}>Producto</th>
                <th style={{ padding: '12px 8px' }}>SKU</th>
                <th style={{ padding: '12px 8px' }}>Precio Base</th>
                <th style={{ padding: '12px 8px' }}>Stock Actual</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((p: any) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: '600' }}>{p.name}</td>
                  <td style={{ padding: '12px 8px' }}>{p.sku}</td>
                  <td style={{ padding: '12px 8px' }}>${p.price.toFixed(2)}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ color: p.stock === 0 ? 'var(--error)' : 'var(--warning)', fontWeight: '700' }}>
                      {p.stock === 0 ? 'Agotado' : `${p.stock} unidades`}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleQuickAddStock(p.id, p.stock)}
                      style={{
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Plus size={12} /> Cargar +20
                    </button>
                  </td>
                </tr>
              ))}
              {lowStockProducts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--success)', fontWeight: '600', padding: '20px 0' }}>
                    ✓ Todos los productos tienen stock saludable.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
