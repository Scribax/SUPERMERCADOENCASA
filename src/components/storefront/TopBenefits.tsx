'use client';
import WhatsAppButton from './WhatsAppButton';

export default function TopBenefits() {
  return (
    <div style={{ backgroundColor: '#F4F9F1', borderBottom: '1px solid #E2F0D9', width: '100%', fontSize: '13px', color: '#334155' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>🚚</span>
            <span><strong>Entrega rápida:</strong> Recibí tu pedido el día y horario elegido.</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <span><strong>Compra segura:</strong> Cifrado SSL y pasarelas de pago confiables.</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>🎧</span>
            <span><strong>Atención personalizada:</strong> Soporte directo por WhatsApp y email.</span>
          </span>
        </div>
        <div>
          <WhatsAppButton />
        </div>
      </div>
    </div>
  );
}
