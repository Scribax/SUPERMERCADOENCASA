import React from 'react';

export default function TrustFooterBar() {
  return (
    <div style={{ marginTop: '60px' }}>
      {/* Top Green Trust Bar */}
      <div style={{ backgroundColor: '#F4F9F1', padding: '32px 0', borderTop: '1px solid #E5E7EB' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 200px' }}>
            <span style={{ fontSize: '24px' }}>👥</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#111827', fontSize: '14px' }}>Miles de clientes</div>
              <div style={{ color: '#4B5563', fontSize: '13px' }}>ya confían en Superencasa</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 200px' }}>
            <span style={{ fontSize: '24px' }}>🏪</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#111827', fontSize: '14px' }}>Comercios locales</div>
              <div style={{ color: '#4B5563', fontSize: '13px' }}>vendé tus productos online</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 200px' }}>
            <span style={{ fontSize: '24px' }}>🏷️</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#111827', fontSize: '14px' }}>Precios justos</div>
              <div style={{ color: '#4B5563', fontSize: '13px' }}>ofertas todos los días</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 200px' }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#111827', fontSize: '14px' }}>100% seguro</div>
              <div style={{ color: '#4B5563', fontSize: '13px' }}>tus datos siempre protegidos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Dark Blue Cities Bar */}
      <div style={{ backgroundColor: '#0A2540', color: 'white', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
          <span style={{ fontWeight: 'bold' }}>Estamos en:</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📍 Pigué</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📍 Bahía Blanca</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📍 Patagones</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📍 Viedma</span>
          <span style={{ color: '#9CA3AF', fontStyle: 'italic', marginLeft: '16px' }}>Próximamente más ciudades 🚀</span>
        </div>
      </div>
    </div>
  );
}
