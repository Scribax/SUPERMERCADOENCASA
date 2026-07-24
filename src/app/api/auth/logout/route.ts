import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada exitosamente' });
  
  // Clear cookie by setting maxAge to 0
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}
