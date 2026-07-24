'use client';
import { motion } from 'framer-motion';
import SidebarCategories from './SidebarCategories';
import HeroAffiliateCard from './HeroAffiliateCard';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[480px]">
        {/* Left Column: Sidebar Categories */}
        <div className="hidden lg:block lg:col-span-3 h-full">
          <SidebarCategories />
        </div>

        {/* Center Column: Main Hero Banner */}
        <div className="col-span-1 lg:col-span-6 h-full">
          <div className="bg-gradient-to-br from-[#0E4FAF] to-[#1662C9] rounded-2xl h-full p-8 md:p-10 flex flex-col justify-center relative overflow-hidden shadow-lg border border-blue-800/30">
            <div className="relative z-10 max-w-md">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                Tu supermercado en casa, <br className="hidden md:block" />
                <span className="text-[#74C33D]">todos los días</span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 max-w-sm leading-relaxed">
                Miles de productos, las mejores marcas y entrega rápida en tu ciudad.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#74C33D] hover:bg-[#62A933] text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-md transition-colors"
              >
                Comprar ahora
              </motion.button>
            </div>

            {/* Placeholder for 3D shopping basket image */}
            <div className="absolute right-0 bottom-0 w-64 h-64 md:w-80 md:h-80 opacity-20 md:opacity-100 pointer-events-none transform translate-x-10 translate-y-10">
              <div className="w-full h-full bg-white/20 rounded-full blur-3xl absolute"></div>
              {/* Note: User must provide /images/hero_shopping_basket.png */}
            </div>
            
            {/* Bottom Benefit Strip */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/10 backdrop-blur-sm border-t border-white/10 px-6 py-3 flex flex-wrap justify-between items-center text-sm text-white/90 z-10">
              <span className="flex items-center gap-2"><span>🚀</span> Envíos gratis (+$25.000)</span>
              <span className="hidden sm:flex items-center gap-2"><span>🏷️</span> Descuentos (exclusivos online)</span>
              <span className="hidden md:flex items-center gap-2"><span>💳</span> Pagá como quieras</span>
            </div>
          </div>
        </div>

        {/* Right Column: Affiliate Card */}
        <div className="col-span-1 lg:col-span-3 h-full">
          <HeroAffiliateCard />
        </div>
      </div>
    </section>
  );
}
