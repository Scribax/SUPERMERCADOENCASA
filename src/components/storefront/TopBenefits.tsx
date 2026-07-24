'use client';
import WhatsAppButton from './WhatsAppButton';

export default function TopBenefits() {
  return (
    <div className="bg-[#F4F9F1] border-b border-[#E2F0D9] w-full">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-slate-700">
        <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center">
          <span className="flex items-center gap-1.5">
            <span className="text-lg">🚚</span>
            <strong>Entrega rápida:</strong> Recibí tu pedido el día y horario elegido.
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <span className="text-lg">🛡️</span>
            <strong>Compra segura:</strong> Cifrado SSL y pasarelas de pago confiables.
          </span>
          <span className="hidden lg:flex items-center gap-1.5">
            <span className="text-lg">🎧</span>
            <strong>Atención personalizada:</strong> Soporte directo por WhatsApp y email.
          </span>
        </div>
        <div>
          <WhatsAppButton />
        </div>
      </div>
    </div>
  );
}
