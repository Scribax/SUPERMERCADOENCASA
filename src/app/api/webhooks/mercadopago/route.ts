import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') || searchParams.get('type');
    const paymentId = searchParams.get('id') || searchParams.get('data.id');

    if (topic === 'payment' && paymentId && process.env.MERCADOPAGO_ACCESS_TOKEN) {
      // Query Mercado Pago API to get actual payment status
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      });

      if (response.ok) {
        const paymentData = await response.json();
        const orderId = paymentData.external_reference;
        const status = paymentData.status; // approved, pending, rejected, etc.

        if (orderId && status === 'approved') {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'PAID',
              status: 'PREPARING',
            },
          });
          console.log(`[Webhook MP] Order ${orderId} marked as PAID.`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook MP Error]:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
