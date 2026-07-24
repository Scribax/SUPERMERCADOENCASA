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
  imagePlaceholderColor = "bg-slate-100"
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full relative group"
    >
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-sm">
          {discount} OFF
        </div>
      )}

      {/* Product Image Placeholder */}
      <div className={`w-full aspect-square rounded-xl ${imagePlaceholderColor} mb-4 overflow-hidden relative`}>
        <motion.div 
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-slate-800 leading-tight mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mb-3">{presentation}</p>
        
        <div className="mt-auto">
          {originalPrice && (
            <p className="text-sm text-slate-400 line-through mb-0.5">
              ${originalPrice.toFixed(2)}
            </p>
          )}
          <div className="flex items-center justify-between mt-1">
            <p className="text-2xl font-bold text-[#0E4FAF]">
              ${price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button className="w-full mt-4 bg-slate-50 hover:bg-[#0E4FAF] text-[#0E4FAF] hover:text-white border border-slate-200 hover:border-[#0E4FAF] rounded-lg py-2.5 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300">
        <ShoppingCart size={16} />
        Agregar
      </button>
    </motion.div>
  );
}
