import { prisma } from '@/lib/db';
import TopBenefits from '@/components/storefront/TopBenefits';
import Header from '@/components/storefront/Header';
import HeroBanner from '@/components/storefront/HeroBanner';
import SidebarCategories from '@/components/storefront/SidebarCategories';
import HeroAffiliateCard from '@/components/storefront/HeroAffiliateCard';
import CategorySlider from '@/components/storefront/CategorySlider';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';
import Benefits from '@/components/storefront/Benefits';
import Footer from '@/components/storefront/Footer';
import CityBar from '@/components/storefront/CityBar';

export default async function Home() {
  const [categories, offerProducts, newProducts] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.product.findMany({
      where: { isActive: true, offerPrice: { not: null } },
      take: 12,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      take: 12,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const serializedCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: null,
  }));

  const serializeProducts = (products: any[]) => products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    barcode: p.barcode || null,
    description: p.description,
    price: Number(p.price),
    offerPrice: p.offerPrice ? Number(p.offerPrice) : null,
    stock: p.stock,
    weight: Number(p.weight),
    images: p.images,
    categoryId: p.categoryId || null,
    brandId: p.brandId || null,
  }));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TopBenefits />
      <Header />

      {/* HERO + CATEGORÍAS: todo integrado */}
      <section style={{ backgroundColor: '#E8EDF3', padding: '20px 16px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Fila: Sidebar | Banner (+ Affiliate flotante) */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
            <aside style={{ width: '230px', flexShrink: 0, display: 'flex' }}>
              <SidebarCategories categories={serializedCategories} />
            </aside>
            <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex' }}>
              <HeroBanner />
              <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 20, width: '250px' }}>
                <HeroAffiliateCard />
              </div>
            </div>
          </div>

          {/* Categorías pegadas abajo del banner */}
          <CategorySlider categories={serializedCategories} />
        </div>
      </section>

      {/* Productos + Benefits */}
      <main style={{ flex: 1, width: '100%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 16px 24px' }}>
          <FeaturedProducts title="Ofertas destacadas" products={serializeProducts(offerProducts)} />
          {newProducts.length > 0 && (
            <FeaturedProducts title="Recién llegados" products={serializeProducts(newProducts)} />
          )}
          <Benefits />
        </div>
      </main>

      <CityBar />
      <Footer />
    </div>
  );
}
