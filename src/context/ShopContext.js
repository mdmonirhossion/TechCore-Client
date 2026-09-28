"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackAddToCart } from '@/lib/analytics';
import { validateCouponApi } from '@/lib/api';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const safeStorageParse = (key, fallback) => {
    if (typeof window === 'undefined') return fallback;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
      return fallback;
    }
  };

  // States start empty on SSR for 100% clean hydration
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [coupon, setCoupon] = useState({ code: '', discount: 0 });
  const [isHydrated, setIsHydrated] = useState(false);

  const [builderSlots, setBuilderSlots] = useState({
    CPU: null, 'CPU Cooler': null, Motherboard: null, RAM: null, GPU: null,
    SSD: null, HDD: null, PSU: null, Casing: null, Monitor: null, Keyboard: null, Mouse: null
  });

  // Hydrate states from localStorage after component mounts on client
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedCart = safeStorageParse('techcore_cart', []);
      const savedWishlist = safeStorageParse('techcore_wishlist', []);
      const savedUser = safeStorageParse('techcore_user', null);
      const savedToken = typeof window !== 'undefined' ? (localStorage.getItem('techcore_token') || '') : '';

      setCart(savedCart);
      setWishlist(savedWishlist);
      setUser(savedUser);
      setToken(savedToken);
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('techcore_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart, isHydrated]);

  useEffect(() => {
    try {
      localStorage.setItem('techcore_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('techcore_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('techcore_user');
      }
    } catch (e) {}
  }, [user]);

  const loginUser = (userData, authToken) => {
    setUser(userData);
    if (authToken) {
      setToken(authToken);
      try {
        localStorage.setItem('techcore_token', authToken);
      } catch (e) {}
    }
  };

  const logoutUser = () => {
    setUser(null);
    setToken('');
    try {
      localStorage.removeItem('techcore_user');
      localStorage.removeItem('techcore_token');
    } catch (e) {}
  };

  // Cart Functions
  const addToCart = (product, qty = 1) => {
    if (!product) return;
    const pId = product.id || product._id;
    const pImg = Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : (product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop');

    setCart(prev => {
      const existing = prev.find(item => item.id === pId);
      if (existing) {
        return prev.map(item =>
          item.id === pId ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, {
        id: pId,
        name: product.name || 'Unnamed Product',
        price: Number(product.discountPrice || product.price || 0),
        quantity: qty,
        image: pImg
      }];
    });

    trackAddToCart(product, qty);
  };

  const updateCartQty = (id, delta) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon({ code: '', discount: 0 });
    try {
      localStorage.removeItem('techcore_cart');
    } catch (e) {}
  };

  const applyCouponCode = async (code) => {
    if (!code || !code.trim()) return { success: false, message: 'Please enter a coupon code' };
    const sub = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    try {
      const res = await validateCouponApi(code.trim(), sub, user?.id || user?._id);
      if (res && (res.success || res.discount || res.discountAmount)) {
        const disc = Number(res.discount || res.discountAmount || 0);
        setCoupon({ code: code.trim().toUpperCase(), discount: disc });
        return { success: true, message: res.message || 'Coupon Applied!' };
      }
    } catch (e) {}

    if (code.trim().toUpperCase() === 'TECH10') {
      const disc = Math.round(sub * 0.10);
      setCoupon({ code: 'TECH10', discount: disc });
      return { success: true, message: '10% Coupon Discount Applied!' };
    }
    return { success: false, message: 'Invalid Coupon Code' };
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    if (!product) return;
    const pId = product.id || product._id;
    const normalizedProduct = { ...product, id: pId };

    setWishlist(prev => {
      const exists = prev.some(p => p.id === pId || p._id === pId);
      if (exists) {
        return prev.filter(p => p.id !== pId && p._id !== pId);
      }
      return [...prev, normalizedProduct];
    });
  };

  // Compare Functions
  const toggleCompare = (product) => {
    if (!product) return;
    const pId = product.id || product._id;
    const normalizedProduct = { ...product, id: pId };

    setCompareItems(prev => {
      const exists = prev.some(p => p.id === pId || p._id === pId);
      if (exists) {
        return prev.filter(p => p.id !== pId && p._id !== pId);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 products at a time.');
        return prev;
      }
      return [...prev, normalizedProduct];
    });
  };

  // PC Builder Slot Functions
  const setBuilderComponent = (categoryKey, product) => {
    setBuilderSlots(prev => ({ ...prev, [categoryKey]: product }));
  };

  const removeBuilderComponent = (categoryKey) => {
    setBuilderSlots(prev => ({ ...prev, [categoryKey]: null }));
  };

  const resetBuilder = () => {
    setBuilderSlots({
      CPU: null, 'CPU Cooler': null, Motherboard: null, RAM: null, GPU: null,
      SSD: null, HDD: null, PSU: null, Casing: null, Monitor: null, Keyboard: null, Mouse: null
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <ShopContext.Provider value={{
      cart,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      subtotal,
      coupon,
      applyCouponCode,
      wishlist,
      toggleWishlist,
      compareItems,
      toggleCompare,
      builderSlots,
      setBuilderComponent,
      removeBuilderComponent,
      resetBuilder,
      user,
      token,
      loginUser,
      logoutUser
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
