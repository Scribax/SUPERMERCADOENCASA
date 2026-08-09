import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';

const adapter = new PrismaLibSql({
  url: databaseUrl,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('DATABASE_URL from env:', process.env.DATABASE_URL);
  console.log('Seeding database...');

  // 1. Create Default Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@superencasa.com' },
    update: {},
    create: {
      email: 'admin@superencasa.com',
      passwordHash,
      name: 'Administrador Superencasa',
      role: 'ADMIN',
      profile: {
        create: {
          phone: '+54 9 2923 651516',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        },
      },
      addresses: {
        create: {
          street: 'Av. Corrientes 1234',
          city: 'Capital Federal',
          province: 'Buenos Aires',
          zipCode: '1043',
          isDefault: true,
        },
      },
    },
  });
  console.log('Admin user seeded:', admin.email);

  // 2. Create Store Config
  const configs = [
    { key: 'store_name', value: 'Superencasa' },
    { key: 'shipping_cost', value: '290' },
    { key: 'free_shipping_threshold', value: '4500' },
    { key: 'whatsapp_number', value: '+54 9 2923 651516' },
    { key: 'support_email', value: 'soporte@superencasa.com' },
    { key: 'instagram_url', value: 'https://instagram.com/superencasa' },
    { key: 'facebook_url', value: 'https://facebook.com/superencasa' },
    { key: 'business_hours', value: 'Lunes a Sábado de 08:00 a 21:00 hs' },
    { key: 'seo_global_title', value: 'Superencasa | Tu Supermercado 100% Online' },
    { key: 'seo_global_description', value: 'Comprá online al mejor precio. Envíos rápidos, productos frescos y atención personalizada del campo a tu casa.' },
  ];

  for (const config of configs) {
    await prisma.storeConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: { key: config.key, value: config.value },
    });
  }
  console.log('Store configuration seeded');

  // 3. Create Categories
  const categoriesData = [
    { name: 'Frutas y Verduras', slug: 'frutas-y-verduras', order: 1, image: 'https://images.unsplash.com/photo-1610832958506-ee5633613df2?auto=format&fit=crop&q=80&w=400' },
    { name: 'Lácteos y Quesos', slug: 'lacteos-y-quesos', order: 2, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=400' },
    { name: 'Almacén y Secos', slug: 'almacen', order: 3, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400' },
    { name: 'Bebidas', slug: 'bebidas', order: 4, image: 'https://images.unsplash.com/photo-1527960656366-ee2a999e32e6?auto=format&fit=crop&q=80&w=400' },
    { name: 'Carnes y Pescados', slug: 'carnes-y-pescados', order: 5, image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=400' },
    { name: 'Limpieza e Higiene', slug: 'limpieza', order: 6, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400' },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { order: cat.order, image: cat.image },
      create: {
        name: cat.name,
        slug: cat.slug,
        order: cat.order,
        image: cat.image,
        description: `Productos seleccionados de ${cat.name}`,
        metaTitle: `${cat.name} al mejor precio | Superencasa`,
        metaDescription: `Comprá online en nuestra sección de ${cat.name}. Productos de alta calidad y frescura garantizada con envíos a domicilio.`,
      },
    });
    categoriesMap[cat.slug] = createdCat.id;
  }
  console.log('Categories seeded:', Object.keys(categoriesMap).length);

  // 4. Create Brands
  const brandsData = [
    { name: 'La Serenísima', slug: 'la-serenisima', logo: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=150' },
    { name: 'Coca-Cola', slug: 'coca-cola', logo: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=150' },
    { name: 'Arcor', slug: 'arcor', logo: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=150' },
    { name: 'Knorr', slug: 'knorr', logo: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=150' },
    { name: 'Granix', slug: 'granix', logo: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&q=80&w=150' },
    { name: 'Nestlé', slug: 'nestle', logo: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=150' },
  ];

  const brandsMap: Record<string, string> = {};
  for (const brand of brandsData) {
    const createdBrand = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { logo: brand.logo },
      create: {
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
      },
    });
    brandsMap[brand.slug] = createdBrand.id;
  }
  console.log('Brands seeded:', Object.keys(brandsMap).length);

  // 5. Create Products
  const productsData = [
    // Lácteos
    {
      name: 'Leche Entera Ultra Pasteurizada 1L',
      slug: 'leche-entera-1l',
      sku: 'LAC-001',
      barcode: '7790010001234',
      description: 'Leche entera clásica La Serenísima, ultrapasteurizada enriquecida con vitaminas A y D. Ideal para el desayuno familiar.',
      price: 1350,
      offerPrice: 1190,
      cost: 750,
      stock: 120,
      weight: 1.0,
      brandSlug: 'la-serenisima',
      categorySlug: 'lacteos-y-quesos',
      images: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Yogur Entero de Vainilla 190g',
      slug: 'yogur-vainilla-190g',
      sku: 'LAC-002',
      barcode: '7790010005678',
      description: 'Yogur entero batido sabor vainilla, fortificado con calcio y vitaminas. Cremoso y riquísimo.',
      price: 780,
      offerPrice: null,
      cost: 410,
      stock: 85,
      weight: 0.19,
      brandSlug: 'la-serenisima',
      categorySlug: 'lacteos-y-quesos',
      images: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Queso Crema Clásico 290g',
      slug: 'queso-crema-clasico-290g',
      sku: 'LAC-003',
      barcode: '7790010009999',
      description: 'Queso crema para untar clásico, ideal para tus desayunos, meriendas o recetas de repostería.',
      price: 2450,
      offerPrice: 2150,
      cost: 1300,
      stock: 45,
      weight: 0.29,
      brandSlug: 'la-serenisima',
      categorySlug: 'lacteos-y-quesos',
      images: 'https://images.unsplash.com/photo-1528256446546-3e8e91974ef4?auto=format&fit=crop&q=80&w=600',
    },
    // Bebidas
    {
      name: 'Gaseosa Coca-Cola Original 2.25L',
      slug: 'coca-cola-2-25l',
      sku: 'BEB-001',
      barcode: '7790070411234',
      description: 'Gaseosa sabor original Coca-Cola. Refrescante y perfecta para tus comidas familiares. Envase retornable.',
      price: 2800,
      offerPrice: 2490,
      cost: 1600,
      stock: 200,
      weight: 2.3,
      brandSlug: 'coca-cola',
      categorySlug: 'bebidas',
      images: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Agua Mineral Sin Gas 1.5L',
      slug: 'agua-mineral-1-5l',
      sku: 'BEB-002',
      barcode: '7790070415678',
      description: 'Agua mineral natural de manantial sin gas. Hidratación pura para todo el día.',
      price: 1100,
      offerPrice: null,
      cost: 550,
      stock: 350,
      weight: 1.5,
      brandSlug: 'coca-cola',
      categorySlug: 'bebidas',
      images: 'https://images.unsplash.com/photo-1608885898957-a599fb18ec3f?auto=format&fit=crop&q=80&w=600',
    },
    // Frutas y Verduras
    {
      name: 'Banana Cavanish Selecta x 1kg',
      slug: 'banana-cavanish-1kg',
      sku: 'FYV-001',
      barcode: '0000000000001',
      description: 'Bananas seleccionadas del Ecuador, maduras y listas para consumir. Ricas en potasio y energía.',
      price: 1950,
      offerPrice: 1650,
      cost: 1000,
      stock: 150,
      weight: 1.0,
      brandSlug: 'arcor', // Generic placement or empty
      categorySlug: 'frutas-y-verduras',
      images: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Manzana Roja Deliciosa x 1kg',
      slug: 'manzana-roja-1kg',
      sku: 'FYV-002',
      barcode: '0000000000002',
      description: 'Manzanas rojas frescas y crujientes de la Patagonia. Ideal para meriendas saludables y postres.',
      price: 2200,
      offerPrice: null,
      cost: 1200,
      stock: 110,
      weight: 1.0,
      brandSlug: 'arcor',
      categorySlug: 'frutas-y-verduras',
      images: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Tomate Redondo Especial x 1kg',
      slug: 'tomate-redondo-1kg',
      sku: 'FYV-003',
      barcode: '0000000000003',
      description: 'Tomates redondos maduros de huerta seleccionados. Firmes y sabrosos, ideales para ensaladas o salsas.',
      price: 1800,
      offerPrice: 1490,
      cost: 850,
      stock: 90,
      weight: 1.0,
      brandSlug: 'knorr',
      categorySlug: 'frutas-y-verduras',
      images: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600',
    },
    // Almacén
    {
      name: 'Fideos Tallarines de Sémola 500g',
      slug: 'fideos-tallarines-500g',
      sku: 'ALM-001',
      barcode: '7790580661234',
      description: 'Fideos secos tipo tallarines elaborados con 100% sémola de trigo candeal. No se pasan, no se pegan.',
      price: 1200,
      offerPrice: 990,
      cost: 500,
      stock: 300,
      weight: 0.5,
      brandSlug: 'arcor',
      categorySlug: 'almacen',
      images: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Pure de Tomate Libre de Gluten 520g',
      slug: 'pure-tomate-520g',
      sku: 'ALM-002',
      barcode: '7790580998765',
      description: 'Pure de tomate clásico, elaborado con tomates seleccionados, libre de gluten (sin TACC).',
      price: 950,
      offerPrice: null,
      cost: 450,
      stock: 250,
      weight: 0.52,
      brandSlug: 'knorr',
      categorySlug: 'almacen',
      images: 'https://images.unsplash.com/photo-1589135773181-a29d191d8486?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Galletitas de Cereal y Avena 150g',
      slug: 'galletitas-avena-150g',
      sku: 'ALM-003',
      barcode: '7791234567890',
      description: 'Galletitas crujientes con copos de avena entera y miel. Fuente de fibra natural para tu día.',
      price: 890,
      offerPrice: 790,
      cost: 400,
      stock: 180,
      weight: 0.15,
      brandSlug: 'granix',
      categorySlug: 'almacen',
      images: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    },
    // Limpieza
    {
      name: 'Detergente Lavavajillas Limón 750ml',
      slug: 'detergente-limon-750ml',
      sku: 'LIM-001',
      barcode: '7790999001234',
      description: 'Detergente líquido concentrado con aroma a limón fresco. Alto poder desengrasante y cuidado de manos.',
      price: 1900,
      offerPrice: 1690,
      cost: 950,
      stock: 140,
      weight: 0.78,
      brandSlug: 'nestle',
      categorySlug: 'limpieza',
      images: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=600',
    },
  ];

  for (const prod of productsData) {
    const brandId = brandsMap[prod.brandSlug];
    const categoryId = categoriesMap[prod.categorySlug];

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        price: prod.price,
        offerPrice: prod.offerPrice,
        stock: prod.stock,
        images: prod.images,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku,
        barcode: prod.barcode,
        description: prod.description,
        price: prod.price,
        offerPrice: prod.offerPrice,
        cost: prod.cost,
        stock: prod.stock,
        weight: prod.weight,
        brandId,
        categoryId,
        images: prod.images,
        metaTitle: `${prod.name} | Superencasa`,
        metaDescription: `Comprá online ${prod.name} en Superencasa. Envío rápido, excelente precio y frescura asegurada.`,
      },
    });
  }
  console.log('Products seeded successfully');

  // 6. Create Banners
  const banners = [
    {
      title: 'Frescura que llega a tu puerta',
      subtitle: 'Frutas y verduras seleccionadas del día. Envío gratis en tu primera compra.',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600',
      linkUrl: '/productos?categoria=frutas-y-verduras',
      order: 1,
      type: 'HERO',
    },
    {
      title: 'Semana de Ofertas en Bebidas',
      subtitle: 'Llevá tus marcas favoritas al mejor precio del mercado.',
      imageUrl: 'https://images.unsplash.com/photo-1527960656366-ee2a999e32e6?auto=format&fit=crop&q=80&w=1600',
      linkUrl: '/productos?categoria=bebidas',
      order: 2,
      type: 'HERO',
    },
    {
      title: '¡15% de Descuento en Lácteos!',
      subtitle: 'Quesos, yogures y mantecas con precios rebajados.',
      imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1600',
      linkUrl: '/productos?categoria=lacteos-y-quesos',
      order: 3,
      type: 'HERO',
    },
  ];

  for (let i = 0; i < banners.length; i++) {
    const banner = banners[i];
    await prisma.banner.create({
      data: {
        title: banner.title,
        subtitle: banner.subtitle,
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl,
        order: banner.order,
        type: banner.type,
        isActive: true,
      },
    });
  }
  console.log('Banners seeded');

  // 7. Create Coupons
  const coupons = [
    {
      code: 'BIENVENIDO10',
      type: 'PERCENTAGE',
      value: 10,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      minPurchase: 1000,
      maxUsage: 500,
    },
    {
      code: 'SUPERDESCUENTO',
      type: 'FIXED',
      value: 1000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      minPurchase: 8000,
      maxUsage: 100,
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }
  console.log('Coupons seeded');

  // 8. Create Promotions
  const promotions = [
    {
      name: 'Lácteos 3x2',
      type: 'THREE_FOR_TWO',
      value: 0,
      configJson: JSON.stringify({
        categoryId: categoriesMap['lacteos-y-quesos'],
      }),
      isActive: true,
    },
    {
      name: 'Coca-Cola Combo Familiar',
      type: 'AUTO_DISCOUNT',
      value: 15, // 15% discount
      configJson: JSON.stringify({
        productIds: [], // Empty means applicable dynamically or specifically
      }),
      isActive: true,
    },
  ];

  for (const promo of promotions) {
    await prisma.promotion.create({
      data: promo,
    });
  }
  console.log('Promotions seeded');

  // 9. Create Blog Posts
  const blogs = [
    {
      title: '5 Recetas Fáciles y Saludables con Verduras de Estación',
      slug: '5-recetas-saludables-verduras-estacion',
      content: 'Incorporar verduras de estación a tu alimentación no solo es beneficioso para tu salud debido a su alta concentración de vitaminas y minerales, sino que también es amigable con tu bolsillo. En esta nota, te enseñamos cómo preparar: 1. Sopa crema de calabaza y jengibre, 2. Ensalada tibia de vegetales asados, 3. Tortilla de espinaca super esponjosa, 4. Budín de zanahoria y avena, 5. Bastoncitos de berenjena al horno. ¡Fáciles, rápidas y deliciosas!',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      category: 'Recetas',
    },
    {
      title: 'Cómo conservar frescos los lácteos por más tiempo',
      slug: 'conservar-lacteos-mas-tiempo',
      content: 'La conservación correcta de los productos lácteos es fundamental para garantizar su inocuidad y aprovechar al máximo sus nutrientes. A continuación te dejamos consejos prácticos: 1. Mantené la cadena de frío comprando los lácteos al final de tu visita al supermercado, 2. Ubicalos en los estantes medios de la heladera, nunca en la puerta ya que es la zona con mayor variación de temperatura, 3. Una vez abiertos, consumilos dentro de los 3 a 5 días y mantenelos herméticamente cerrados.',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800',
      category: 'Consejos de Cocina',
    },
  ];

  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {},
      create: {
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        image: blog.image,
        category: blog.category,
        metaTitle: `${blog.title} | Superencasa Blog`,
        metaDescription: `Descubrí consejos y recetas interesantes en Superencasa. En esta nota: ${blog.title}`,
      },
    });
  }
  console.log('Blog posts seeded');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
