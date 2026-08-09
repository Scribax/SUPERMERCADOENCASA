import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const p = new PrismaClient({ adapter: new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' }) });

async function main() {
  const configs = [
    { key: 'hero_title', value: 'Tu supermercado en casa, todos los días' },
    { key: 'hero_subtitle', value: 'Miles de productos, las mejores marcas y entrega rápida en tu ciudad.' },
    { key: 'hero_badge', value: '🚀 ENVÍOS GRATIS +$25.000' },
    { key: 'hero_button', value: 'Comprar ahora' },
    { key: 'whatsapp_number', value: '+54 9 2923 651516', description: 'Número de WhatsApp de atención al cliente' },
    { key: 'benefits_1_title', value: 'Miles de clientes' },
    { key: 'benefits_1_desc', value: 'ya confían en nosotros' },
    { key: 'benefits_2_title', value: 'Comercios locales' },
    { key: 'benefits_2_desc', value: 'productos de tu zona' },
    { key: 'benefits_3_title', value: 'Precios justos' },
    { key: 'benefits_3_desc', value: 'ofertas todos los días' },
    { key: 'benefits_4_title', value: '100% seguro' },
    { key: 'benefits_4_desc', value: 'datos protegidos' },
  ];

  for (const c of configs) {
    await p.storeConfig.upsert({ where: { key: c.key }, update: { value: c.value }, create: c });
    console.log(`  ✅ ${c.key}`);
  }
  console.log(`\n✨ ${configs.length} configs agregados.`);
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
