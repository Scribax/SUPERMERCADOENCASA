import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

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
    const { name, type, value, configJson, isActive } = body;

    const existingPromo = await prisma.promotion.findUnique({
      where: { id },
    });

    if (!existingPromo) {
      return NextResponse.json({ error: 'Promoción no encontrada' }, { status: 404 });
    }

    const updatedData: any = {};
    if (name !== undefined) updatedData.name = name;
    if (type !== undefined) updatedData.type = type;
    if (value !== undefined) updatedData.value = parseFloat(value);
    if (isActive !== undefined) updatedData.isActive = isActive;
    
    if (configJson !== undefined) {
      // Verify config is valid JSON
      try {
        JSON.parse(configJson);
        updatedData.configJson = configJson;
      } catch (e) {
        return NextResponse.json(
          { error: 'La configuración debe ser un formato JSON válido' },
          { status: 400 }
        );
      }
    }

    const promotion = await prisma.promotion.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json({ success: true, promotion });
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al actualizar la promoción' },
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

    const existingPromo = await prisma.promotion.findUnique({
      where: { id },
    });

    if (!existingPromo) {
      return NextResponse.json({ error: 'Promoción no encontrada' }, { status: 404 });
    }

    await prisma.promotion.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Promoción eliminada' });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al eliminar la promoción' },
      { status: 500 }
    );
  }
}
