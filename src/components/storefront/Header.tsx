'use client';
import LocationSelector from './LocationSelector';
import LiveSearchModal from './LiveSearchModal';
import CartButton from './CartButton';
import { ShoppingCart, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="main-header" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', width: '100%' }}>
      <div className="header-inner-container">
        {/* Top Mobile / Desktop Bar: Logo + Cart/User */}
        <div className="header-brand-row">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#74C33D', color: '#FFFFFF', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShoppingCart size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '22px', fontWeight: '900', lineHeight: 1 }}>
                <span style={{ color: '#0E4FAF' }}>Super</span>
                <span style={{ color: '#74C33D' }}>encasa</span>
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', fontWeight: '500' }} className="brand-tagline">
                Compra fácil, recibe en casa
              </span>
            </div>
          </Link>

          {/* Right Mobile / Desktop Actions */}
          <div className="header-actions">
            <Link href={user ? "/cuenta" : "/login"} className="header-account-link">
              <UserIcon size={20} color="#0E4FAF" />
              <div className="account-text-wrapper">
                <span style={{ color: '#64748B', fontSize: '11px' }}>
                  {user ? `Hola, ${user.name.split(' ')[0]}` : 'Bienvenido'}
                </span>
                <span style={{ color: '#0E4FAF', fontWeight: '700', fontSize: '13px' }}>
                  {user ? 'Mi cuenta' : 'Ingresar'}
                </span>
              </div>
            </Link>
            <CartButton />
          </div>
        </div>

        {/* Center/Bottom Controls: Location & Search */}
        <div className="header-controls-row">
          <div className="location-wrapper">
            <LocationSelector />
          </div>
          <div className="search-wrapper">
            <LiveSearchModal />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .header-inner-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
        }

        .header-brand-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }

        .header-account-link {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }

        .account-text-wrapper {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .header-controls-row {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 14px;
          justify-content: center;
          min-width: 0;
        }

        .location-wrapper {
          flex-shrink: 0;
        }

        .search-wrapper {
          flex: 1;
          max-width: 520px;
          min-width: 0;
        }

        /* Mobile Adjustments (< 992px) */
        @media (max-width: 991px) {
          .header-inner-container {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            padding: 10px 12px;
          }

          .header-brand-row {
            width: 100%;
          }

          .brand-tagline {
            display: none !important;
          }

          .header-controls-row {
            flex-direction: column;
            width: 100%;
            gap: 8px;
          }

          .location-wrapper, .search-wrapper {
            width: 100% !important;
            max-width: 100% !important;
          }

          .account-text-wrapper {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
