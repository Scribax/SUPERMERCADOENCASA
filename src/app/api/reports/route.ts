import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch orders from last 30 days safely
    let orders: any[] = [];
    try {
      orders = await prisma.order.findMany({
        where: {
          createdAt: { gte: startOfMonth },
          status: { not: 'CANCELLED' },
        },
        include: {
          items: true,
        },
        orderBy: { createdAt: 'asc' },
      });
    } catch (e) {
      console.error('Error fetching orders for reports:', e);
      orders = [];
    }

    // 1. Calculate Sales KPIs
    let salesToday = 0;
    let salesWeek = 0;
    let salesMonth = 0;
    let productsSoldMonth = 0;

    const todayTime = startOfToday.getTime();
    const weekTime = startOfWeek.getTime();

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt || Date.now());
      const orderTime = orderDate.getTime();
      const orderTotal = typeof order.total === 'number' ? order.total : 0;

      salesMonth += orderTotal;
      if (Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          productsSoldMonth += item.quantity || 0;
        });
      }

      if (orderTime >= todayTime) {
        salesToday += orderTotal;
      }
      if (orderTime >= weekTime) {
        salesWeek += orderTotal;
      }
    });

    // 2. Count Clients
    let clientCount = 0;
    try {
      clientCount = await prisma.user.count({
        where: { role: 'CLIENT' },
      });
    } catch (e) {
      console.error('Error counting clients:', e);
    }

    // 3. Count Orders by Status
    const statusCounts: Record<string, number> = {
      PENDING: 0, PREPARING: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0,
    };
    let totalOrdersCount = 0;
    try {
      const allOrders = await prisma.order.findMany({ select: { status: true } });
      totalOrdersCount = allOrders.length;
      allOrders.forEach((o) => {
        if (o.status && statusCounts[o.status] !== undefined) {
          statusCounts[o.status]++;
        }
      });
    } catch (e) {
      console.error('Error fetching allOrders:', e);
    }

    // 4. Products out of stock or low stock (<= 5)
    let lowStockProducts: any[] = [];
    let outOfStockCount = 0;
    try {
      lowStockProducts = await prisma.product.findMany({
        where: {
          stock: { lte: 5 },
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          price: true,
        },
        orderBy: { stock: 'asc' },
        take: 10,
      });

      outOfStockCount = await prisma.product.count({
        where: { stock: 0, isActive: true },
      });
    } catch (e) {
      console.error('Error fetching lowStockProducts:', e);
    }

    // 5. Generate daily sales chart data for the last 14 days
    const chartDays = 14;
    const dailySalesMap: Record<string, { date: string; sales: number; count: number }> = {};

    for (let i = chartDays - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const formattedLabel = `${date.getDate()}/${date.getMonth() + 1}`;
      dailySalesMap[key] = { date: formattedLabel, sales: 0, count: 0 };
    }

    orders.forEach((order) => {
      try {
        const d = new Date(order.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (dailySalesMap[key]) {
          dailySalesMap[key].sales += typeof order.total === 'number' ? order.total : 0;
          dailySalesMap[key].count += 1;
        }
      } catch (e) {}
    });

    const chartData = Object.values(dailySalesMap);

    // 6. Top selling products
    const productSalesMap: Record<string, { name: string; quantity: number; totalSales: number }> = {};
    orders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          if (item.productId) {
            if (!productSalesMap[item.productId]) {
              productSalesMap[item.productId] = {
                name: item.name || 'Producto',
                quantity: 0,
                totalSales: 0,
              };
            }
            const q = item.quantity || 0;
            const p = item.price || 0;
            productSalesMap[item.productId].quantity += q;
            productSalesMap[item.productId].totalSales += q * p;
          }
        });
      }
    });

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // 7. Average ticket
    const completedOrders = orders.filter((o) => o.status !== 'CANCELLED' && o.status !== 'PENDING');
    const avgTicket =
      completedOrders.length > 0
        ? completedOrders.reduce((sum, o) => sum + (o.total || 0), 0) / completedOrders.length
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          salesToday,
          salesWeek,
          salesMonth,
          clientCount,
          totalOrdersCount,
          productsSoldMonth,
          outOfStockCount,
        },
        statusCounts,
        lowStockProducts,
        chartData,
        topSellingProducts,
        avgTicket,
        categoryBreakdown: [],
      },
    });
  } catch (error: any) {
    console.error('Error generating reports:', error);
    return NextResponse.json(
      { error: error?.message || 'Error en el servidor al generar los reportes' },
      { status: 500 }
    );
  }
}
