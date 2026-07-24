import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener los banners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { imageUrl, linkUrl, title, subtitle, order, type, isActive } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'La imagen es obligatoria' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        imageUrl,
        linkUrl: linkUrl || null,
        title: title || null,
        subtitle: subtitle || null,
        order: order !== undefined ? parseInt(order) : 0,
        type: type || 'HERO',
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al crear el banner' },
      { status: 500 }
    );
  }
}
