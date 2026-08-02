import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';

const adapter = new PrismaLibSql({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Agregando categorías y productos adicionales...\n');

  // ============================================================
  // 1. NUEVAS CATEGORÍAS (7 faltantes)
  // ============================================================
  const nuevasCategorias = [
    { name: 'Perfumería y Cuidado', slug: 'perfumeria', order: 7, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400' },
    { name: 'Mascotas', slug: 'mascotas', order: 8, image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400' },
    { name: 'Congelados', slug: 'congelados', order: 9, image: 'https://images.unsplash.com/photo-1584990347449-a6f0eaa2debc?auto=format&fit=crop&q=80&w=400' },
    { name: 'Panadería', slug: 'panaderia', order: 10, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400' },
    { name: 'Bazar y Hogar', slug: 'bazar', order: 11, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' },
    { name: 'Electro y Tecnología', slug: 'electro', order: 12, image: 'https://images.unsplash.com/photo-1498049794561-1b2f9e3fb8c6?auto=format&fit=crop&q=80&w=400' },
    { name: 'Ferretería', slug: 'ferreteria', order: 13, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400' },
  ];

  const categoriesMap: Record<string, string> = {};

  // Obtener categorías existentes también
  const existingCats = await prisma.category.findMany();
  for (const cat of existingCats) {
    categoriesMap[cat.slug] = cat.id;
  }

  for (const cat of nuevasCategorias) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { order: cat.order, image: cat.image },
      create: {
        name: cat.name,
        slug: cat.slug,
        order: cat.order,
        image: cat.image,
        description: `Productos seleccionados de ${cat.name}`,
        metaTitle: `${cat.name} al mejor precio | Superencasa`,
        metaDescription: `Comprá online en nuestra sección de ${cat.name}. Productos de alta calidad con envíos a domicilio.`,
      },
    });
    categoriesMap[cat.slug] = created.id;
    console.log(`  ✅ Categoría: ${cat.name}`);
  }
  console.log(`\n📦 Total categorías: ${Object.keys(categoriesMap).length}\n`);

  // ============================================================
  // 2. Obtener marcas existentes
  // ============================================================
  const existingBrands = await prisma.brand.findMany();
  const brandsMap: Record<string, string> = {};
  for (const b of existingBrands) {
    brandsMap[b.slug] = b.id;
  }

  // ============================================================
  // 3. NUEVOS PRODUCTOS (para las categorías faltantes + extras)
  // ============================================================
  const nuevosProductos = [
    // --- Perfumería ---
    { name: 'Shampoo Nutritivo Reparación 400ml', slug: 'shampoo-nutritivo-400ml', sku: 'PER-001', barcode: '7791234000101', description: 'Shampoo con aceite de argán y keratina. Reparación profunda para cabello dañado y teñido.', price: 3200, offerPrice: 2790, cost: 1650, stock: 80, weight: 0.42, brandSlug: 'nestle', categorySlug: 'perfumeria', images: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600' },
    { name: 'Desodorante Antitranspirante Roll-On 50ml', slug: 'desodorante-rollon-50ml', sku: 'PER-002', barcode: '7791234000202', description: 'Protección 48hs sin alcohol. Fórmula suave que no irrita la piel.', price: 1800, offerPrice: null, cost: 900, stock: 120, weight: 0.06, brandSlug: 'nestle', categorySlug: 'perfumeria', images: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80&w=600' },
    { name: 'Jabón Líquido para Manos 250ml', slug: 'jabon-liquido-manos-250ml', sku: 'PER-003', barcode: '7791234000303', description: 'Jabón líquido cremoso con glicerina y aloe vera. Limpieza suave sin resecar.', price: 1500, offerPrice: 1290, cost: 700, stock: 95, weight: 0.28, brandSlug: 'granix', categorySlug: 'perfumeria', images: 'https://images.unsplash.com/photo-1585435421671-0c167646e36a?auto=format&fit=crop&q=80&w=600' },

    // --- Mascotas ---
    { name: 'Alimento Balanceado Perro Adulto 15kg', slug: 'alimento-perro-adulto-15kg', sku: 'MAS-001', barcode: '7791234001101', description: 'Alimento balanceado completo con proteínas de carne vacuna. Para perros adultos de todas las razas.', price: 18900, offerPrice: 15990, cost: 9500, stock: 45, weight: 15.0, brandSlug: 'nestle', categorySlug: 'mascotas', images: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=600' },
    { name: 'Piedras Sanitarias para Gatos 4kg', slug: 'piedras-sanitarias-gato-4kg', sku: 'MAS-002', barcode: '7791234001202', description: 'Piedras sanitarias aglomerantes con control de olores. Ultra absorbentes, rinden más.', price: 4500, offerPrice: 3990, cost: 2200, stock: 60, weight: 4.0, brandSlug: 'granix', categorySlug: 'mascotas', images: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=600' },
    { name: 'Juguete Mordillo Cuerda para Perro', slug: 'juguete-mordillo-perro', sku: 'MAS-003', barcode: '7791234001303', description: 'Juguete resistente de cuerda de algodón trenzada. Ideal para razas medianas y grandes.', price: 2200, offerPrice: 1790, cost: 900, stock: 70, weight: 0.25, brandSlug: 'arcor', categorySlug: 'mascotas', images: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600' },

    // --- Congelados ---
    { name: 'Hamburguesas de Carne Clásicas x6u', slug: 'hamburguesas-carne-x6', sku: 'CON-001', barcode: '7791234002101', description: 'Hamburguesas 100% carne vacuna, sin conservantes. Pack de 6 unidades listas para cocinar.', price: 4200, offerPrice: 3590, cost: 2100, stock: 55, weight: 0.65, brandSlug: 'coca-cola', categorySlug: 'congelados', images: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600' },
    { name: 'Helado de Dulce de Leche Granizado 1kg', slug: 'helado-dulce-leche-1kg', sku: 'CON-002', barcode: '7791234002202', description: 'Helado artesanal estilo italiano, con dulce de leche argentino y granizado de chocolate.', price: 6800, offerPrice: 5490, cost: 3400, stock: 35, weight: 1.0, brandSlug: 'la-serenisima', categorySlug: 'congelados', images: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600' },
    { name: 'Papas Fritas Crocantes Congeladas 1kg', slug: 'papas-fritas-congeladas-1kg', sku: 'CON-003', barcode: '7791234002303', description: 'Papas prefritas congeladas, corte bastón. Listas para freír u hornear, bien crocantes.', price: 3100, offerPrice: null, cost: 1550, stock: 90, weight: 1.0, brandSlug: 'knorr', categorySlug: 'congelados', images: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600' },

    // --- Panadería ---
    { name: 'Pan Lactal Integral 500g', slug: 'pan-lactal-integral-500g', sku: 'PAN-001', barcode: '7791234003101', description: 'Pan de molde integral con semillas de lino y girasol. Rico en fibra, sin grasas trans.', price: 1900, offerPrice: 1590, cost: 800, stock: 65, weight: 0.5, brandSlug: 'granix', categorySlug: 'panaderia', images: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600' },
    { name: 'Medialunas de Manteca x12u', slug: 'medialunas-manteca-x12', sku: 'PAN-002', barcode: '7791234003202', description: 'Medialunas artesanales de manteca recién horneadas. Pack de 12 unidades.', price: 3600, offerPrice: 2990, cost: 1800, stock: 40, weight: 0.7, brandSlug: 'arcor', categorySlug: 'panaderia', images: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?auto=format&fit=crop&q=80&w=600' },

    // --- Bazar y Hogar ---
    { name: 'Set de Tuppers Herméticos x5', slug: 'set-tuppers-x5', sku: 'BAZ-001', barcode: '7791234004101', description: 'Set de 5 recipientes herméticos con tapa. Aptos microondas y freezer, libres de BPA.', price: 5500, offerPrice: 4290, cost: 2400, stock: 50, weight: 0.8, brandSlug: 'knorr', categorySlug: 'bazar', images: 'https://images.unsplash.com/photo-1531872243440-1eff1e633405?auto=format&fit=crop&q=80&w=600' },
    { name: 'Olla de Aluminio 24cm con Tapa', slug: 'olla-aluminio-24cm', sku: 'BAZ-002', barcode: '7791234004202', description: 'Olla de aluminio fundido de 24cm con tapa de vidrio templado. Antiadherente, apta cocinas.', price: 12500, offerPrice: 9990, cost: 5500, stock: 25, weight: 1.6, brandSlug: 'nestle', categorySlug: 'bazar', images: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=600' },
    { name: 'Vaso Térmico Acero Inoxidable 500ml', slug: 'vaso-termico-500ml', sku: 'BAZ-003', barcode: '7791234004303', description: 'Vaso térmico de acero inoxidable doble pared. Mantiene 12hs frío / 8hs calor.', price: 8900, offerPrice: 7490, cost: 3900, stock: 30, weight: 0.35, brandSlug: 'coca-cola', categorySlug: 'bazar', images: 'https://images.unsplash.com/photo-1577937927133-67e21f4e2f27?auto=format&fit=crop&q=80&w=600' },

    // --- Electro ---
    { name: 'Auriculares Bluetooth In-Ear', slug: 'auriculares-bluetooth-inear', sku: 'ELE-001', barcode: '7791234005101', description: 'Auriculares inalámbricos con estuche de carga, Bluetooth 5.3, cancelación de ruido y 24hs de batería.', price: 18500, offerPrice: 14990, cost: 8000, stock: 20, weight: 0.12, brandSlug: 'coca-cola', categorySlug: 'electro', images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600' },
    { name: 'Cargador Rápido USB-C 20W', slug: 'cargador-rapido-usbc-20w', sku: 'ELE-002', barcode: '7791234005202', description: 'Cargador de pared 20W con Power Delivery. Compatible con iPhone, Samsung y todos los USB-C.', price: 7500, offerPrice: 5990, cost: 3000, stock: 40, weight: 0.09, brandSlug: 'nestle', categorySlug: 'electro', images: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600' },

    // --- Ferretería ---
    { name: 'Taladro Percutor Inalámbrico 20V', slug: 'taladro-percutor-20v', sku: 'FER-001', barcode: '7791234006101', description: 'Taladro percutor a batería 20V, 2 velocidades, 13mm mandril. Incluye maletín y accesorios.', price: 65000, offerPrice: 54900, cost: 32000, stock: 12, weight: 2.8, brandSlug: 'coca-cola', categorySlug: 'ferreteria', images: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=600' },
    { name: 'Cinta Aisladora Profesional 10m', slug: 'cinta-aisladora-10m', sku: 'FER-002', barcode: '7791234006202', description: 'Cinta aisladora de PVC de alta calidad. Resistente a 600V y temperaturas de -5°C a 80°C.', price: 850, offerPrice: null, cost: 350, stock: 150, weight: 0.07, brandSlug: 'knorr', categorySlug: 'ferreteria', images: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Kit de Destornilladores x6', slug: 'kit-destornilladores-x6', sku: 'FER-003', barcode: '7791234006303', description: 'Set de 6 destornilladores (3 planos + 3 Phillips) con puntas imantadas y mango ergonómico.', price: 4200, offerPrice: 3490, cost: 1800, stock: 35, weight: 0.55, brandSlug: 'arcor', categorySlug: 'ferreteria', images: 'https://images.unsplash.com/photo-1581147036324-1d2c5e5f5f34?auto=format&fit=crop&q=80&w=600' },
  ];

  console.log('📦 Agregando productos...');
  for (const prod of nuevosProductos) {
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
        metaDescription: `Comprá online ${prod.name} en Superencasa. Envío rápido y excelente precio.`,
      },
    });
    console.log(`  ✅ ${prod.name}`);
  }

  // Renombrar categorías existentes para que coincidan con el diseño
  await prisma.category.update({ where: { slug: 'lacteos-y-quesos' }, data: { name: 'Lácteos y Huevos' } });
  await prisma.category.update({ where: { slug: 'limpieza' }, data: { name: 'Limpieza y Hogar' } });
  console.log('\n📝 Nombres de categorías actualizados');

  const totalProductos = await prisma.product.count();
  console.log(`\n✨ Seed completo. Total productos: ${totalProductos}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
