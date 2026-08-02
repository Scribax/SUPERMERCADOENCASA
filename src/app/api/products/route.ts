import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// Helper to generate slugs
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    
    // Filters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('categoria') || '';
    const brand = searchParams.get('marca') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '9999999');
    const inStock = searchParams.get('disponibilidad') === 'in-stock';
    const activeOnly = searchParams.get('activeOnly') !== 'false'; // Admin panel might want to see inactive products

    // Sorting
    const orden = searchParams.get('orden') || 'mas-recientes';

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build prisma query conditions
    const where: any = {};

    if (activeOnly) {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
        { barcode: { contains: search } },
      ];
    }

    if (category) {
      // Find by category slug or ID
      where.category = {
        OR: [
          { slug: category },
          { id: category },
        ]
      };
    }

    if (brand) {
      // Find by brand slug or ID
      where.brand = {
        OR: [
          { slug: brand },
          { id: brand },
        ]
      };
    }

    if (minPrice > 0 || maxPrice < 9999999) {
      where.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    if (inStock) {
      where.stock = {
        gt: 0,
      };
    }

    // Determine sorting
    let orderBy: any = { createdAt: 'desc' };
    if (orden === 'menor-precio') {
      orderBy = { price: 'asc' };
    } else if (orden === 'mayor-precio') {
      orderBy = { price: 'desc' };
    } else if (orden === 'mas-recientes') {
      orderBy = { createdAt: 'desc' };
    } else if (orden === 'mas-vendidos') {
      // Simplification: order by stock desc or simulated popularity
      orderBy = { id: 'desc' };
    }

    // Fetch products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener los productos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate and verify role (Admin or Employee)
    const user = await getCurrentUser(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      offerPrice,
      cost,
      stock,
      weight,
      sku,
      barcode,
      brandId,
      categoryId,
      images,
      nutritionInfo,
      metaTitle,
      metaDescription,
    } = body;

    // Validations
    if (!name || !description || price === undefined || stock === undefined || !sku) {
      return NextResponse.json(
        { error: 'Los campos nombre, descripción, precio, stock y SKU son obligatorios' },
        { status: 400 }
      );
    }

    // Check SKU uniqueness
    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      return NextResponse.json(
        { error: `Ya existe un producto con el SKU ${sku}` },
        { status: 400 }
      );
    }

    // Create unique slug
    let slug = slugify(name);
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        barcode: barcode || null,
        description,
        price: parseFloat(price),
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        cost: cost ? parseFloat(cost) : 0,
        stock: parseInt(stock),
        weight: weight ? parseFloat(weight) : 0,
        brandId: brandId || null,
        categoryId: categoryId || null,
        images: images || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
        nutritionInfo: nutritionInfo || null,
        metaTitle: metaTitle || `${name} | Superencasa`,
        metaDescription: metaDescription || description.slice(0, 155),
        inventoryLogs: {
          create: {
            quantity: parseInt(stock),
            reason: 'Inicialización de stock por creación de producto',
            userId: user.id,
          },
        },
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al crear el producto' },
      { status: 500 }
    );
  }
}
