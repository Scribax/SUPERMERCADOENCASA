'use client';
import { motion } from 'framer-motion';
import SidebarCategories from './SidebarCategories';
import HeroAffiliateCard from './HeroAffiliateCard';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6" style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px', width: '100%' }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[480px]" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px', minHeight: '440px' }}>
        {/* Left Column: Sidebar Categories */}
        <div className="hidden lg:block lg:col-span-3 h-full" style={{ gridColumn: 'span 3', height: '100%' }}>
          <SidebarCategories />
        </div>

        {/* Center Column: Main Hero Banner */}
        <div className="col-span-1 lg:col-span-6 h-full" style={{ gridColumn: 'span 6', height: '100%' }}>
          <div className="bg-gradient-to-br from-[#0E4FAF] to-[#1662C9] rounded-2xl h-full p-8 md:p-10 flex flex-col justify-center relative overflow-hidden shadow-lg border border-blue-800/30" style={{ background: 'linear-gradient(135deg, #0E4FAF 0%, #1662C9 100%)', borderRadius: '16px', padding: '36px 40px', color: '#FFFFFF', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '440px' }}>
            <div className="relative z-10 max-w-md" style={{ position: 'relative', zIndex: 10, maxWidth: '420px' }}>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight" style={{ fontSize: '36px', fontWeight: '900', color: '#FFFFFF', lineHeight: 1.15, marginBottom: '16px' }}>
                Tu supermercado en casa, <br className="hidden md:block" />
                <span className="text-[#74C33D]" style={{ color: '#74C33D' }}>todos los días</span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 max-w-sm leading-relaxed" style={{ fontSize: '15px', color: '#E2E8F0', marginBottom: '28px', lineHeight: 1.5 }}>
                Miles de productos, las mejores marcas y entrega rápida en tu ciudad.
              </p>
              
              <motion.a
                href="/productos"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-[#74C33D] hover:bg-[#62A933] text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-md transition-colors inline-block"
                style={{ backgroundColor: '#74C33D', color: '#FFFFFF', padding: '14px 32px', borderRadius: '10px', fontWeight: '800', fontSize: '16px', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 14px rgba(116, 195, 61, 0.4)' }}
              >
                Comprar ahora
              </motion.a>
            </div>

            {/* 3D shopping basket image */}
            <div style={{ position: 'absolute', right: '-10px', bottom: '10px', zIndex: 1, pointerEvents: 'none' }}>
              <img
                src="/images/hero_shopping_basket.png"
                alt="Canasta de supermercado"
                style={{ width: '300px', height: '300px', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
              />
            </div>
            
            {/* Bottom Benefit Strip */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/10 backdrop-blur-sm border-t border-white/10 px-6 py-3 flex flex-wrap justify-between items-center text-sm text-white/90 z-10" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.15)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#FFFFFF', zIndex: 10 }}>
              <span className="flex items-center gap-2"><span>🚀</span> Envíos gratis (+$25.000)</span>
              <span className="hidden sm:flex items-center gap-2"><span>🏷️</span> Descuentos (exclusivos online)</span>
              <span className="hidden md:flex items-center gap-2"><span>💳</span> Pagá como quieras</span>
            </div>
          </div>
        </div>

        {/* Right Column: Affiliate Card */}
        <div className="col-span-1 lg:col-span-3 h-full" style={{ gridColumn: 'span 3', height: '100%' }}>
          <HeroAffiliateCard />
        </div>
      </div>
    </section>
  );
}
