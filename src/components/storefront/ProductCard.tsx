'use client';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  title: string;
  presentation: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  imagePlaceholderColor?: string;
}

export default function ProductCard({ 
  title, 
  presentation, 
  price, 
  originalPrice, 
  discount,
  imagePlaceholderColor = "#F1F5F9"
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '16px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', cursor: 'pointer' }}
    >
      {/* Discount Badge */}
      {discount && (
        <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#F97316', color: '#FFFFFF', fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', zIndex: 10, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          {discount} OFF
        </div>
      )}

      {/* Product Image Placeholder */}
      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '12px', backgroundColor: imagePlaceholderColor, marginBottom: '16px', overflow: 'hidden', position: 'relative' }}>
        <motion.div 
          style={{ width: '100%', height: '100%' }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontWeight: '600', color: '#1E293B', lineHeight: 1.25, marginBottom: '4px', fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {title}
        </h3>
        <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px', margin: 0 }}>{presentation}</p>
        
        <div style={{ marginTop: 'auto' }}>
          {originalPrice && (
            <p style={{ fontSize: '14px', color: '#94A3B8', textDecoration: 'line-through', marginBottom: '2px', margin: 0 }}>
              ${originalPrice.toFixed(2)}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#0E4FAF', margin: 0 }}>
              ${price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button style={{ width: '100%', marginTop: '16px', backgroundColor: '#F8FAFC', color: '#0E4FAF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.3s' }}>
        <ShoppingCart size={16} />
        Agregar
      </button>
    </motion.div>
  );
}
