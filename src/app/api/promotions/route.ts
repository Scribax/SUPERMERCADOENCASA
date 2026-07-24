import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, promotions });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener las promociones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { name, type, value, configJson } = await request.json();

    if (!name || !type || !configJson) {
      return NextResponse.json(
        { error: 'Los campos nombre, tipo y configuración son obligatorios' },
        { status: 400 }
      );
    }

    // Verify config is valid JSON
    try {
      JSON.parse(configJson);
    } catch (e) {
      return NextResponse.json(
        { error: 'La configuración debe ser un formato JSON válido' },
        { status: 400 }
      );
    }

    const promotion = await prisma.promotion.create({
      data: {
        name,
        type,
        value: value !== undefined ? parseFloat(value) : 0,
        configJson,
      },
    });

    return NextResponse.json({ success: true, promotion });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al crear la promoción' },
      { status: 500 }
    );
  }
}
