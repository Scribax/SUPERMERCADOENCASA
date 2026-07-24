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
    const { code, type, value, startDate, endDate, maxUsage, minPurchase, isActive } = body;

    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return NextResponse.json({ error: 'Cupón no encontrado' }, { status: 404 });
    }

    const updatedData: any = {};
    if (code !== undefined) updatedData.code = code.toUpperCase().trim();
    if (type !== undefined) updatedData.type = type;
    if (value !== undefined) updatedData.value = parseFloat(value);
    if (startDate !== undefined) updatedData.startDate = new Date(startDate);
    if (endDate !== undefined) updatedData.endDate = new Date(endDate);
    if (maxUsage !== undefined) updatedData.maxUsage = parseInt(maxUsage);
    if (minPurchase !== undefined) updatedData.minPurchase = parseFloat(minPurchase);
    if (isActive !== undefined) updatedData.isActive = isActive;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al actualizar el cupón' },
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

    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return NextResponse.json({ error: 'Cupón no encontrado' }, { status: 404 });
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Cupón eliminado' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al eliminar el cupón' },
      { status: 500 }
    );
  }
}
