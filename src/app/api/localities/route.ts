import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const localities = await prisma.locality.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, localities });
  } catch (error) {
    console.error('Error fetching localities:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener las localidades' },
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

    const { name, shippingCost, isActive } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const existingLocality = await prisma.locality.findUnique({ where: { name } });
    if (existingLocality) {
      return NextResponse.json(
        { error: 'Ya existe una localidad con este nombre' },
        { status: 400 }
      );
    }

    const locality = await prisma.locality.create({
      data: {
        name,
        shippingCost: shippingCost !== undefined ? parseFloat(shippingCost) : 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, locality });
  } catch (error) {
    console.error('Error creating locality:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al crear la localidad' },
      { status: 500 }
    );
  }
}
