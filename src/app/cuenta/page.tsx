'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/Toast';
import ProductCard from '@/components/ui/ProductCard';
import { User, ShoppingBag, Heart, MapPin, LogOut, Plus, Trash2, ShieldCheck, ChevronRight, ChevronDown } from 'lucide-react';

function CuentaContent() {
  const { user, loading, logout, checkUser } = useAuth();
  const { favorites } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const tabParam = searchParams.get('tab') || 'perfil';
  const [activeTab, setActiveTab] = useState<string>(tabParam);

  // States
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [favProducts, setFavProducts] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Loading states
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingFavs, setLoadingFavs] = useState(false);

  // Profile forms
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    password: '',
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    province: '',
    zipCode: '',
    isDefault: false,
  });
  const [savingAddress, setSavingAddress] = useState(false);

  // Sync tab param from URL
  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      toast.info('Iniciá sesión para acceder a tu cuenta.');
      router.push('/login?redirect=/cuenta');
    } else if (user) {
      setProfileForm({
        name: user.name,
        phone: user.profile?.phone || '',
        password: '',
      });
      setAddresses(user.addresses || []);
    }
  }, [user, loading, router, toast]);

  // Fetch orders when orders tab active
  useEffect(() => {
    if (activeTab === 'pedidos' && user) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await fetch('/api/orders');
          if (res.ok) {
            const data = await res.json();
            setOrders(data.orders || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, user]);

  // Fetch favorited product details
  useEffect(() => {
    if (activeTab === 'favoritos' && favorites.length > 0) {
      const fetchFavDetails = async () => {
        setLoadingFavs(true);
        try {
          const res = await fetch('/api/products?limit=100');
          if (res.ok) {
            const data = await res.json();
            const filtered = (data.products || []).filter((p: any) =>
              favorites.includes(p.id)
            );
            setFavProducts(filtered);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingFavs(false);
        }
      };
      fetchFavDetails();
    } else if (favorites.length === 0) {
      setFavProducts([]);
    }
  }, [activeTab, favorites]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('¡Perfil actualizado con éxito!');
        await checkUser(); // Sync auth context
      } else {
        toast.error(data.error || 'Error al actualizar perfil');
      }
    } catch (err) {
      toast.error('Error de red al actualizar perfil');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('¡Dirección agregada!');
        setShowAddressForm(false);
        setAddressForm({
          street: '',
          city: '',
          province: '',
          zipCode: '',
          isDefault: false,
        });
        
        // Refresh address list
        await checkUser();
        // Trigger local sync
        if (user) {
          const freshUserRes = await fetch('/api/auth/me');
          if (freshUserRes.ok) {
            const freshUserData = await freshUserRes.json();
            setAddresses(freshUserData.user.addresses || []);
          }
        }
      } else {
        toast.error(data.error || 'Error al guardar la dirección');
      }
    } catch (err) {
      toast.error('Error de red al guardar la dirección');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar esta dirección?')) return;

    try {
      const res = await fetch(`/api/addresses?id=${addrId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Dirección eliminada');
        await checkUser();
        
        // Refresh addresses locally
        const freshUserRes = await fetch('/api/auth/me');
        if (freshUserRes.ok) {
          const freshUserData = await freshUserRes.json();
          setAddresses(freshUserData.user.addresses || []);
        }
      } else {
        toast.error(data.error || 'Error al eliminar dirección');
      }
    } catch (err) {
      toast.error('Error de red');
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const translateStatus = (s: string) => {
    switch (s) {
      case 'PENDING': return 'Pendiente de pago';
      case 'PREPARING': return 'Preparando';
      case 'SHIPPED': return 'En camino';
      case 'DELIVERED': return 'Entregado';
      case 'CANCELLED': return 'Cancelado';
      default: return s;
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'PENDING': return 'var(--warning)';
      case 'PREPARING': return 'var(--primary)';
      case 'SHIPPED': return 'var(--accent)';
      case 'DELIVERED': return 'var(--success)';
      case 'CANCELLED': return 'var(--error)';
      default: return 'var(--foreground-muted)';
    }
  };

  if (loading || !user) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h3>Cargando portal de usuario...</h3>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Mi Cuenta</h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px' }}>Hola, <strong>{user.name}</strong>. Administrá tus compras, direcciones e información personal.</p>
      </div>

      {/* Account Grid */}
      <div className="account-grid">
        
        {/* Left Side: Navigation Tabs */}
        <aside>
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <button
              onClick={() => { setActiveTab('perfil'); router.push('/cuenta?tab=perfil'); }}
              style={{
                padding: '16px 20px',
                fontSize: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: activeTab === 'perfil' ? 'var(--primary)' : 'var(--foreground)',
                backgroundColor: activeTab === 'perfil' ? 'var(--primary-light)' : 'transparent',
                textAlign: 'left',
                borderLeft: activeTab === 'perfil' ? '4px solid var(--primary)' : 'none',
              }}
            >
              <User size={18} /> Mi Perfil
            </button>
            <button
              onClick={() => { setActiveTab('pedidos'); router.push('/cuenta?tab=pedidos'); }}
              style={{
                padding: '16px 20px',
                fontSize: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: activeTab === 'pedidos' ? 'var(--primary)' : 'var(--foreground)',
                backgroundColor: activeTab === 'pedidos' ? 'var(--primary-light)' : 'transparent',
                textAlign: 'left',
                borderLeft: activeTab === 'pedidos' ? '4px solid var(--primary)' : 'none',
              }}
            >
              <ShoppingBag size={18} /> Mis Pedidos
            </button>
            <button
              onClick={() => { setActiveTab('favoritos'); router.push('/cuenta?tab=favoritos'); }}
              style={{
                padding: '16px 20px',
                fontSize: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: activeTab === 'favoritos' ? 'var(--primary)' : 'var(--foreground)',
                backgroundColor: activeTab === 'favoritos' ? 'var(--primary-light)' : 'transparent',
                textAlign: 'left',
                borderLeft: activeTab === 'favoritos' ? '4px solid var(--primary)' : 'none',
              }}
            >
              <Heart size={18} /> Favoritos
            </button>
            <button
              onClick={() => { setActiveTab('direcciones'); router.push('/cuenta?tab=direcciones'); }}
              style={{
                padding: '16px 20px',
                fontSize: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: activeTab === 'direcciones' ? 'var(--primary)' : 'var(--foreground)',
                backgroundColor: activeTab === 'direcciones' ? 'var(--primary-light)' : 'transparent',
                textAlign: 'left',
                borderLeft: activeTab === 'direcciones' ? '4px solid var(--primary)' : 'none',
              }}
            >
              <MapPin size={18} /> Direcciones
            </button>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />
            <button
              onClick={logout}
              style={{
                padding: '16px 20px',
                fontSize: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'var(--error)',
                textAlign: 'left',
              }}
            >
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Right Side: Tab content panels */}
        <section
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* TAB 1: MI PERFIL */}
          {activeTab === 'perfil' && (
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Información de mi perfil</h3>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Nombre Completo</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Email (No editable)</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background-alt)', color: 'var(--foreground-muted)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Teléfono de Contacto</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Nueva Contraseña (Dejar vacío para mantener actual)</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={profileForm.password}
                  onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
              </div>
              <button
                type="submit"
                disabled={updatingProfile}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '12px 28px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '600',
                  alignSelf: 'flex-start',
                  marginTop: '10px',
                }}
              >
                {updatingProfile ? 'Actualizando...' : 'Guardar Cambios'}
              </button>
            </form>
          )}

          {/* TAB 2: MIS PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Historial de Pedidos</h3>
              {loadingOrders ? (
                <div>Cargando pedidos...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--foreground-muted)' }}>
                  Aún no has realizado ninguna compra.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orders.map((order) => {
                    const isExpanded = expandedOrder === order.id;
                    return (
                      <div
                        key={order.id}
                        style={{
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          backgroundColor: 'var(--background-alt)',
                        }}
                      >
                        {/* Order Header Row */}
                        <div
                          onClick={() => toggleOrderExpand(order.id)}
                          style={{
                            padding: '16px 20px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: '700' }}>#{order.id.slice(0, 8)}</span>
                            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginLeft: '12px' }}>
                              {new Date(order.createdAt).toLocaleDateString('es-AR')}
                            </span>
                          </div>
                          <div>
                            <span style={{ fontSize: '15px', fontWeight: '700', marginRight: '16px' }}>
                              Total: ${order.total.toFixed(2)}
                            </span>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                color: 'white',
                                backgroundColor: getStatusColor(order.status),
                                textTransform: 'uppercase',
                              }}
                            >
                              {translateStatus(order.status)}
                            </span>
                          </div>
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>

                        {/* Order Expanded Details */}
                        {isExpanded && (
                          <div style={{ padding: '20px', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--card-bg)' }}>
                            <div style={{ marginBottom: '16px', fontSize: '13px' }}>
                              <p><strong>Destinatario:</strong> {order.customerName}</p>
                              <p><strong>Dirección:</strong> {order.shippingAddress}</p>
                              <p><strong>Método de pago:</strong> {order.paymentMethod === 'TRANSFER' ? 'Transferencia' : order.paymentMethod === 'CASH' ? 'Efectivo' : 'Mercado Pago'}</p>
                            </div>
                            <h5 style={{ fontWeight: '700', fontSize: '13px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', marginBottom: '10px' }}>
                              Items del pedido
                            </h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {order.items.map((item: any) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                  <span>{item.name} x {item.quantity}</span>
                                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAVORITOS */}
          {activeTab === 'favoritos' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Mis Favoritos</h3>
              {loadingFavs ? (
                <div>Cargando favoritos...</div>
              ) : favProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--foreground-muted)' }}>
                  Aún no has guardado productos en favoritos. ¡Buscá lo que te gusta y hacé clic en el corazón!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                  {favProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DIRECCIONES */}
          {activeTab === 'direcciones' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Libreta de Direcciones</h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  style={{
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus size={16} /> Nueva dirección
                </button>
              </div>

              {/* Address Form */}
              {showAddressForm && (
                <form
                  onSubmit={handleAddressSubmit}
                  style={{
                    backgroundColor: 'var(--background-alt)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    marginBottom: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Agregar Dirección</h4>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Calle y Altura (Dpto / Oficina si aplica)</label>
                    <input
                      type="text"
                      name="street"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      required
                      style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Localidad / Ciudad</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Provincia</label>
                      <input
                        type="text"
                        value={addressForm.province}
                        onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Cód. Postal</label>
                      <input
                        type="text"
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      />
                      Establecer como dirección predeterminada
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground-muted)' }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingAddress}
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}
                    >
                      {savingAddress ? 'Guardando...' : 'Guardar dirección'}
                    </button>
                  </div>
                </form>
              )}

              {/* Address list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      backgroundColor: 'var(--background-alt)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '15px' }}>{addr.street}</strong>
                        {addr.isDefault && (
                          <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 6px', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-xs)' }}>
                            Predeterminada
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>
                        {addr.city}, {addr.province} (CP: {addr.zipCode})
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      style={{ color: 'var(--error)', padding: '6px' }}
                      title="Eliminar dirección"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {addresses.length === 0 && (
                  <p style={{ color: 'var(--foreground-muted)', textAlign: 'center', fontSize: '14px', padding: '20px 0' }}>
                    No tenés direcciones registradas aún.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        @media (max-width: 767px) {
          .account-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function CuentaPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '80px', textAlign: 'center' }}>
        <h3>Cargando cuenta...</h3>
      </div>
    }>
      <CuentaContent />
    </Suspense>
  );
}
