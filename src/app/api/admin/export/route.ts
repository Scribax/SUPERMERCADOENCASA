import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'orders';

  try {
    if (type === 'products') {
      const products = await prisma.product.findMany({
        include: { category: true, brand: true },
        orderBy: { createdAt: 'desc' },
      });

      const header = 'ID,SKU,Nombre,Precio,PrecioOferta,Stock,Categoria,Marca\n';
      const rows = products
        .map(
          (p) =>
            `"${p.id}","${p.sku}","${p.name.replace(/"/g, '""')}",${p.price},${p.offerPrice || ''},${p.stock},"${p.category?.name || ''}","${p.brand?.name || ''}"`
        )
        .join('\n');

      return new NextResponse(header + rows, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="productos_superencasa.csv"',
        },
      });
    }

    // Default: Orders export
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    const header = 'ID,Cliente,Email,Telefono,Direccion,Localidad,FechaEntrega,Turno,Estado,MetodoPago,Total,Fecha\n';
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.customerName.replace(/"/g, '""')}","${o.customerEmail}","${o.customerPhone}","${o.shippingAddress.replace(/"/g, '""')}","${o.locality || ''}","${o.deliveryDate || ''}","${o.deliverySlot || ''}","${o.status}","${o.paymentMethod}",${o.total},"${new Date(o.createdAt).toLocaleDateString('es-AR')}"`
      )
      .join('\n');

    return new NextResponse(header + rows, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="pedidos_superencasa.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
