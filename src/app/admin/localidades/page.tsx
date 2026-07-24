'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Plus, Edit, Trash2, X, MapPin } from 'lucide-react';

export default function AdminLocalities() {
  const [localities, setLocalities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editLocality, setEditLocality] = useState<any>(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    shippingCost: '0',
    isActive: true,
  });

  const [saving, setSaving] = useState(false);

  const toast = useToast();

  const fetchLocalities = async () => {
    try {
      const res = await fetch('/api/localities');
      if (res.ok) {
        const data = await res.json();
        setLocalities(data.localities || []);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar localidades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalities();
  }, []);

  const handleOpenCreateModal = () => {
    setEditLocality(null);
    setForm({
      name: '',
      shippingCost: '0',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (locality: any) => {
    setEditLocality(locality);
    setForm({
      name: locality.name,
      shippingCost: locality.shippingCost.toString(),
      isActive: locality.isActive,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let url = '/api/localities';
      let method = 'POST';

      if (editLocality) {
        url = `/api/localities/${editLocality.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          shippingCost: parseFloat(form.shippingCost),
          isActive: form.isActive,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(editLocality ? 'Localidad actualizada' : 'Localidad creada');
        setIsModalOpen(false);
        fetchLocalities();
      } else {
        toast.error(data.error || 'Error al guardar');
      }
    } catch (err) {
      toast.error('Error de red');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar esta localidad?')) return;

    try {
      const res = await fetch(`/api/localities/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Localidad eliminada');
        fetchLocalities();
      } else {
        toast.error(data.error || 'Error al eliminar');
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  if (loading) {
    return <div>Cargando localidades...</div>;
  }

  const activeCount = localities.filter(l => l.isActive).length;
  const avgShipping = localities.length > 0 
    ? localities.reduce((acc, l) => acc + l.shippingCost, 0) / localities.length 
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Gestión de Localidades</h1>
          <p style={{ color: 'var(--foreground-muted)' }}>Administrá las zonas de entrega y sus costos de envío.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Plus size={16} /> Nueva Localidad
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Total Localidades</p>
          <p style={{ fontSize: '24px', fontWeight: '800' }}>{localities.length}</p>
        </div>
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Activas</p>
          <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--success)' }}>{activeCount}</p>
        </div>
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Costo Promedio Envío</p>
          <p style={{ fontSize: '24px', fontWeight: '800' }}>${avgShipping.toFixed(2)}</p>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--foreground-muted)' }}>
              <th style={{ padding: '16px' }}>Nombre</th>
              <th style={{ padding: '16px' }}>Costo de Envío ($)</th>
              <th style={{ padding: '16px' }}>Estado</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {localities.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px', fontWeight: '700' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} style={{ color: 'var(--primary)' }} />
                    {l.name}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>${l.shippingCost.toFixed(2)}</td>
                <td style={{ padding: '16px' }}>
                  {l.isActive ? (
                    <span style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '4px 8px', borderRadius: 'var(--radius-xs)', fontSize: '12px', fontWeight: '700' }}>Activo</span>
                  ) : (
                    <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '4px 8px', borderRadius: 'var(--radius-xs)', fontSize: '12px', fontWeight: '700' }}>Inactivo</span>
                  )}
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleOpenEditModal(l)}
                      style={{ padding: '6px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--background-alt)', color: 'var(--primary)' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(l.id)}
                      style={{ padding: '6px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--background-alt)', color: 'var(--error)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {localities.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--foreground-muted)' }}>
                  No hay localidades registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div onClick={() => setIsModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '400px',
              backgroundColor: 'var(--card-bg)',
              zIndex: 1001,
              padding: '30px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{editLocality ? 'Editar Localidad' : 'Nueva Localidad'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Costo de Envío ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.shippingCost}
                  onChange={(e) => setForm({ ...form, shippingCost: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                  />
                  Localidad Activa
                </label>
                <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '4px', marginLeft: '24px' }}>
                  Si está inactiva, no aparecerá en el checkout.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '14px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground-muted)' }}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
