import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El correo electrónico ya está registrado' },
        { status: 400 }
      );
    }

    // Determine role (first user is ADMIN)
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'CLIENT';

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user,
    });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al registrar el usuario' },
      { status: 500 }
    );
  }
}
