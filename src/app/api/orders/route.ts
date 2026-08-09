import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let orders;
    const { searchParams } = new URL(request.url);
    const locality = searchParams.get('locality');

    const whereClause: any = {};
    if (locality) {
      whereClause.locality = locality;
    }

    if (user.role === 'ADMIN' || user.role === 'EMPLOYEE') {
      // Admins and employees see all orders
      orders = await prisma.order.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      });
    } else {
      // Clients see only their own orders
      orders = await prisma.order.findMany({
        where: { ...whereClause, userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      });
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener los pedidos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user (allow guest checkout if no token, but we default to logged-in user details)
    const user = await getCurrentUser(request);
    const userId = user?.id || null;

    const body = await request.json();
    const {
      items, // array of { productId, quantity }
      couponCode,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      locality,
      deliveryDate,
      deliverySlot,
      paymentMethod, // MERCADO_PAGO, TRANSFER, CASH
    } = body;

    if (!items || !items.length || !customerName || !customerEmail || !customerPhone || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Todos los datos de envío, contacto, productos y método de pago son requeridos' },
        { status: 400 }
      );
    }

    // 1. Fetch all products in this order from the DB
    const productIds = items.map((item: any) => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: 'Uno o más productos no existen' }, { status: 400 });
    }

    // 2. Fetch active promotions
    const activePromos = await prisma.promotion.findMany({
      where: { isActive: true },
    });

    // 3. Calculate subtotal & automatic promotions
    let subtotal = 0;
    let promoDiscount = 0;
    const orderItemsData: any[] = [];

    // Loop through requested items
    for (const item of items) {
      const product = dbProducts.find((p) => p.id === item.productId)!;
      
      // Check stock
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para el producto: ${product.name}. Stock disponible: ${product.stock}` },
          { status: 400 }
        );
      }

      const itemPrice = product.offerPrice !== null ? product.offerPrice : product.price;
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      // Apply automatic promos
      let itemDiscount = 0;
      for (const promo of activePromos) {
        try {
          const config = JSON.parse(promo.configJson || '{}');
          
          // Check if promo applies to this category or product
          const matchesCategory = Boolean(config.categoryId && product.categoryId === config.categoryId);
          const matchesProduct = Boolean(config.productIds && config.productIds.includes(product.id));
          const appliesToAll = Boolean(config.appliesToAll === true);

          if (matchesCategory || matchesProduct || appliesToAll) {
            if (promo.type === 'TWO_FOR_ONE') {
              const pairs = Math.floor(item.quantity / 2);
              itemDiscount += pairs * itemPrice;
            } else if (promo.type === 'THREE_FOR_TWO') {
              const triplets = Math.floor(item.quantity / 3);
              itemDiscount += triplets * itemPrice;
            } else if (promo.type === 'AUTO_DISCOUNT') {
              itemDiscount += itemSubtotal * (promo.value / 100);
            }
          }
        } catch (e) {
          console.error('Error parsing promo config:', e);
        }
      }

      promoDiscount += Math.min(itemDiscount, itemSubtotal);
      orderItemsData.push({
        productId: product.id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        stockDiff: -item.quantity, // Save diff for inventory updates
      });
    }

    // Total promo discount can never exceed total subtotal
    promoDiscount = Math.min(promoDiscount, subtotal);

    // 4. Calculate coupon discount
    let couponDiscount = 0;
    let couponIdToUpdate = null;
    let validatedCouponCode = null;

    if (couponCode) {
      const cleanCode = couponCode.toUpperCase().trim();
      const coupon = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        const isValidDate = now >= new Date(coupon.startDate) && now <= new Date(coupon.endDate);
        const isWithinUsageLimit = coupon.currentUsage < coupon.maxUsage;
        const isMinPurchaseMet = (subtotal - promoDiscount) >= coupon.minPurchase;

        if (isValidDate && isWithinUsageLimit && isMinPurchaseMet) {
          if (coupon.type === 'PERCENTAGE') {
            couponDiscount = ((subtotal - promoDiscount) * coupon.value) / 100;
          } else {
            couponDiscount = coupon.value;
          }

          if (couponDiscount > (subtotal - promoDiscount)) {
            couponDiscount = subtotal - promoDiscount;
          }

          couponIdToUpdate = coupon.id;
          validatedCouponCode = coupon.code;
        }
      }
    }

    // 5. Fetch shipping rules from StoreConfig and Locality
    const shippingCostConfig = await prisma.storeConfig.findUnique({ where: { key: 'shipping_cost' } });
    const freeShippingConfig = await prisma.storeConfig.findUnique({ where: { key: 'free_shipping_threshold' } });

    let configShippingCost = parseFloat(shippingCostConfig?.value || '0');
    if (locality) {
      const dbLocality = await prisma.locality.findUnique({ where: { name: locality } });
      if (dbLocality && dbLocality.isActive) {
        configShippingCost = dbLocality.shippingCost;
        if (dbLocality.minPurchase > 0 && subtotal < dbLocality.minPurchase) {
          return NextResponse.json(
            { error: `El monto mínimo de compra para envío a ${locality} es de $${dbLocality.minPurchase.toLocaleString('es-AR')}` },
            { status: 400 }
          );
        }
      }
    }

    const configFreeShippingThreshold = parseFloat(freeShippingConfig?.value || '0');

    const totalBeforeShipping = subtotal - promoDiscount - couponDiscount;
    const shippingCost = totalBeforeShipping >= configFreeShippingThreshold ? 0 : configShippingCost;
    const total = totalBeforeShipping + shippingCost;

    // 6. DB transaction to write Order, OrderItems, adjust stock, log inventory, clear cart
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          subtotal,
          shippingCost,
          discount: promoDiscount + couponDiscount,
          total,
          couponCode: validatedCouponCode,
          shippingAddress,
          locality: locality || null,
          deliveryDate: deliveryDate || null,
          deliverySlot: deliverySlot || null,
          paymentMethod,
          paymentStatus: paymentMethod === 'CASH' ? 'PENDING' : 'PENDING',
          customerName,
          customerEmail,
          customerPhone,
          items: {
            create: orderItemsData.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Update product stock and write inventory logs
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
            inventoryLogs: {
              create: {
                quantity: -item.quantity,
                reason: `Venta en pedido #${newOrder.id.slice(0, 8)}`,
                userId,
              },
            },
          },
        });
      }

      // Update coupon usage count if used
      if (couponIdToUpdate) {
        await tx.coupon.update({
          where: { id: couponIdToUpdate },
          data: {
            currentUsage: {
              increment: 1,
            },
          },
        });
      }

      // Clear active cart items for this logged-in user
      if (userId) {
        await tx.cartItem.deleteMany({
          where: { userId },
        });
      }

      return newOrder;
    });

    // Send email notification asynchronously
    try {
      const { sendEmail, buildOrderEmailHtml } = await import('@/lib/email');
      const emailHtml = buildOrderEmailHtml(order);
      sendEmail({
        to: customerEmail,
        subject: `🛒 Confirmación de Pedido #${order.id.slice(0, 8)} - Superencasa`,
        html: emailHtml,
      }).catch(() => {});
    } catch (e) {
      console.error('Email helper import failed:', e);
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al procesar el pedido' },
      { status: 500 }
    );
  }
}
