import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';
import { prisma } from './db';

export async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}
