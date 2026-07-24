'use client';
import { ShoppingCart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0E4FAF] text-white pt-16 pb-8 border-t-[8px] border-[#74C33D]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Section 1 */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart size={32} className="text-[#74C33D]" />
              <span className="text-2xl font-bold text-white tracking-tight">
                Super<span className="text-[#74C33D]">encasa</span>
              </span>
            </div>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Tu supermercado 100% online. Hacé tus compras de todos los días de la forma más rápida, fácil y segura.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-blue-100">
                <Phone size={18} className="text-[#74C33D]" />
                <span>+54 9 11 1234-5678</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <Mail size={18} className="text-[#74C33D]" />
                <span>hola@superencasa.com.ar</span>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Navegación</h4>
            <ul className="space-y-3 text-sm text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Todas las Ofertas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rubros</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cómo Comprar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Revendedores</a></li>
            </ul>
          </div>

          {/* Section 2 (extra) */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Atención al Cliente</h4>
            <ul className="space-y-3 text-sm text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Políticas de Envío</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Botón de Arrepentimiento</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Defensa al Consumidor</a></li>
            </ul>
          </div>

          {/* Section 3: Cities */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Zonas de Cobertura</h4>
            <div className="flex flex-col gap-3 text-sm text-blue-100 bg-[#1662C9] p-5 rounded-xl border border-blue-400/30">
              <div className="flex items-center gap-2"><MapPin size={16} className="text-[#74C33D] shrink-0" /> <span>Pigué</span></div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-[#74C33D] shrink-0" /> <span>Bahía Blanca</span></div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-[#74C33D] shrink-0" /> <span>Patagones</span></div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-[#74C33D] shrink-0" /> <span>Viedma</span></div>
              <div className="mt-2 pt-3 border-t border-blue-400/30 font-medium text-white">
                Próximamente más ciudades 🚀
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Copyright */}
        <div className="pt-8 border-t border-blue-800 text-sm text-blue-200 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p>© {new Date().getFullYear()} Superencasa. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
