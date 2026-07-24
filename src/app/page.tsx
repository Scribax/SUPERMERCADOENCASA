import TopBenefits from '@/components/storefront/TopBenefits';
import Header from '@/components/storefront/Header';
import Hero from '@/components/storefront/Hero';
import CategorySlider from '@/components/storefront/CategorySlider';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';
import Benefits from '@/components/storefront/Benefits';
import Footer from '@/components/storefront/Footer';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TopBenefits />
      <Header />
      <main style={{ flex: 1, width: '100%' }}>
        <div style={{ backgroundColor: '#E8EDF3', paddingTop: '16px', paddingBottom: '48px' }}>
          <Hero />
          <CategorySlider />
        </div>
        <div style={{ backgroundColor: '#F8FAFC' }}>
          <FeaturedProducts />
        </div>
        <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
          <Benefits />
        </div>
      </main>
      <Footer />
    </div>
  );
}
