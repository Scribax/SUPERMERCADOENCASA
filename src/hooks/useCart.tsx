'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string | null;
  description: string;
  price: number;
  offerPrice?: number | null;
  stock: number;
  weight: number;
  images: string;
  categoryId?: string | null;
  brandId?: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  discountAmount: number;
}

interface Promotion {
  id: string;
  name: string;
  type: 'TWO_FOR_ONE' | 'THREE_FOR_TWO' | 'PACK' | 'COMBO' | 'AUTO_DISCOUNT';
  value: number;
  configJson: string;
}

interface CartContextType {
  cart: CartItem[];
  favorites: string[];
  viewHistory: string[];
  isCartOpen: boolean;
  coupon: Coupon | null;
  promotions: Promotion[];
  shippingCost: number;
  freeShippingThreshold: number;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  
  // Coupon Actions
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  
  // Favorite Actions
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // History Actions
  addToHistory: (productId: string) => void;

  // Calculators
  subtotal: number;
  promoDiscount: number;
  couponDiscount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  
  const [shippingCostLimit, setShippingCostLimit] = useState(290);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(4500);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const toast = useToast();
  const { user } = useAuth();

  // Sync favorites from API when user logs in
  useEffect(() => {
    if (user) {
      fetch('/api/favorites')
        .then(r => r.json())
        .then(d => {
          if (d.favorites) {
            setFavorites(d.favorites);
            localStorage.setItem('superencasa_favs', JSON.stringify(d.favorites));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Load cart, favorites, and history from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('superencasa_cart');
    if (storedCart) {
      try { setCart(JSON.parse(storedCart)); } catch (e) { console.error(e); }
    }

    const storedFavs = localStorage.getItem('superencasa_favs');
    if (storedFavs) {
      try { setFavorites(JSON.parse(storedFavs)); } catch (e) { console.error(e); }
    }

    const storedHistory = localStorage.getItem('superencasa_history');
    if (storedHistory) {
      try { setViewHistory(JSON.parse(storedHistory)); } catch (e) { console.error(e); }
    }

    // Fetch store configuration and promotions
    const fetchConfigs = async () => {
      try {
        const [configRes, promoRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/promotions'),
        ]);

        if (configRes.ok) {
          const configData = await configRes.json();
          if (configData.config) {
            setShippingCostLimit(parseFloat(configData.config.shipping_cost || '290'));
            setFreeShippingThreshold(parseFloat(configData.config.free_shipping_threshold || '4500'));
          }
        }

        if (promoRes.ok) {
          const promoData = await promoRes.json();
          if (promoData.promotions) {
            setPromotions(promoData.promotions);
          }
        }
      } catch (e) {
        console.error('Error fetching config in cart context:', e);
      }
    };

    fetchConfigs();
  }, []);

  // Save cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('superencasa_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product, quantity = 1) => {
    const existing = cart.find((item) => item.product.id === product.id);
    let newCart;

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        toast.error(`Lo sentimos, no hay más stock disponible de ${product.name}`);
        return;
      }
      newCart = cart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: newQty } : item
      );
      toast.success(`Se actualizó la cantidad de ${product.name} en el carrito`);
    } else {
      if (quantity > product.stock) {
        toast.error(`Lo sentimos, no hay más stock disponible de ${product.name}`);
        return;
      }
      newCart = [...cart, { product, quantity }];
      toast.success(`Se agregó ${product.name} al carrito`);
    }
    saveCart(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find((i) => i.product.id === productId);
    if (item && quantity > item.product.stock) {
      toast.error(`Límite de stock alcanzado (${item.product.stock} unidades)`);
      return;
    }

    const newCart = cart.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    const newCart = cart.filter((i) => i.product.id !== productId);
    saveCart(newCart);
    if (item) {
      toast.info(`Se eliminó ${item.product.name} del carrito`);
    }
  };

  const clearCart = () => {
    saveCart([]);
    setCoupon(null);
  };

  // Coupon Operations
  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCoupon(data.coupon);
        toast.success(`Cupón ${data.coupon.code} aplicado con éxito!`);
        return true;
      } else {
        toast.error(data.error || 'Cupón inválido');
        return false;
      }
    } catch (e) {
      toast.error('Error de red al validar cupón');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.info('Cupón removido');
  };

  // Favorite Operations
  const toggleFavorite = (productId: string) => {
    let newFavs;
    if (favorites.includes(productId)) {
      newFavs = favorites.filter((id) => id !== productId);
      toast.info('Eliminado de favoritos');
    } else {
      newFavs = [...favorites, productId];
      toast.success('Agregado a favoritos');
    }
    setFavorites(newFavs);
    localStorage.setItem('superencasa_favs', JSON.stringify(newFavs));
    // Sync to backend if logged in
    if (user) {
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      }).catch(() => {});
    }
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // History Operations
  const addToHistory = (productId: string) => {
    const filtered = viewHistory.filter((id) => id !== productId);
    const newHistory = [productId, ...filtered].slice(0, 10); // Keep last 10 viewed
    setViewHistory(newHistory);
    localStorage.setItem('superencasa_history', JSON.stringify(newHistory));
  };

  // Calculations
  // 1. Subtotal using real prices (offer price if active)
  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.offerPrice !== null && item.product.offerPrice !== undefined
      ? item.product.offerPrice
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // 2. Automatic Promotions (client-side calculation for visual representation)
  const rawPromoDiscount = cart.reduce((sum, item) => {
    const product = item.product;
    const price = product.offerPrice !== null && product.offerPrice !== undefined
      ? product.offerPrice
      : product.price;

    const itemSubtotal = price * item.quantity;
    let itemDiscount = 0;

    promotions.forEach((promo) => {
      try {
        const config = JSON.parse(promo.configJson || '{}');
        
        const matchesCategory = Boolean(config.categoryId && product.categoryId === config.categoryId);
        const matchesProduct = Boolean(config.productIds && config.productIds.includes(product.id));
        const appliesToAll = Boolean(config.appliesToAll === true);

        if (matchesCategory || matchesProduct || appliesToAll) {
          if (promo.type === 'TWO_FOR_ONE') {
            const pairs = Math.floor(item.quantity / 2);
            itemDiscount += pairs * price;
          } else if (promo.type === 'THREE_FOR_TWO') {
            const triplets = Math.floor(item.quantity / 3);
            itemDiscount += triplets * price;
          } else if (promo.type === 'AUTO_DISCOUNT') {
            itemDiscount += itemSubtotal * (promo.value / 100);
          }
        }
      } catch (e) {
        console.error('Error parsing promo config:', e);
      }
    });

    // Item discount can never exceed the item's own total price
    return sum + Math.min(itemDiscount, itemSubtotal);
  }, 0);

  // Total promo discount can never exceed cart subtotal
  const promoDiscount = Math.min(rawPromoDiscount, subtotal);

  // 3. Coupon Discount calculation
  let couponDiscount = 0;
  if (coupon) {
    const totalAfterPromo = subtotal - promoDiscount;
    if (coupon.type === 'PERCENTAGE') {
      couponDiscount = (totalAfterPromo * coupon.value) / 100;
    } else {
      couponDiscount = coupon.value;
    }

    if (couponDiscount > totalAfterPromo) {
      couponDiscount = totalAfterPromo;
    }
  }

  // 4. Shipping Calculation
  const totalBeforeShipping = subtotal - promoDiscount - couponDiscount;
  const shippingCost = totalBeforeShipping >= freeShippingThreshold || cart.length === 0 ? 0 : shippingCostLimit;

  // 5. Total
  const total = totalBeforeShipping + shippingCost;

  return (
    <CartContext.Provider
      value={{
        cart,
        favorites,
        viewHistory,
        isCartOpen,
        coupon,
        promotions,
        shippingCost,
        freeShippingThreshold,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setCartOpen,
        applyCoupon,
        removeCoupon,
        toggleFavorite,
        isFavorite,
        addToHistory,
        subtotal,
        promoDiscount,
        couponDiscount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
