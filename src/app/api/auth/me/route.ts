import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { name, phone, password } = await request.json();
    const updateData: any = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (password && password.trim().length >= 6) {
      const bcrypt = await import('bcryptjs');
      updateData.passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    const { prisma } = await import('@/lib/db');
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    if (phone !== undefined) {
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: { phone: phone ? phone.trim() : null },
        create: { userId: user.id, phone: phone ? phone.trim() : null },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado con éxito',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
