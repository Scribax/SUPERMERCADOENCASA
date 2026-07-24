'use client';
import WhatsAppButton from './WhatsAppButton';

export default function TopBenefits() {
  return (
    <div style={{ backgroundColor: '#F4F9F1', borderBottom: '1px solid #E2F0D9', width: '100%', fontSize: '12px', color: '#334155' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '6px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>🚚</span>
            <span><strong>Entrega rápida</strong> · Pedido el día elegido</span>
          </span>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>🛡️</span>
            <span><strong>Compra segura</strong> · Cifrado SSL</span>
          </span>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>🎧</span>
            <span><strong>Atención personalizada</strong> · WhatsApp y email</span>
          </span>
        </div>
        <div style={{ flexShrink: 0 }}>
          <WhatsAppButton />
        </div>
      </div>
    </div>
  );
}
