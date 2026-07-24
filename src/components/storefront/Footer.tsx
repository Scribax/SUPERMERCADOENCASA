'use client';
import { ShoppingCart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0E4FAF', color: '#FFFFFF', paddingTop: '64px', paddingBottom: '32px', borderTop: '8px solid #74C33D' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <ShoppingCart size={32} color="#74C33D" />
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                Super<span style={{ color: '#74C33D' }}>encasa</span>
              </span>
            </div>
            <p style={{ color: '#DBEAFE', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
              Tu supermercado 100% online. Hacé tus compras de todos los días de la forma más rápida, fácil y segura.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#DBEAFE' }}>
                <Phone size={18} color="#74C33D" />
                <span>+54 9 11 1234-5678</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#DBEAFE' }}>
                <Mail size={18} color="#74C33D" />
                <span>hola@superencasa.com.ar</span>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '24px', color: '#FFFFFF' }}>Navegación</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#DBEAFE' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Inicio</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Todas las Ofertas</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Rubros</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cómo Comprar</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Revendedores</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '24px', color: '#FFFFFF' }}>Atención al Cliente</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#DBEAFE' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Preguntas Frecuentes</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Políticas de Envío</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Términos y Condiciones</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Botón de Arrepentimiento</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Defensa al Consumidor</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '24px', color: '#FFFFFF' }}>Zonas de Cobertura</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#DBEAFE', backgroundColor: '#1662C9', padding: '20px', borderRadius: '12px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} color="#74C33D" /> <span>Pigué</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} color="#74C33D" /> <span>Bahía Blanca</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} color="#74C33D" /> <span>Patagones</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} color="#74C33D" /> <span>Viedma</span></div>
              <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid rgba(96, 165, 250, 0.3)', fontWeight: '500', color: '#FFFFFF' }}>
                Próximamente más ciudades 🚀
              </div>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '32px', borderTop: '1px solid #1E40AF', fontSize: '14px', color: '#BFDBFE', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} Superencasa. Todos los derechos reservados.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidad</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
