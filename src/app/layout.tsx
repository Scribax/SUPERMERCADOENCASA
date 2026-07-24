import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/hooks/useAuth';
import { CartProvider } from '@/hooks/useCart';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import CartDrawer from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'Superencasa | Tu Supermercado 100% Online',
  description: 'Comprá online al mejor precio. Envíos rápidos, productos frescos y atención personalizada del campo a tu casa.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Superencasa | Tu Supermercado 100% Online',
    description: 'Comprá online al mejor precio. Envíos rápidos, productos frescos y atención personalizada.',
    url: '/',
    siteName: 'Superencasa',
    images: [
      {
        url: '/assets/banner-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Superencasa Supermercado',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Superencasa | Tu Supermercado 100% Online',
    description: 'Comprá online al mejor precio. Envíos rápidos, productos frescos.',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light" suppressHydrationWarning>
      <body>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main style={{ flex: 1, minHeight: 'calc(100vh - var(--header-height))' }}>
                {children}
              </main>
              <Footer />
              <CartDrawer />
              <WhatsAppButton />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
        {/* Programmatically unregister stray service workers from other localhost projects */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(regs) {
                  for (var i = 0; i < regs.length; i++) {
                    regs[i].unregister().then(function() {
                      console.log('Stray service worker removed.');
                    });
                  }
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
