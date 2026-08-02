'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Save, Store, Truck, MessageSquare, Mail, Clock, Image, Award } from 'lucide-react';

export default function AdminConfig() {
  const [config, setConfig] = useState({
    store_name: 'Superencasa',
    support_email: 'soporte@superencasa.com',
    whatsapp_number: '+549****4455',
    shipping_cost: '290',
    free_shipping_threshold: '4500',
    business_hours: 'Lunes a Sábado de 08:00 a 21:00 hs',
    hero_title: 'Tu supermercado en casa, todos los días',
    hero_subtitle: 'Miles de productos, las mejores marcas y entrega rápida en tu ciudad.',
    hero_badge: '🚀 ENVÍOS GRATIS +$25.000',
    hero_button: 'Comprar ahora',
    benefits_1_title: 'Miles de clientes',
    benefits_1_desc: 'ya confían en nosotros',
    benefits_2_title: 'Comercios locales',
    benefits_2_desc: 'productos de tu zona',
    benefits_3_title: 'Precios justos',
    benefits_3_desc: 'ofertas todos los días',
    benefits_4_title: '100% seguro',
    benefits_4_desc: 'datos protegidos',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => { if (data.config) setConfig(prev => ({ ...prev, ...data.config })); })
      .catch(() => {})
      .finally(() => setLoading(false));
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
      if (res.ok && data.success) toast.success('Configuración guardada.');
      else toast.error(data.error || 'Error al guardar');
    } catch { toast.error('Error de red'); }
    finally { setSaving(false); }
  };

  if (loading) return <div>Cargando configuraciones...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Configuración del Supermercado</h1>
        <p style={{ color: 'var(--foreground-muted)' }}>Modificá todos los textos, contactos y costos visibles en la tienda.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>
        
        {/* Tienda */}
        <Section icon={<Store size={18} color="var(--primary)" />} title="Datos de la Tienda">
          <Field label="Nombre Comercial" name="store_name" value={config.store_name} onChange={handleChange} />
          <Field label="Horario de Atención" name="business_hours" value={config.business_hours} onChange={handleChange} />
        </Section>

        {/* Contacto */}
        <Section icon={<MessageSquare size={18} color="var(--success)" />} title="Canales de Contacto">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="WhatsApp (+código país)" name="whatsapp_number" value={config.whatsapp_number} onChange={handleChange} />
            <Field label="Email de Soporte" name="support_email" value={config.support_email} onChange={handleChange} type="email" />
          </div>
        </Section>

        {/* Envíos */}
        <Section icon={<Truck size={18} color="var(--accent)" />} title="Costos de Entrega">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Costo de Envío Base ($)" name="shipping_cost" value={config.shipping_cost} onChange={handleChange} type="number" />
            <Field label="Envío Gratis Desde ($)" name="free_shipping_threshold" value={config.free_shipping_threshold} onChange={handleChange} type="number" />
          </div>
        </Section>

        {/* Hero Banner */}
        <Section icon={<Image size={18} color="var(--primary)" />} title="Texto del Banner Principal">
          <Field label="Badge (etiqueta verde)" name="hero_badge" value={config.hero_badge} onChange={handleChange} />
          <Field label="Título principal" name="hero_title" value={config.hero_title} onChange={handleChange} />
          <Field label="Subtítulo" name="hero_subtitle" value={config.hero_subtitle} onChange={handleChange} />
          <Field label="Texto del botón" name="hero_button" value={config.hero_button} onChange={handleChange} />
        </Section>

        {/* Beneficios */}
        <Section icon={<Award size={18} color="var(--success)" />} title="Beneficios (sección confianza)">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Beneficio 1 - Título" name="benefits_1_title" value={config.benefits_1_title} onChange={handleChange} />
            <Field label="Beneficio 1 - Descripción" name="benefits_1_desc" value={config.benefits_1_desc} onChange={handleChange} />
            <Field label="Beneficio 2 - Título" name="benefits_2_title" value={config.benefits_2_title} onChange={handleChange} />
            <Field label="Beneficio 2 - Descripción" name="benefits_2_desc" value={config.benefits_2_desc} onChange={handleChange} />
            <Field label="Beneficio 3 - Título" name="benefits_3_title" value={config.benefits_3_title} onChange={handleChange} />
            <Field label="Beneficio 3 - Descripción" name="benefits_3_desc" value={config.benefits_3_desc} onChange={handleChange} />
            <Field label="Beneficio 4 - Título" name="benefits_4_title" value={config.benefits_4_title} onChange={handleChange} />
            <Field label="Beneficio 4 - Descripción" name="benefits_4_desc" value={config.benefits_4_desc} onChange={handleChange} />
          </div>
        </Section>

        <button type="submit" disabled={saving} style={{
          alignSelf: 'flex-start', backgroundColor: 'var(--primary)', color: 'white',
          padding: '12px 30px', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '15px',
          display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-md)', border: 'none', cursor: 'pointer',
        }}>
          <Save size={18} /> {saving ? 'Guardando...' : 'Guardar Configuraciones'}
        </button>
      </form>
    </div>
  );
}

/* ─── Subcomponentes ─── */

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon} {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text' }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)', fontSize: '14px' }}
      />
    </div>
  );
}
