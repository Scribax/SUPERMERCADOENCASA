import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!brand) {
      brand = await prisma.brand.findUnique({
        where: { slug: id },
        include: {
          products: true,
        },
      });
    }

    if (!brand) {
      return NextResponse.json({ error: 'Marca no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, brand });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener la marca' },
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
    const { name, logo } = body;

    const existingBrand = await prisma.brand.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingBrand) {
      return NextResponse.json({ error: 'Marca no encontrada' }, { status: 404 });
    }

    const updatedData: any = {};
    if (name !== undefined) updatedData.name = name;
    if (logo !== undefined) updatedData.logo = logo;

    const brand = await prisma.brand.update({
      where: { id: existingBrand.id },
      data: updatedData,
    });

    return NextResponse.json({ success: true, brand });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al actualizar la marca' },
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

    const existingBrand = await prisma.brand.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingBrand) {
      return NextResponse.json({ error: 'Marca no encontrada' }, { status: 404 });
    }

    await prisma.brand.delete({
      where: { id: existingBrand.id },
    });

    return NextResponse.json({ success: true, message: 'Marca eliminada' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al eliminar la marca' },
      { status: 500 }
    );
  }
}
