import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try finding by ID first, then by slug
    let product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        reviews: {
          include: {
            user: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: id },
        include: {
          category: true,
          brand: true,
          reviews: {
            include: {
              user: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener el producto' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      offerPrice,
      cost,
      stock,
      weight,
      sku,
      barcode,
      brandId,
      categoryId,
      images,
      metaTitle,
      metaDescription,
      isActive,
    } = body;

    // Find existing product first
    const existingProduct = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const updatedData: any = {};
    if (name !== undefined) updatedData.name = name;
    if (description !== undefined) updatedData.description = description;
    if (price !== undefined) updatedData.price = parseFloat(price);
    if (offerPrice !== undefined) updatedData.offerPrice = offerPrice ? parseFloat(offerPrice) : null;
    if (cost !== undefined) updatedData.cost = parseFloat(cost);
    if (weight !== undefined) updatedData.weight = parseFloat(weight);
    if (sku !== undefined) updatedData.sku = sku;
    if (barcode !== undefined) updatedData.barcode = barcode || null;
    if (brandId !== undefined) updatedData.brandId = brandId || null;
    if (categoryId !== undefined) updatedData.categoryId = categoryId || null;
    if (images !== undefined) updatedData.images = images;
    if (metaTitle !== undefined) updatedData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updatedData.metaDescription = metaDescription;
    if (isActive !== undefined) updatedData.isActive = isActive;

    // Handle stock update & inventory logging
    if (stock !== undefined) {
      const newStock = parseInt(stock);
      const stockDiff = newStock - existingProduct.stock;
      updatedData.stock = newStock;

      if (stockDiff !== 0) {
        updatedData.inventoryLogs = {
          create: {
            quantity: stockDiff,
            reason: `Ajuste manual de stock por el administrador/empleado. Stock anterior: ${existingProduct.stock}, nuevo stock: ${newStock}`,
            userId: user.id,
          },
        };
      }
    }

    const product = await prisma.product.update({
      where: { id: existingProduct.id },
      data: updatedData,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al actualizar el producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const existingProduct = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id: existingProduct.id },
    });

    return NextResponse.json({ success: true, message: 'Producto eliminado' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al eliminar el producto' },
      { status: 500 }
    );
  }
}
