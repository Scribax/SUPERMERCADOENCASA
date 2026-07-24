'use client';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function CartButton() {
  const { cart, setCartOpen } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={() => setCartOpen(true)}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#0F172A', fontSize: '13px', fontWeight: '600' }}
    >
      <div style={{ position: 'relative' }}>
        <ShoppingBag size={24} />
        {totalItems > 0 && (
          <span style={{ position: 'absolute', top: '-6px', right: '-8px', backgroundColor: '#74C33D', color: '#FFFFFF', fontSize: '10px', fontWeight: '800', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {totalItems}
          </span>
        )}
      </div>
      <span>Mi carrito</span>
    </button>
  );
}
