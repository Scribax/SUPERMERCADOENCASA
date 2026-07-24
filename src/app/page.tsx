import Header from '@/components/storefront/Header';
import TopBenefits from '@/components/storefront/TopBenefits';
import Hero from '@/components/storefront/Hero';
import CategorySlider from '@/components/storefront/CategorySlider';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';
import Benefits from '@/components/storefront/Benefits';
import Footer from '@/components/storefront/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <TopBenefits />
      <Header />
      
      <main className="flex-1 w-full flex flex-col">
        <div className="w-full bg-[#E2E8F0] pt-4 pb-12">
          <Hero />
          <CategorySlider />
        </div>
        
        <div className="w-full bg-[#F8FAFC]">
          <FeaturedProducts />
        </div>
        
        <div className="w-full bg-white border-t border-slate-100">
          <Benefits />
        </div>
      </main>

      <Footer />
    </div>
  );
}
