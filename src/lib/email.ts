/**
 * Email Notification Service for Supermercado en Casa
 * Supports Resend API (Direct HTTP), SMTP (Nodemailer), or Console fallback.
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Superencasa <onboarding@resend.dev>';

  // 1. Try Resend API (Fastest & Most Reliable)
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[RESEND SUCCESS] Email sent to ${to} (ID: ${data.id})`);
        return true;
      } else {
        console.error(`[RESEND API WARNING]`, data);
      }
    } catch (err) {
      console.error('[RESEND FETCH ERROR]', err);
    }
  }

  // 2. Fallback to Nodemailer SMTP if configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Superencasa" <${smtpUser}>`,
        to,
        subject,
        html,
      });

      console.log(`[SMTP SUCCESS] Delivered email to ${to}`);
      return true;
    } catch (error) {
      console.error(`[SMTP ERROR] Failed to send to ${to}:`, error);
    }
  }

  // 3. Fallback Logger
  console.log(`[EMAIL LOG - SIMULATED] To: ${to} | Subject: "${subject}"`);
  return true;
}

// 📧 HTML Template: Order Confirmation to Customer
export function buildOrderEmailHtml(order: any): string {
  const itemsList = order.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">${item.name} x ${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: right; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0E4FAF; padding: 24px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">¡Gracias por tu compra, ${order.customerName}!</h1>
        <p style="margin: 6px 0 0; opacity: 0.9;">Pedido #${order.id.slice(0, 8)}</p>
      </div>

      <div style="padding: 24px;">
        <p style="color: #475569; font-size: 15px;">Hemos recibido tu pedido correctamente y ya estamos preparando tus productos frescos.</p>
        
        <div style="background: #F8FAFC; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px; color: #0F172A; font-size: 16px;">Detalle de entrega:</h3>
          <p style="margin: 4px 0; color: #475569;"><strong>Dirección:</strong> ${order.shippingAddress} ${order.locality ? `(${order.locality})` : ''}</p>
          ${order.deliveryDate ? `<p style="margin: 4px 0; color: #475569;"><strong>Fecha de entrega:</strong> ${order.deliveryDate}</p>` : ''}
          ${order.deliverySlot ? `<p style="margin: 4px 0; color: #475569;"><strong>Turno horario:</strong> ${order.deliverySlot}</p>` : ''}
          <p style="margin: 4px 0; color: #475569;"><strong>Método de pago:</strong> ${order.paymentMethod}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #F1F5F9; text-align: left; font-size: 13px; color: #64748B;">
              <th style="padding: 10px;">Producto</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <div style="text-align: right; border-top: 2px solid #E2E8F0; padding-top: 12px;">
          <p style="margin: 4px 0; color: #64748B; font-size: 14px;">Subtotal: $${order.subtotal.toFixed(2)}</p>
          <p style="margin: 4px 0; color: #64748B; font-size: 14px;">Envío: $${order.shippingCost.toFixed(2)}</p>
          <h2 style="margin: 8px 0 0; color: #0E4FAF; font-size: 22px;">Total: $${order.total.toFixed(2)}</h2>
        </div>
      </div>
      
      <div style="background: #F1F5F9; padding: 16px; text-align: center; color: #94A3B8; font-size: 12px;">
        Superencasa - Tu Supermercado 100% Online
      </div>
    </div>
  `;
}

// 🔐 HTML Template: Password Reset Link
export function buildResetPasswordEmailHtml(name: string, resetUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 28px;">
      <h2 style="color: #0E4FAF; margin-top: 0;">Restablecer contraseña</h2>
      <p style="color: #475569; font-size: 15px;">Hola <strong>${name}</strong>,</p>
      <p style="color: #475569; font-size: 15px; line-height: 1.5;">
        Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Superencasa</strong>.
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${resetUrl}" style="background-color: #0E4FAF; color: white; padding: 14px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">
          Restablecer mi contraseña
        </a>
      </div>
      <p style="color: #94A3B8; font-size: 13px;">
        Este enlace caducará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
      </p>
    </div>
  `;
}
