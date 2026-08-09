'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Mail, Phone, MapPin } from 'lucide-react';

interface Locality {
  id: string;
  name: string;
  isActive: boolean;
}

export default function Footer() {
  const [config, setConfig] = useState({
    store_name: 'Superencasa',
    support_email: 'hola@superencasa.com.ar',
    whatsapp_number: '+54 9 2923 651516',
  });
  const [localities, setLocalities] = useState<Locality[]>([]);

  useEffect(() => {
    // Load config
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.config) {
          setConfig(prev => ({ ...prev, ...data.config }));
        }
      })
      .catch(() => {});

    // Load localities
    fetch('/api/localities')
      .then(res => res.json())
      .then(data => {
        if (data.localities) {
          setLocalities(data.localities.filter((l: Locality) => l.isActive));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer style={{ backgroundColor: '#0B3D7A', color: '#FFFFFF', paddingTop: '48px', paddingBottom: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '36px' }}>
          {/* Logo + About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#74C33D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={20} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '22px', fontWeight: '800' }}>
                {config.store_name.replace('Super', 'Super')}<span style={{ color: '#74C33D' }}>{config.store_name.includes('encasa') ? 'encasa' : ''}</span>
              </span>
            </div>
            <p style={{ color: '#93C5FD', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
              Tu supermercado 100% online. Comprá fácil, recibí en casa.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#BFDBFE' }}>
                <Phone size={15} color="#74C33D" />
                <span>{config.whatsapp_number}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#BFDBFE' }}>
                <Mail size={15} color="#74C33D" />
                <span>{config.support_email}</span>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px', color: '#FFFFFF' }}>Navegación</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#BFDBFE' }}>
              <li><a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Inicio</a></li>
              <li><a href="/como-funciona" style={{ color: 'inherit', textDecoration: 'none' }}>Cómo Funciona</a></li>
              <li><a href="/productos" style={{ color: 'inherit', textDecoration: 'none' }}>Ofertas</a></li>
              <li><a href="/productos" style={{ color: 'inherit', textDecoration: 'none' }}>Rubros</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Revendedores</a></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px', color: '#FFFFFF' }}>Ayuda</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#BFDBFE' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Preguntas Frecuentes</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Políticas de Envío</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Términos y Condiciones</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Botón de Arrepentimiento</a></li>
            </ul>
          </div>

          {/* Zonas de Cobertura */}
          <div>
            <h4 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px', color: '#FFFFFF' }}>Zonas de Cobertura</h4>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#BFDBFE',
              backgroundColor: 'rgba(255,255,255,0.06)', padding: '16px', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              {localities.length > 0 ? (
                <>
                  {localities.map(loc => (
                    <div key={loc.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} color="#74C33D" /> <span>{loc.name}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} color="#74C33D" /> <span>Pigué</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} color="#74C33D" /> <span>Bahía Blanca</span></div>
                </>
              )}
              <div style={{ marginTop: '6px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', fontWeight: '500', color: '#FFFFFF', fontSize: '12px' }}>
                Próximamente más ciudades 🚀
              </div>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', color: '#60A5FA', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} {config.store_name}. Todos los derechos reservados.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidad</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
