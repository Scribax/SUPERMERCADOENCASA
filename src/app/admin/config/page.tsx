'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Save, Store, Truck, MessageSquare, Mail, Clock } from 'lucide-react';

export default function AdminConfig() {
  const [config, setConfig] = useState({
    store_name: 'Superencasa',
    support_email: 'soporte@superencasa.com',
    whatsapp_number: '+5491122334455',
    shipping_cost: '290',
    free_shipping_threshold: '4500',
    business_hours: 'Lunes a Sábado de 08:00 a 21:00 hs',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          if (data.config) {
            setConfig((prev) => ({
              ...prev,
              ...data.config,
            }));
          }
        }
      } catch (e) {
        console.error(e);
        toast.error('Error al cargar configuraciones');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Configuración guardada correctamente.');
      } else {
        toast.error(data.error || 'Error al guardar configuración');
      }
    } catch (err) {
      toast.error('Error de red');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Cargando configuraciones...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Configuración del Supermercado</h1>
        <p style={{ color: 'var(--foreground-muted)' }}>Establecé los costos de envío, formas de contacto y datos principales del comercio.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '680px' }}>
        
        {/* Section 1: General Info */}
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={18} style={{ color: 'var(--primary)' }} /> Datos de la Tienda
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Nombre Comercial</label>
              <input
                type="text"
                name="store_name"
                value={config.store_name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Horario de Atención</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="business_hours"
                  value={config.business_hours}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
                <Clock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-muted)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} style={{ color: 'var(--success)' }} /> Canales de Contacto
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>WhatsApp (Incluir código país)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="whatsapp_number"
                  placeholder="+5491122334455"
                  value={config.whatsapp_number}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
                <MessageSquare size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-muted)' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Email de Soporte</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="support_email"
                  value={config.support_email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-muted)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Shipping Costs */}
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} style={{ color: 'var(--accent)' }} /> Costos de Entrega
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Costo de Envío Base ($)</label>
              <input
                type="number"
                name="shipping_cost"
                value={config.shipping_cost}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Envío Gratis Desde ($)</label>
              <input
                type="number"
                name="free_shipping_threshold"
                value={config.free_shipping_threshold}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '12px 30px',
            borderRadius: 'var(--radius-md)',
            fontWeight: '700',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Save size={18} /> {saving ? 'Guardando...' : 'Guardar Configuraciones'}
        </button>

      </form>
    </div>
  );
}
