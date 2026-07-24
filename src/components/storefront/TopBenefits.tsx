'use client';
import WhatsAppButton from './WhatsAppButton';

export default function TopBenefits() {
  return (
    <div className="bg-[#F4F9F1] border-b border-[#E2F0D9] w-full" style={{ backgroundColor: '#F4F9F1', borderBottom: '1px solid #E2F0D9', width: '100%', fontSize: '13px', color: '#334155' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-slate-700" style={{ maxWidth: '1240px', margin: '0 auto', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <span className="flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="text-lg">🚚</span>
            <span><strong>Entrega rápida:</strong> Recibí tu pedido el día y horario elegido.</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="text-lg">🛡️</span>
            <span><strong>Compra segura:</strong> Cifrado SSL y pasarelas de pago confiables.</span>
          </span>
          <span className="hidden lg:flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="text-lg">🎧</span>
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
