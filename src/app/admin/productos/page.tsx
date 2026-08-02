'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Search, Plus, Edit, Trash2, ArrowUpDown, X, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters / Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null); // null if creating, product object if editing

  // Form states
  const [form, setForm] = useState({
    name: '',
    sku: '',
    barcode: '',
    description: '',
    price: '',
    offerPrice: '',
    stock: '',
    weight: '',
    images: '',
    categoryId: '',
    brandId: '',
    isActive: true,
    nutritionEnabled: false,
    nutritionCalories: '',
    nutritionFat: '',
    nutritionCarbs: '',
    nutritionProtein: '',
    nutritionFiber: '',
    nutritionSodium: '',
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
        const currentImages = form.images ? form.images.trim() : '';
        const updatedImages = currentImages 
          ? `${currentImages}, ${data.url}` 
          : data.url;
        setForm({ ...form, images: updatedImages });
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

  const fetchInitialData = async () => {
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/categories'),
        fetch('/api/brands'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
      if (brandRes.ok) {
        const brandData = await brandRes.json();
        setBrands(brandData.brands || []);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditProduct(null);
    setForm({
      name: '',
      sku: '',
      barcode: '',
      description: '',
      price: '',
      offerPrice: '',
      stock: '',
      weight: '',
      images: '',
      categoryId: categories[0]?.id || '',
      brandId: brands[0]?.id || '',
      isActive: true,
      nutritionEnabled: false,
      nutritionCalories: '',
      nutritionFat: '',
      nutritionCarbs: '',
      nutritionProtein: '',
      nutritionFiber: '',
      nutritionSodium: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode || '',
      description: product.description,
      price: product.price.toString(),
      offerPrice: product.offerPrice !== null ? product.offerPrice.toString() : '',
      stock: product.stock.toString(),
      weight: product.weight.toString(),
      images: product.images,
      categoryId: product.categoryId || '',
      brandId: product.brandId || '',
      isActive: product.isActive,
      nutritionEnabled: false,
      nutritionCalories: '',
      nutritionFat: '',
      nutritionCarbs: '',
      nutritionProtein: '',
      nutritionFiber: '',
      nutritionSodium: '',
    });
    // Parse nutrition JSON if present
    if (product.nutritionInfo) {
      try {
        const n = JSON.parse(product.nutritionInfo);
        setForm(prev => ({
          ...prev,
          nutritionEnabled: n.enabled || false,
          nutritionCalories: n.calories || '',
          nutritionFat: n.fat || '',
          nutritionCarbs: n.carbs || '',
          nutritionProtein: n.protein || '',
          nutritionFiber: n.fiber || '',
          nutritionSodium: n.sodium || '',
        }));
      } catch {}
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      offerPrice: form.offerPrice ? parseFloat(form.offerPrice) : null,
      stock: parseInt(form.stock),
      weight: parseFloat(form.weight),
      nutritionInfo: form.nutritionEnabled ? JSON.stringify({
        enabled: true,
        calories: form.nutritionCalories,
        fat: form.nutritionFat,
        carbs: form.nutritionCarbs,
        protein: form.nutritionProtein,
        fiber: form.nutritionFiber,
        sodium: form.nutritionSodium,
      }) : null,
    };

    try {
      let url = '/api/products';
      let method = 'POST';

      if (editProduct) {
        url = `/api/products/${editProduct.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(editProduct ? 'Producto actualizado' : 'Producto creado con éxito');
        setIsModalOpen(false);
        fetchInitialData(); // Refresh list
      } else {
        toast.error(data.error || 'Error al guardar el producto');
      }
    } catch (err) {
      toast.error('Error de red al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar este producto?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Producto eliminado con éxito');
        fetchInitialData();
      } else {
        toast.error(data.error || 'Error al eliminar producto');
      }
    } catch (e) {
      toast.error('Error de red');
    }
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === '' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCat;
  });

  if (loading) {
    return <div>Cargando catálogo de productos de administración...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Catálogo de Productos</h1>
          <p style={{ color: 'var(--foreground-muted)' }}>Crea, edita, y actualiza el stock o los precios en oferta.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>

      {/* Toolbar filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '14px' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-muted)' }} />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '14px' }}
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--foreground-muted)' }}>
                <th style={{ padding: '16px' }}>Img</th>
                <th style={{ padding: '16px' }}>Producto</th>
                <th style={{ padding: '16px' }}>SKU</th>
                <th style={{ padding: '16px' }}>Precio Base</th>
                <th style={{ padding: '16px' }}>Precio Oferta</th>
                <th style={{ padding: '16px' }}>Stock</th>
                <th style={{ padding: '16px' }}>Estado</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px' }}>
                    <img
                      src={p.images.split(',')[0]}
                      alt={p.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)' }}
                    />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div><strong>{p.name}</strong></div>
                    <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                      {categories.find((c) => c.id === p.categoryId)?.name || 'Sin Categoría'}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>{p.sku}</td>
                  <td style={{ padding: '16px', fontWeight: '600' }}>${p.price.toFixed(2)}</td>
                  <td style={{ padding: '16px', color: p.offerPrice ? 'var(--accent)' : 'inherit', fontWeight: p.offerPrice ? '700' : 'normal' }}>
                    {p.offerPrice ? `$${p.offerPrice.toFixed(2)}` : '-'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: p.stock <= 5 ? 'var(--error)' : 'inherit', fontWeight: p.stock <= 5 ? '700' : 'normal' }}>
                      {p.stock} uds
                    </span>
                  </td>
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
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        style={{ padding: '6px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--background-alt)', color: 'var(--error)' }}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--foreground-muted)', padding: '30px' }}>
                    No se encontraron productos en el catálogo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL DRAWER */}
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
              maxWidth: '680px',
              maxHeight: '85vh',
              overflowY: 'auto',
              backgroundColor: 'var(--card-bg)',
              zIndex: 1001,
              padding: '30px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              animation: 'modal-fade 0.2s ease',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{editProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2-col">
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Nombre del Producto</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>SKU (Código Interno)</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Precio Base ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Precio Oferta (Opc.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.offerPrice}
                    onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Stock Inicial</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Peso (kg)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Categoría</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '13px' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Marca</label>
                  <select
                    value={form.brandId}
                    onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '13px' }}
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Imagen URL (Separar por comas si son varias)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={form.images}
                    onChange={(e) => setForm({ ...form, images: e.target.value })}
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                  />
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {uploadingImage ? 'Subiendo...' : 'Subir Local'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                
                {/* Images Preview Gallery */}
                {form.images && form.images.split(',').filter(x => x.trim()).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {form.images.split(',').map((imgUrl, idx) => {
                      const trimmed = imgUrl.trim();
                      if (!trimmed) return null;
                      return (
                        <div key={idx} style={{ position: 'relative', width: '60px', height: '60px' }}>
                          <img
                            src={trimmed}
                            alt="Vista previa"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const parts = form.images.split(',').map(x => x.trim()).filter(x => x);
                              parts.splice(idx, 1);
                              setForm({ ...form, images: parts.join(', ') });
                            }}
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
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  Producto Habilitado (Visible en catálogo)
                </label>
              </div>

              {/* Información Nutricional */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginBottom: form.nutritionEnabled ? '12px' : '0' }}>
                  <input
                    type="checkbox"
                    checked={form.nutritionEnabled}
                    onChange={(e) => setForm({ ...form, nutritionEnabled: e.target.checked })}
                  />
                  📊 Mostrar Información Nutricional
                </label>
                {form.nutritionEnabled && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '2px' }}>Calorías (kcal)</label>
                      <input type="text" placeholder="250" value={form.nutritionCalories} onChange={(e) => setForm({ ...form, nutritionCalories: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '2px' }}>Grasas (g)</label>
                      <input type="text" placeholder="12" value={form.nutritionFat} onChange={(e) => setForm({ ...form, nutritionFat: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '2px' }}>Carbohidratos (g)</label>
                      <input type="text" placeholder="30" value={form.nutritionCarbs} onChange={(e) => setForm({ ...form, nutritionCarbs: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '2px' }}>Proteínas (g)</label>
                      <input type="text" placeholder="8" value={form.nutritionProtein} onChange={(e) => setForm({ ...form, nutritionProtein: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '2px' }}>Fibra (g)</label>
                      <input type="text" placeholder="3" value={form.nutritionFiber} onChange={(e) => setForm({ ...form, nutritionFiber: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '2px' }}>Sodio (mg)</label>
                      <input type="text" placeholder="120" value={form.nutritionSodium} onChange={(e) => setForm({ ...form, nutritionSodium: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '12px' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
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
                  {saving ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes modal-fade {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}
