'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    order: '0',
  });

  const [saving, setSaving] = useState(false);

  const toast = useToast();

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setForm({ ...form, image: data.url });
        toast.success('¡Imagen subida correctamente!');
      } else {
        toast.error(data.error || 'Error al subir la imagen');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al conectar con el servidor de subida');
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditCategory(null);
    setForm({
      name: '',
      description: '',
      image: '',
      order: '0',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: any) => {
    setEditCategory(category);
    setForm({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      order: category.order.toString(),
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let url = '/api/categories';
      let method = 'POST';

      if (editCategory) {
        url = `/api/categories/${editCategory.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(editCategory ? 'Categoría actualizada' : 'Categoría creada');
        setIsModalOpen(false);
        fetchCategories();
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
    if (!confirm('¿Estás seguro de que querés eliminar esta categoría? Se desvincularán los productos asociados.')) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Categoría eliminada');
        fetchCategories();
      } else {
        toast.error(data.error || 'Error al eliminar');
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Gestión de Categorías</h1>
          <p style={{ color: 'var(--foreground-muted)' }}>Administrá las secciones y departamentos de tu supermercado.</p>
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
          <Plus size={16} /> Nueva Categoría
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--foreground-muted)' }}>
              <th style={{ padding: '16px' }}>Img</th>
              <th style={{ padding: '16px' }}>Nombre</th>
              <th style={{ padding: '16px' }}>Descripción</th>
              <th style={{ padding: '16px' }}>Peso de Orden</th>
              <th style={{ padding: '16px' }}>Productos</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px' }}>
                  {c.image ? (
                    <img src={c.image} alt={c.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🥗</div>
                  )}
                </td>
                <td style={{ padding: '16px', fontWeight: '700' }}>{c.name}</td>
                <td style={{ padding: '16px', color: 'var(--foreground-muted)' }}>{c.description || '-'}</td>
                <td style={{ padding: '16px' }}>{c.order}</td>
                <td style={{ padding: '16px', fontWeight: '600' }}>{c._count?.products || 0}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleOpenEditModal(c)}
                      style={{ padding: '6px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--background-alt)', color: 'var(--primary)' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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
              maxWidth: '500px',
              backgroundColor: 'var(--card-bg)',
              zIndex: 1001,
              padding: '30px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{editCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
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
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Imagen URL</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      value={form.image}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      style={{ flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                    />
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {uploadingImage ? '...' : 'Subir'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  
                  {/* Single Image Preview */}
                  {form.image && (
                    <div style={{ position: 'relative', width: '60px', height: '60px', marginTop: '10px' }}>
                      <img
                        src={form.image}
                        alt="Vista previa"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: '' })}
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          backgroundColor: 'var(--error)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                        title="Eliminar imagen"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Orden</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                  />
                </div>
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
