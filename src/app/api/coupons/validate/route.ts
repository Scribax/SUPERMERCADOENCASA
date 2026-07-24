import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code || subtotal === undefined) {
      return NextResponse.json(
        { error: 'Código de cupón y subtotal son obligatorios' },
        { status: 400 }
      );
    }

    const cleanCode = code.toUpperCase().trim();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Cupón inválido. Verificá que esté bien escrito.' },
        { status: 400 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'El cupón ya no está activo.' }, { status: 400 });
    }

    const now = new Date();
    if (now < new Date(coupon.startDate)) {
      return NextResponse.json({ error: 'El cupón todavía no es válido.' }, { status: 400 });
    }

    if (now > new Date(coupon.endDate)) {
      return NextResponse.json({ error: 'El cupón ha vencido.' }, { status: 400 });
    }

    if (coupon.currentUsage >= coupon.maxUsage) {
      return NextResponse.json(
        { error: 'El cupón ha superado su límite de usos.' },
        { status: 400 }
      );
    }

    const parsedSubtotal = parseFloat(subtotal);
    if (parsedSubtotal < coupon.minPurchase) {
      return NextResponse.json(
        {
          error: `Monto mínimo de compra no alcanzado. Compra mínima requerida: $${coupon.minPurchase}`,
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (parsedSubtotal * coupon.value) / 100;
    } else {
      discountAmount = coupon.value;
    }

    // Discount cannot exceed the subtotal
    if (discountAmount > parsedSubtotal) {
      discountAmount = parsedSubtotal;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
      },
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al validar el cupón' },
      { status: 500 }
    );
  }
}
