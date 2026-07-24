import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const dbConfigs = await prisma.storeConfig.findMany();
    
    // Convert array of {key, value} to a single JSON object
    const configMap: Record<string, string> = {};
    dbConfigs.forEach((c) => {
      configMap[c.key] = c.value;
    });

    return NextResponse.json({ success: true, config: configMap });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener la configuración' },
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

    const body = await request.json(); // Expected as { [key: string]: string }

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Formato de configuración inválido' }, { status: 400 });
    }

    // Run updates in a transaction
    await prisma.$transaction(
      Object.keys(body).map((key) =>
        prisma.storeConfig.upsert({
          where: { key },
          update: { value: String(body[key]) },
          create: { key, value: String(body[key]) },
        })
      )
    );

    return NextResponse.json({ success: true, message: 'Configuración actualizada con éxito' });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al guardar la configuración' },
      { status: 500 }
    );
  }
}
