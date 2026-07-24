import { prisma } from '@/lib/db';
import TopBenefits from '@/components/storefront/TopBenefits';
import Header from '@/components/storefront/Header';
import Hero from '@/components/storefront/Hero';
import CategorySlider from '@/components/storefront/CategorySlider';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';
import Benefits from '@/components/storefront/Benefits';
import Footer from '@/components/storefront/Footer';

export default async function Home() {
  const [categories, offerProducts, newProducts] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: 'asc' }, take: 12 }),
    prisma.product.findMany({
      where: { isActive: true, offerPrice: { not: null } },
      take: 10,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Serialize for client components
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
      <main style={{ flex: 1, width: '100%' }}>
        <div style={{ backgroundColor: '#E8EDF3', paddingTop: '16px', paddingBottom: '48px' }}>
          <Hero categories={serializedCategories} />
          <CategorySlider categories={serializedCategories} />
        </div>
        <div style={{ backgroundColor: '#F8FAFC' }}>
          <FeaturedProducts title="Ofertas destacadas" products={serializeProducts(offerProducts)} />
        </div>
        {newProducts.length > 0 && (
          <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
            <FeaturedProducts title="Recién llegados" products={serializeProducts(newProducts)} />
          </div>
        )}
        <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
          <Benefits />
        </div>
      </main>
      <Footer />
    </div>
  );
}
