import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Security check: Clients can only see their own orders
    if (user.role === 'CLIENT' && order.userId !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener el pedido' },
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
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { status, paymentStatus, trackingNumber } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const updatedData: any = {};
    if (paymentStatus !== undefined) updatedData.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) updatedData.trackingNumber = trackingNumber;

    if (status !== undefined && status !== existingOrder.status) {
      updatedData.status = status;

      // Handle stock restock on cancellation
      if (status === 'CANCELLED' && existingOrder.status !== 'CANCELLED') {
        // Run as a transaction to restock all items and log
        await prisma.$transaction(async (tx) => {
          for (const item of existingOrder.items) {
            if (item.productId) {
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  stock: {
                    increment: item.quantity,
                  },
                  inventoryLogs: {
                    create: {
                      quantity: item.quantity,
                      reason: `Cancelación de pedido #${existingOrder.id.slice(0, 8)}. Restock automático.`,
                      userId: user.id,
                    },
                  },
                },
              });
            }
          }
        });
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data: updatedData,
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al actualizar el pedido' },
      { status: 500 }
    );
  }
}
