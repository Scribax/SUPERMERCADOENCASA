import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { name, shippingCost, isActive } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const existingLocality = await prisma.locality.findUnique({
      where: { name },
    });

    if (existingLocality && existingLocality.id !== id) {
      return NextResponse.json(
        { error: 'Ya existe una localidad con este nombre' },
        { status: 400 }
      );
    }

    const locality = await prisma.locality.update({
      where: { id },
      data: {
        name,
        shippingCost: shippingCost !== undefined ? parseFloat(shippingCost) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return NextResponse.json({ success: true, locality });
  } catch (error) {
    console.error('Error updating locality:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al actualizar la localidad' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.locality.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting locality:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al eliminar la localidad' },
      { status: 500 }
    );
  }
}
