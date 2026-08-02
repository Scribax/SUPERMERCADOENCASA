import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const p = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./prisma/dev.db' }) });

async function main() {
  await p.category.update({ where: { slug: 'almacen' }, data: { name: 'Almacén' } });
  console.log('✅ almacen → Almacén');
  await p.category.update({ where: { slug: 'ferreteria' }, data: { name: 'Construcción y Ferretería' } });
  console.log('✅ ferreteria → Construcción y Ferretería');
  await p.$disconnect();
}

main();
