'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown, ArrowLeft, Home } from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('categoria') || '';

  const [search, setSearch] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [orden, setOrden] = useState('mas-recientes');
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const s = searchParams.get('search') || '';
    const c = searchParams.get('categoria') || '';
    setSearch(s);
    setSelectedCategory(c);
    setPage(1);
  }, [searchParams]);

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
      } catch (e) { console.error(e); }
    };
    fetchFilters();
  }, []);

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
    } catch (e) { console.error(e); }
    finally { setLoading(false); setLoadingMore(false); }
  };

  useEffect(() => {
    fetchProducts(1, false);
    setPage(1);
  }, [search, selectedCategory, selectedBrand, inStock, orden]);

  const handleApplyPriceFilter = () => { fetchProducts(1, false); setPage(1); };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= totalPages) { setPage(nextPage); fetchProducts(nextPage, true); }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setOrden('mas-recientes');
    router.push('/productos');
  };

  const categoryName = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory)?.name
    : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingTop: '24px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>

        {/* Breadcrumb + Back button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            <Link href="/" style={{ color: '#0E4FAF', textDecoration: 'none', fontWeight: '600' }}>Inicio</Link>
            {' > '}
            <strong style={{ color: '#1E293B' }}>{categoryName || 'Productos'}</strong>
          </p>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#0E4FAF',
              fontWeight: '600',
              fontSize: '13px',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #DBEAFE',
              backgroundColor: '#EFF6FF',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DBEAFE';
              e.currentTarget.style.borderColor = '#93C5FD';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#EFF6FF';
              e.currentTarget.style.borderColor = '#DBEAFE';
            }}
          >
            <Home size={16} /> Volver al inicio
          </Link>
        </div>

        {/* Title + Results count */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            {categoryName || 'Todos los productos'}
          </h1>
          <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '500' }}>
            {totalProducts} {totalProducts === 1 ? 'producto encontrado' : 'productos encontrados'}
          </span>
        </div>

        {/* Grid: Filters + Products */}
        <div className="catalog-grid" style={{ display: 'grid', gap: '28px' }}>
          {/* SIDEBAR FILTERS */}
          <aside className="desktop-filters">
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              position: 'sticky',
              top: '90px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
                <span style={{ fontWeight: '700', fontSize: '16px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={16} color="#0E4FAF" /> Filtros
                </span>
                <button onClick={handleClearFilters} style={{ fontSize: '12px', color: '#0E4FAF', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer' }}>
                  Limpiar todo
                </button>
              </div>

              {/* Categories */}
              <FilterSection title="Categoría" defaultOpen>
                <CustomRadio
                  label="Todas"
                  checked={selectedCategory === ''}
                  onChange={() => setSelectedCategory('')}
                />
                {categories.map((cat) => (
                  <CustomRadio
                    key={cat.id}
                    label={cat.name}
                    checked={selectedCategory === cat.slug || selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.slug)}
                  />
                ))}
              </FilterSection>

              {/* Brands */}
              <FilterSection title="Marca">
                <CustomRadio
                  label="Todas"
                  checked={selectedBrand === ''}
                  onChange={() => setSelectedBrand('')}
                />
                {brands.map((brand) => (
                  <CustomRadio
                    key={brand.id}
                    label={brand.name}
                    checked={selectedBrand === brand.slug || selectedBrand === brand.id}
                    onChange={() => setSelectedBrand(brand.slug)}
                  />
                ))}
              </FilterSection>

              {/* Price */}
              <FilterSection title="Precio">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                  <PriceInput placeholder="Min" value={minPrice} onChange={setMinPrice} />
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>-</span>
                  <PriceInput placeholder="Max" value={maxPrice} onChange={setMaxPrice} />
                </div>
                <button
                  onClick={handleApplyPriceFilter}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #0E4FAF',
                    backgroundColor: '#EFF6FF',
                    color: '#0E4FAF',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Filtrar Precio
                </button>
              </FilterSection>

              {/* Stock */}
              <div>
                <CustomCheckbox
                  label="Solo productos en stock"
                  checked={inStock}
                  onChange={setInStock}
                />
              </div>
            </div>
          </aside>

          {/* PRODUCTS AREA */}
          <div>
            {/* Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            }}>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="mobile-filters-trigger"
                style={{ alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}
              >
                <SlidersHorizontal size={18} /> Filtrar y Ordenar
              </button>

              <span className="desktop-only-text" style={{ fontSize: '13px', color: '#94A3B8' }}>
                Mostrando {products.length} de {totalProducts} productos
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>Ordenar por:</span>
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  style={{
                    padding: '7px 32px 7px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1E293B',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23475569\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
                {[1,2,3,4,5,6].map((n) => (
                  <div key={n} style={{ padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#FFFFFF' }}>
                    <div className="skeleton" style={{ height: '180px', borderRadius: '10px' }} />
                    <div className="skeleton" style={{ width: '40%', height: '12px' }} />
                    <div className="skeleton" style={{ width: '90%', height: '16px' }} />
                    <div className="skeleton" style={{ width: '55%', height: '16px' }} />
                    <div className="skeleton" style={{ width: '100%', height: '38px', marginTop: '8px' }} />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94A3B8' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1E293B' }}>No encontramos productos</h3>
                <p style={{ fontSize: '14px', maxWidth: '360px', margin: '0 auto 20px' }}>
                  Intentá quitando algunos filtros o escribiendo un término diferente.
                </p>
                <button onClick={handleClearFilters} style={{ backgroundColor: '#0E4FAF', color: '#FFF', padding: '10px 24px', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                  Limpiar todos los filtros
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
                  {products.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>

                {page < totalPages && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #0E4FAF',
                        color: '#0E4FAF',
                        padding: '12px 40px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0E4FAF'; e.currentTarget.style.color = '#FFF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#0E4FAF'; }}
                    >
                      {loadingMore ? 'Cargando...' : 'Cargar más productos'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* MOBILE FILTERS DRAWER */}
        {mobileFiltersOpen && (
          <>
            <div onClick={() => setMobileFiltersOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1100 }} />
            <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '80%', maxWidth: '320px', backgroundColor: '#FFFFFF', zIndex: 1101, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
                <span style={{ fontWeight: '700', fontSize: '18px', color: '#1E293B' }}>Filtros</span>
                <button onClick={() => setMobileFiltersOpen(false)} style={{ fontWeight: '700', color: '#64748B', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px' }}>✕</button>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#1E293B' }}>Categoría</h4>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC', fontSize: '14px' }}>
                  <option value="">Todas</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#1E293B' }}>Marca</h4>
                <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC', fontSize: '14px' }}>
                  <option value="">Todas</option>
                  {brands.map((brand) => <option key={brand.id} value={brand.slug}>{brand.name}</option>)}
                </select>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#1E293B' }}>Precio</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC', fontSize: '14px' }} />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC', fontSize: '14px' }} />
                </div>
              </div>
              <button
                onClick={() => { fetchProducts(1, false); setMobileFiltersOpen(false); }}
                style={{ backgroundColor: '#0E4FAF', color: '#FFF', padding: '14px', borderRadius: '10px', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '15px' }}
              >
                Aplicar Filtros
              </button>
              <button onClick={() => { handleClearFilters(); setMobileFiltersOpen(false); }} style={{ color: '#64748B', fontSize: '14px', textAlign: 'center', border: 'none', background: 'none', cursor: 'pointer' }}>
                Limpiar todo
              </button>
            </div>
          </>
        )}

        {/* CSS */}
        <style jsx global>{`
          @media (min-width: 992px) {
            .catalog-grid { grid-template-columns: 260px 1fr !important; }
            .desktop-filters { display: block !important; }
            .mobile-filters-trigger { display: none !important; }
            .desktop-only-text { display: block !important; }
          }
          @media (max-width: 991px) {
            .catalog-grid { grid-template-columns: 1fr !important; }
            .desktop-filters { display: none !important; }
            .mobile-filters-trigger { display: flex !important; }
            .desktop-only-text { display: none !important; }
          }
          .skeleton {
            background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s ease-in-out infinite;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ─── Subcomponentes ─── */

function FilterSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: 0, marginBottom: open ? '10px' : '0',
          border: 'none', background: 'none', cursor: 'pointer',
          fontSize: '14px', fontWeight: '700', color: '#1E293B',
        }}
      >
        {title}
        <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', color: '#94A3B8' }} />
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function CustomRadio({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label
      onClick={onChange}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px',
        cursor: 'pointer', padding: '6px 8px', borderRadius: '6px',
        color: checked ? '#0E4FAF' : '#475569',
        fontWeight: checked ? '600' : '400',
        backgroundColor: checked ? '#EFF6FF' : 'transparent',
        transition: 'all 0.15s',
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        border: checked ? '2px solid #0E4FAF' : '2px solid #CBD5E1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {checked && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0E4FAF' }} />}
      </div>
      {label}
    </label>
  );
}

function CustomCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px',
        cursor: 'pointer', color: '#475569', fontWeight: '500',
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '4px',
        border: checked ? '2px solid #0E4FAF' : '2px solid #CBD5E1',
        backgroundColor: checked ? '#0E4FAF' : '#FFFFFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.15s',
      }}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {label}
    </label>
  );
}

function PriceInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', padding: '8px 10px', borderRadius: '8px',
        border: '1px solid #E2E8F0', fontSize: '13px',
        backgroundColor: '#F8FAFC', color: '#1E293B',
      }}
    />
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
        <h3>Cargando catálogo...</h3>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
