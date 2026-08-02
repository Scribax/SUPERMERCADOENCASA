import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
const p = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./prisma/dev.db' }) });
(async () => {
  const locs = [
    { name: 'Pigué', shippingCost: 290 },
    { name: 'Bahía Blanca', shippingCost: 450 },
    { name: 'Patagones', shippingCost: 390 },
    { name: 'Viedma', shippingCost: 420 },
  ];
  for (const l of locs) await p.locality.upsert({ where: { name: l.name }, update: {}, create: l });
  console.log('✅ 4 localidades creadas');
  await p.$disconnect();
})();
