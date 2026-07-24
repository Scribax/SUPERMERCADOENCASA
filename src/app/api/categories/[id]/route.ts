import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      category = await prisma.category.findUnique({
        where: { slug: id },
        include: {
          products: true,
        },
      });
    }

    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener la categoría' },
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
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, image, order, parentId, metaTitle, metaDescription } = body;

    const existingCategory = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    const updatedData: any = {};
    if (name !== undefined) updatedData.name = name;
    if (description !== undefined) updatedData.description = description;
    if (image !== undefined) updatedData.image = image;
    if (order !== undefined) updatedData.order = parseInt(order);
    if (parentId !== undefined) updatedData.parentId = parentId || null;
    if (metaTitle !== undefined) updatedData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updatedData.metaDescription = metaDescription;

    const category = await prisma.category.update({
      where: { id: existingCategory.id },
      data: updatedData,
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al actualizar la categoría' },
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

    const existingCategory = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    await prisma.category.delete({
      where: { id: existingCategory.id },
    });

    return NextResponse.json({ success: true, message: 'Categoría eliminada' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al eliminar la categoría' },
      { status: 500 }
    );
  }
}
