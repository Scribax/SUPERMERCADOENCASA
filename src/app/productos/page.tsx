'use client';

import React, { useState, useEffect, Suspense, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown, CheckSquare, Square } from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameter sync
  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('categoria') || '';

  // Active filters in state
  const [search, setSearch] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [orden, setOrden] = useState('mas-recientes');
  const [page, setPage] = useState(1);

  // Products and metadata
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter options loaded from database
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  // Mobile drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state when URL params change (e.g. from navbar search)
  useEffect(() => {
    const s = searchParams.get('search') || '';
    const c = searchParams.get('categoria') || '';
    setSearch(s);
    setSelectedCategory(c);
    setPage(1); // Reset page on new search
  }, [searchParams]);

  // Fetch filters (Categories and Brands)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands'),
        ]);
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
      }
    };
    fetchFilters();
  }, []);

  // Fetch products based on active filters
  const fetchProducts = async (pageToLoad: number, append = false) => {
    if (pageToLoad === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let url = `/api/products?page=${pageToLoad}&limit=12&orden=${orden}`;
      
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (selectedCategory) url += `&categoria=${encodeURIComponent(selectedCategory)}`;
      if (selectedBrand) url += `&marca=${encodeURIComponent(selectedBrand)}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (inStock) url += `&disponibilidad=in-stock`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (append) {
          setProducts((prev) => [...prev, ...data.products]);
        } else {
          setProducts(data.products || []);
        }
        setTotalProducts(data.pagination.total);
        setTotalPages(data.pagination.pages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Trigger fetch when parameters or filters change
  useEffect(() => {
    fetchProducts(1, false);
    setPage(1);
  }, [search, selectedCategory, selectedBrand, inStock, orden]);

  // Trigger fetch specifically when price filter is updated manually (can trigger with button or delay)
  const handleApplyPriceFilter = () => {
    fetchProducts(1, false);
    setPage(1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= totalPages) {
      setPage(nextPage);
      fetchProducts(nextPage, true);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setOrden('mas-recientes');
    router.push('/productos'); // Clear URL searchParams
  };

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      {/* Title / Breadcrumb / Total results */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginBottom: '8px' }}>
          Inicio &gt; <strong style={{ color: 'var(--foreground)' }}>Productos</strong>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800' }}>
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory)?.name || 'Categoría'
              : 'Todos los productos'}
          </h1>
          <span style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>
            {totalProducts} {totalProducts === 1 ? 'producto encontrado' : 'productos encontrados'}
          </span>
        </div>
      </div>

      {/* Grid Layout: Sidebar & Products */}
      <div className="catalog-grid">
        
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="desktop-filters">
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              position: 'sticky',
              top: '100px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <span style={{ fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={16} /> Filtros
              </span>
              <button onClick={handleClearFilters} style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
                Limpiar todo
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Categoría</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                  />
                  Todas
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.slug || selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.slug)}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Marca</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === ''}
                    onChange={() => setSelectedBrand('')}
                  />
                  Todas
                </label>
                {brands.map((brand) => (
                  <label key={brand.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === brand.slug || selectedBrand === brand.id}
                      onChange={() => setSelectedBrand(brand.slug)}
                    />
                    {brand.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Precio</h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border)',
                    fontSize: '13px',
                    backgroundColor: 'var(--background)',
                  }}
                />
                <span style={{ color: 'var(--foreground-muted)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border)',
                    fontSize: '13px',
                    backgroundColor: 'var(--background)',
                  }}
                />
              </div>
              <button
                onClick={handleApplyPriceFilter}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                Filtrar Precio
              </button>
            </div>

            {/* Availability */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                Solo En Stock
              </label>
            </div>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <div>
          {/* Top toolbar: Mobile Filters trigger & Sort drop */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
            }}
          >
            {/* Mobile Filters button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              style={{
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                fontSize: '14px',
              }}
              className="mobile-filters-trigger"
            >
              <SlidersHorizontal size={18} /> Filtrar y Ordenar
            </button>

            <span className="desktop-only-text" style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>
              Mostrando {products.length} de {totalProducts} productos
            </span>

            {/* Sort selection */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>Ordenar por:</span>
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                <option value="mas-recientes">Más recientes</option>
                <option value="menor-precio">Menor precio</option>
                <option value="mayor-precio">Mayor precio</option>
                <option value="mas-vendidos">Más populares</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            /* Skeleton Loading State */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
              {[1, 2, 3, 4, 6, 7, 8, 9].map((n) => (
                <div
                  key={n}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div className="skeleton" style={{ height: '180px', borderRadius: 'var(--radius-sm)' }} />
                  <div className="skeleton" style={{ width: '40%', height: '12px' }} />
                  <div className="skeleton" style={{ width: '90%', height: '18px' }} />
                  <div className="skeleton" style={{ width: '60%', height: '18px' }} />
                  <div className="skeleton" style={{ width: '100%', height: '38px', marginTop: '12px' }} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: 'var(--foreground-muted)',
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--foreground)' }}>
                No encontramos productos
              </h3>
              <p style={{ fontSize: '14px', maxWidth: '360px', margin: '0 auto 20px' }}>
                Intentá quitando algunos filtros de búsqueda o escribiendo un término diferente.
              </p>
              <button
                onClick={handleClearFilters}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '600',
                }}
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            /* Products Rendering */
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {/* Load More Button */}
              {page < totalPages && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    style={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--primary)',
                      color: 'var(--primary)',
                      padding: '12px 36px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: '700',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                  >
                    {loadingMore ? 'Cargando más...' : 'Cargar más productos'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS SIDE SHEET */}
      {mobileFiltersOpen && (
        <>
          <div
            onClick={() => setMobileFiltersOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1100 }}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '80%',
              maxWidth: '320px',
              backgroundColor: 'var(--card-bg)',
              zIndex: 1101,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <span style={{ fontWeight: '700', fontSize: '18px' }}>Filtros</span>
              <button onClick={() => setMobileFiltersOpen(false)} style={{ fontWeight: '700' }}>Cerrar</button>
            </div>
            
            {/* Same Filters as desktop - shortened for space */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Categoría</h4>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Marca</h4>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
              >
                <option value="">Todas</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.slug}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Precio Mínimo / Máximo</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--background)' }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--background)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                Solo En Stock
              </label>
            </div>

            <button
              onClick={() => {
                fetchProducts(1, false);
                setMobileFiltersOpen(false);
              }}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                textAlign: 'center',
                marginTop: 'auto',
              }}
            >
              Aplicar Filtros
            </button>
            <button
              onClick={() => {
                handleClearFilters();
                setMobileFiltersOpen(false);
              }}
              style={{
                color: 'var(--foreground-muted)',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              Limpiar todo
            </button>
          </div>
        </>
      )}

      {/* CSS media queries */}
      <style jsx global>{`
        @media (min-width: 992px) {
          .catalog-grid { grid-template-columns: 260px 1fr !important; }
          .desktop-filters { display: block !important; }
          .mobile-filters-trigger { display: none !important; }
        }
        @media (max-width: 991px) {
          .catalog-grid { grid-template-columns: 1fr !important; }
          .desktop-filters { display: none !important; }
          .mobile-filters-trigger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '60px', textAlign: 'center' }}>
        <h3>Cargando catálogo...</h3>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
