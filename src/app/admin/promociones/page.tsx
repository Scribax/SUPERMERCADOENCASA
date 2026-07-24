'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Plus, Edit, Trash2, X, Percent } from 'lucide-react';

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPromo, setEditPromo] = useState<any>(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    type: 'TWO_FOR_ONE', // TWO_FOR_ONE, THREE_FOR_TWO, AUTO_DISCOUNT
    value: '0',
    categoryId: '', // Custom helper fields, which we then convert to configJson
    isActive: true,
  });

  const [saving, setSaving] = useState(false);

  const toast = useToast();

  const fetchPromotions = async () => {
    try {
      const [promoRes, catRes] = await Promise.all([
        fetch('/api/promotions'),
        fetch('/api/categories'),
      ]);

      if (promoRes.ok) {
        const promoData = await promoRes.json();
        setPromotions(promoData.promotions || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar promociones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleOpenCreateModal = () => {
    setEditPromo(null);
    setForm({
      name: '',
      type: 'TWO_FOR_ONE',
      value: '0',
      categoryId: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (promo: any) => {
    setEditPromo(promo);
    const config = JSON.parse(promo.configJson || '{}');
    
    setForm({
      name: promo.name,
      type: promo.type,
      value: promo.value.toString(),
      categoryId: config.categoryId || '',
      isActive: promo.isActive,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Build configJson automatically
    const config: any = {};
    if (form.categoryId) {
      config.categoryId = form.categoryId;
    }
    const configJson = JSON.stringify(config);

    const payload = {
      name: form.name,
      type: form.type,
      value: parseFloat(form.value),
      configJson,
      isActive: form.isActive,
    };

    try {
      let url = '/api/promotions';
      let method = 'POST';

      if (editPromo) {
        url = `/api/promotions/${editPromo.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(editPromo ? 'Promoción actualizada' : 'Promoción creada');
        setIsModalOpen(false);
        fetchPromotions();
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
    if (!confirm('¿Estás seguro de que querés eliminar esta promoción?')) return;

    try {
      const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Promoción eliminada');
        fetchPromotions();
      } else {
        toast.error(data.error || 'Error al eliminar');
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  const translateType = (t: string) => {
    switch (t) {
      case 'TWO_FOR_ONE': return 'Llevá 2, Pagá 1 (2x1)';
      case 'THREE_FOR_TWO': return 'Llevá 3, Pagá 2 (3x2)';
      case 'AUTO_DISCOUNT': return 'Descuento Automático';
      default: return t;
    }
  };

  if (loading) {
    return <div>Cargando promociones...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Promociones Automáticas</h1>
          <p style={{ color: 'var(--foreground-muted)' }}>Configurá ofertas de tipo 2x1, 3x2 o descuentos directos por categoría.</p>
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
          <Plus size={16} /> Nueva Promoción
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--foreground-muted)' }}>
              <th style={{ padding: '16px' }}>Nombre</th>
              <th style={{ padding: '16px' }}>Tipo</th>
              <th style={{ padding: '16px' }}>Valor</th>
              <th style={{ padding: '16px' }}>Ámbito / Categoría</th>
              <th style={{ padding: '16px' }}>Estado</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((p) => {
              const config = JSON.parse(p.configJson || '{}');
              const catName = config.categoryId
                ? categories.find((c) => c.id === config.categoryId)?.name || 'Categoría específica'
                : 'Todo el supermercado';
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px', fontWeight: '700', color: 'var(--primary)' }}>{p.name}</td>
                  <td style={{ padding: '16px' }}>{translateType(p.type)}</td>
                  <td style={{ padding: '16px', fontWeight: '700' }}>
                    {p.type === 'AUTO_DISCOUNT' ? `${p.value}%` : '-'}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--foreground-muted)' }}>{catName}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: p.isActive ? 'var(--success-light)' : 'var(--background-alt)',
                      color: p.isActive ? 'var(--success)' : 'var(--foreground-muted)'
                    }}>
                      {p.isActive ? 'Activo' : 'Pausado'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        style={{ padding: '6px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--background-alt)', color: 'var(--primary)' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{ padding: '6px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--background-alt)', color: 'var(--error)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
              maxWidth: '500px',
              backgroundColor: 'var(--card-bg)',
              zIndex: 1001,
              padding: '30px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{editPromo ? 'Editar Promoción' : 'Nueva Promoción'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Nombre Promocional (Ej: Super Lunes 2x1)</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Tipo de Oferta</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '13px' }}
                  >
                    <option value="TWO_FOR_ONE">Llevá 2, Pagá 1 (2x1)</option>
                    <option value="THREE_FOR_TWO">Llevá 3, Pagá 2 (3x2)</option>
                    <option value="AUTO_DISCOUNT">Descuento Automático</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Valor de Descuento (%)</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    disabled={form.type !== 'AUTO_DISCOUNT'}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: form.type !== 'AUTO_DISCOUNT' ? 'var(--background-alt)' : 'var(--background)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Limitar a Categoría</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '13px' }}
                >
                  <option value="">Todo el supermercado</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  Habilitar promoción
                </label>
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
