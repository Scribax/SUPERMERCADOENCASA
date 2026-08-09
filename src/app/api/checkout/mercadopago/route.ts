import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Falta orderId' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!mpAccessToken) {
      // Return sandbox fallback URL if MP Access Token is not set yet
      const fallbackUrl = `${origin}/checkout/success?orderId=${order.id}&paymentMethod=MERCADO_PAGO&sandbox=true`;
      return NextResponse.json({
        success: true,
        initPoint: fallbackUrl,
        isSandbox: true,
        message: 'Modo Sandbox: Configura MERCADOPAGO_ACCESS_TOKEN en tu .env para pagos reales.',
      });
    }

    // Call Mercado Pago API to create preference
    const preferenceData = {
      items: order.items.map((item) => ({
        id: item.id,
        title: item.name,
        unit_price: Number(item.price),
        quantity: item.quantity,
        currency_id: 'ARS',
      })),
      payer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: {
          number: order.customerPhone,
        },
      },
      back_urls: {
        success: `${origin}/checkout/success?orderId=${order.id}&status=approved`,
        failure: `${origin}/checkout/success?orderId=${order.id}&status=failure`,
        pending: `${origin}/checkout/success?orderId=${order.id}&status=pending`,
      },
      auto_return: 'approved',
      external_reference: order.id,
      notification_url: `${origin}/api/webhooks/mercadopago`,
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mpAccessToken}`,
      },
      body: JSON.stringify(preferenceData),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('MercadoPago API Error:', mpData);
      return NextResponse.json({ error: 'Error al conectar con Mercado Pago' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      initPoint: mpData.init_point,
      sandboxInitPoint: mpData.sandbox_init_point,
    });
  } catch (error) {
    console.error('Error creating MP preference:', error);
    return NextResponse.json({ error: 'Error interno al procesar pago' }, { status: 500 });
  }
}
