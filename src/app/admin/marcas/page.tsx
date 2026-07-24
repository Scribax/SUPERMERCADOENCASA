'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function AdminBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBrand, setEditBrand] = useState<any>(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    logo: '',
  });

  const [saving, setSaving] = useState(false);

  const toast = useToast();

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      if (res.ok) {
        const data = await res.json();
        setBrands(data.brands || []);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar marcas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenCreateModal = () => {
    setEditBrand(null);
    setForm({
      name: '',
      logo: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand: any) => {
    setEditBrand(brand);
    setForm({
      name: brand.name,
      logo: brand.logo || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let url = '/api/brands';
      let method = 'POST';

      if (editBrand) {
        url = `/api/brands/${editBrand.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(editBrand ? 'Marca actualizada' : 'Marca creada');
        setIsModalOpen(false);
        fetchBrands();
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
    if (!confirm('¿Estás seguro de que querés eliminar esta marca? Se desvincularán los productos asociados.')) return;

    try {
      const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Marca eliminada');
        fetchBrands();
      } else {
        toast.error(data.error || 'Error al eliminar');
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  if (loading) {
    return <div>Cargando marcas...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Gestión de Marcas</h1>
          <p style={{ color: 'var(--foreground-muted)' }}>Administrá las marcas asociadas a tus productos.</p>
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
          <Plus size={16} /> Nueva Marca
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--foreground-muted)' }}>
              <th style={{ padding: '16px' }}>Img</th>
              <th style={{ padding: '16px' }}>Nombre</th>
              <th style={{ padding: '16px' }}>Slug</th>
              <th style={{ padding: '16px' }}>Productos vinculados</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px' }}>
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--primary)' }}>
                      {b.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </td>
                <td style={{ padding: '16px', fontWeight: '700' }}>{b.name}</td>
                <td style={{ padding: '16px', color: 'var(--foreground-muted)' }}>{b.slug}</td>
                <td style={{ padding: '16px', fontWeight: '600' }}>{b._count?.products || 0}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleOpenEditModal(b)}
                      style={{ padding: '6px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--background-alt)', color: 'var(--primary)' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      style={{ padding: '6px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--background-alt)', color: 'var(--error)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
              maxWidth: '440px',
              backgroundColor: 'var(--card-bg)',
              zIndex: 1001,
              padding: '30px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{editBrand ? 'Editar Marca' : 'Nueva Marca'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Nombre de la Marca</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Logo URL</label>
                <input
                  type="text"
                  value={form.logo}
                  placeholder="https://ejemplo.com/logo.png"
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
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
