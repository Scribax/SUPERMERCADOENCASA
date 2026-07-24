import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json({ error: 'Banner no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener el banner' },
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
    const { imageUrl, linkUrl, title, subtitle, order, type, isActive } = body;

    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner no encontrado' }, { status: 404 });
    }

    const updatedData: any = {};
    if (imageUrl !== undefined) updatedData.imageUrl = imageUrl;
    if (linkUrl !== undefined) updatedData.linkUrl = linkUrl || null;
    if (title !== undefined) updatedData.title = title || null;
    if (subtitle !== undefined) updatedData.subtitle = subtitle || null;
    if (order !== undefined) updatedData.order = parseInt(order);
    if (type !== undefined) updatedData.type = type;
    if (isActive !== undefined) updatedData.isActive = isActive;

    const banner = await prisma.banner.update({
      where: { id: existingBanner.id },
      data: updatedData,
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al actualizar el banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner no encontrado' }, { status: 404 });
    }

    await prisma.banner.delete({
      where: { id: existingBanner.id },
    });

    return NextResponse.json({ success: true, message: 'Banner eliminado' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al eliminar el banner' },
      { status: 500 }
    );
  }
}
