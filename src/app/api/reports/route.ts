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
    
    // Start of Today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Start of Week (last 7 days)
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Start of Month (last 30 days)
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all completed orders (not cancelled) in the last 30 days
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfMonth },
        status: { not: 'CANCELLED' },
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // 1. Calculate Sales KPIs
    let salesToday = 0;
    let salesWeek = 0;
    let salesMonth = 0;
    let productsSoldMonth = 0;

    const todayTime = startOfToday.getTime();
    const weekTime = startOfWeek.getTime();

    orders.forEach((order) => {
      const orderTime = new Date(order.createdAt).getTime();
      const orderTotal = order.total;

      salesMonth += orderTotal;
      order.items.forEach((item) => {
        productsSoldMonth += item.quantity;
      });

      if (orderTime >= todayTime) {
        salesToday += orderTotal;
      }
      if (orderTime >= weekTime) {
        salesWeek += orderTotal;
      }
    });

    // 2. Count Clients
    const clientCount = await prisma.user.count({
      where: { role: 'CLIENT' },
    });

    // 3. Count Orders by Status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    });

    const statusCounts: Record<string, number> = {
      PENDING: 0,
      PREPARING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    ordersByStatus.forEach((item) => {
      statusCounts[item.status] = item._count._all;
    });

    // Total orders count
    const totalOrdersCount = await prisma.order.count();

    // 4. Products out of stock or low stock (<= 5)
    const lowStockProducts = await prisma.product.findMany({
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

    const outOfStockCount = await prisma.product.count({
      where: { stock: 0, isActive: true },
    });

    // 5. Generate daily sales chart data for the last 14 days
    const chartDays = 14;
    const dailySalesMap: Record<string, { date: string; sales: number; count: number }> = {};
    
    for (let i = chartDays - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = date.toISOString().slice(0, 10); // YYYY-MM-DD
      const formattedLabel = `${date.getDate()}/${date.getMonth() + 1}`;
      dailySalesMap[key] = { date: formattedLabel, sales: 0, count: 0 };
    }

    // Populate daily sales from last 30 days orders that fall within our range
    orders.forEach((order) => {
      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      if (dailySalesMap[key]) {
        dailySalesMap[key].sales += order.total;
        dailySalesMap[key].count += 1;
      }
    });

    const chartData = Object.values(dailySalesMap);

    // 6. Top selling products
    // Fetch all items from the last 30 days, group by product in memory
    const productSalesMap: Record<string, { name: string; quantity: number; totalSales: number }> = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.productId) {
          if (!productSalesMap[item.productId]) {
            productSalesMap[item.productId] = {
              name: item.name,
              quantity: 0,
              totalSales: 0,
            };
          }
          productSalesMap[item.productId].quantity += item.quantity;
          productSalesMap[item.productId].totalSales += item.quantity * item.price;
        }
      });
    });

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

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
      },
    });
  } catch (error) {
    console.error('Error generating reports:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al generar los reportes' },
      { status: 500 }
    );
  }
}
