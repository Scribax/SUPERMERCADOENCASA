import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { sendEmail, buildResetPasswordEmailHtml } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'El correo electrónico es requerido' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({ success: true, message: 'Si el correo está registrado, recibirás un enlace de recuperación.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour token expiration

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      },
    });

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${origin}/login/reset-password?token=${resetToken}`;
    const emailHtml = buildResetPasswordEmailHtml(user.name, resetUrl);

    await sendEmail({
      to: user.email,
      subject: '🔑 Restablecer contraseña - Superencasa',
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: 'Si el correo está registrado, recibirás un enlace de recuperación.',
    });
  } catch (error: any) {
    console.error('Error in forgot-password API:', error);
    return NextResponse.json({ error: 'Error del servidor al procesar la solicitud' }, { status: 500 });
  }
}
