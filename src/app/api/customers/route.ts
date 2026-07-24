import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get all clients
    const clients = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        profile: {
          select: {
            phone: true,
            avatarUrl: true,
          },
        },
        addresses: true,
        orders: {
          select: {
            total: true,
            createdAt: true,
            status: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Format clients with purchase statistics
    const formattedClients = clients.map((client) => {
      const completedOrders = client.orders.filter(
        (o) => o.status !== 'CANCELLED'
      );
      
      const totalSpent = completedOrders.reduce((sum, order) => sum + order.total, 0);
      const ordersCount = completedOrders.length;
      
      let lastPurchaseDate = null;
      if (completedOrders.length > 0) {
        const sortedOrders = [...completedOrders].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        lastPurchaseDate = sortedOrders[0].createdAt;
      }

      return {
        id: client.id,
        name: client.name,
        email: client.email,
        createdAt: client.createdAt,
        phone: client.profile?.phone || null,
        avatarUrl: client.profile?.avatarUrl || null,
        addresses: client.addresses,
        totalSpent,
        ordersCount,
        lastPurchaseDate,
      };
    });

    return NextResponse.json({ success: true, customers: formattedClients });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener los clientes' },
      { status: 500 }
    );
  }
}
