import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener los cupones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { code, type, value, startDate, endDate, maxUsage, minPurchase } = await request.json();

    if (!code || !type || value === undefined || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Los campos código, tipo, valor, fecha de inicio y fin son obligatorios' },
        { status: 400 }
      );
    }

    const cleanCode = code.toUpperCase().trim();
    const existingCoupon = await prisma.coupon.findUnique({ where: { code: cleanCode } });
    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Ya existe un cupón con este código' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        type,
        value: parseFloat(value),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxUsage: maxUsage !== undefined ? parseInt(maxUsage) : 100,
        minPurchase: minPurchase !== undefined ? parseFloat(minPurchase) : 0,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al crear el cupón' },
      { status: 500 }
    );
  }
}
