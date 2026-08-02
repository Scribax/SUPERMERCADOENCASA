import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET: listar favoritos del usuario
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      select: { productId: true },
    });

    return NextResponse.json({ success: true, favorites: favorites.map(f => f.productId) });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener favoritos' }, { status: 500 });
  }
}

// POST: toggle favorito (agregar/quitar)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { productId } = await request.json();
    if (!productId) return NextResponse.json({ error: 'productId requerido' }, { status: 400 });

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (existing) {
      // Remove
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, favorited: false });
    } else {
      // Add
      await prisma.favorite.create({ data: { userId: user.id, productId } });
      return NextResponse.json({ success: true, favorited: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar favorito' }, { status: 500 });
  }
}
