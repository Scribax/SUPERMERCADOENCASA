import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { street, city, province, zipCode, isDefault } = await request.json();

    if (!street || !city || !province || !zipCode) {
      return NextResponse.json(
        { error: 'Todos los campos de dirección son requeridos' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults first
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        street,
        city,
        province,
        zipCode,
        isDefault: !!isDefault,
      },
    });

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al crear la dirección' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'El ID de dirección es obligatorio' }, { status: 400 });
    }

    // Verify ownership
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== user.id) {
      return NextResponse.json({ error: 'Dirección no encontrada o no autorizada' }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });

    // If deleted default, set another address as default
    if (address.isDefault) {
      const anotherAddress = await prisma.address.findFirst({
        where: { userId: user.id },
      });
      if (anotherAddress) {
        await prisma.address.update({
          where: { id: anotherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Dirección eliminada' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al eliminar la dirección' },
      { status: 500 }
    );
  }
}
