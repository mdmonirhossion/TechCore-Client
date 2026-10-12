"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackAddToCart } from '@/lib/analytics';
import { validateCouponApi } from '@/lib/api';

const ShopContext = createContext();

export const createCompareSnapshot = (product) => {
  if (!product) return null;
  const id = product.id || product._id;
  if (!id) return null;
  const image = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (product.image || '');

  return {
    id: String(id),
    slug: product.slug || String(id),
    name: product.name || '',
    brand: product.brand || '',
    category: product.category || '',
    price: Number(product.price) || 0,
    discountPrice: product.discountPrice !== undefined ? Number(product.discountPrice) : (Number(product.price) || 0),
    image: image,
    stock: product.stock !== undefined ? Number(product.stock) : 0,
    stockStatus: product.stockStatus || (Number(product.stock) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'),
    warranty: product.warranty || '',
    rating: product.rating !== undefined ? Number(product.rating) : 5.0,
    emiAvailable: product.emiAvailable !== undefined ? Boolean(product.emiAvailable) : true,
    specifications: (product.specifications && typeof product.specifications === 'object') ? product.specifications : {}
  };
};

const isValidCompareItem = (item) => {
  return Boolean(
    item &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    (item.id || item._id) &&
    (item.name || item.slug)
  );
};

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
  const [compareMessage, setCompareMessage] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [coupon, setCoupon] = useState({ code: '', discount: 0 });
  const [theme, setTheme] = useState('light');
  const [isHydrated, setIsHydrated] = useState(false);

  const [builderSlots, setBuilderSlots] = useState({
    CPU: null, 'CPU Cooler': null, Motherboard: null, RAM: null, GPU: null,
    SSD: null, HDD: null, PSU: null, Casing: null, Monitor: null, Keyboard: null, Mouse: null
  });

  // Auto-clear compare limit message toast after 3.5s
  useEffect(() => {
    if (!compareMessage) return;
    const timer = setTimeout(() => {
      setCompareMessage('');
    }, 3500);
    return () => clearTimeout(timer);
  }, [compareMessage]);

  // Hydrate states from localStorage after component mounts on client
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedCart = safeStorageParse('techcore_cart', []);
      const savedWishlist = safeStorageParse('techcore_wishlist', []);
      const rawCompare = safeStorageParse('techcore_compare', []);
      const validCompare = Array.isArray(rawCompare)
        ? rawCompare
            .filter(isValidCompareItem)
            .map(createCompareSnapshot)
            .filter(Boolean)
            .slice(0, 4)
        : [];
      const savedUser = safeStorageParse('techcore_user', null);
      const savedToken = typeof window !== 'undefined' ? (localStorage.getItem('techcore_token') || '') : '';
      const savedTheme = typeof window !== 'undefined' ? (localStorage.getItem('techcore_theme') || 'light') : 'light';

      setCart(savedCart);
      setWishlist(savedWishlist);
      setCompareItems(validCompare);
      setUser(savedUser);
      setToken(savedToken);
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('techcore_theme', nextTheme);
      } catch (e) {}
      return nextTheme;
    });
  };

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('techcore_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('techcore_compare', JSON.stringify(compareItems));
    } catch (e) {}
  }, [compareItems, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('techcore_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist, isHydrated]);

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
    const pId = String(product.id || product._id || '');
    if (!pId) return;

    setCompareItems(prev => {
      const exists = prev.some(p => String(p.id || p._id) === pId || (product.slug && p.slug === product.slug));
      if (exists) {
        return prev.filter(p => String(p.id || p._id) !== pId && (!product.slug || p.slug !== product.slug));
      }
      if (prev.length >= 4) {
        setCompareMessage('You can compare a maximum of 4 products at a time.');
        return prev;
      }
      const snapshot = createCompareSnapshot(product);
      return snapshot ? [...prev, snapshot] : prev;
    });
  };

  const addToCompare = (product) => {
    if (!product) return false;
    const pId = String(product.id || product._id || '');
    if (!pId) return false;

    let added = false;
    setCompareItems(prev => {
      const exists = prev.some(p => String(p.id || p._id) === pId || (product.slug && p.slug === product.slug));
      if (exists) return prev;
      if (prev.length >= 4) {
        setCompareMessage('You can compare a maximum of 4 products at a time.');
        return prev;
      }
      const snapshot = createCompareSnapshot(product);
      if (snapshot) {
        added = true;
        return [...prev, snapshot];
      }
      return prev;
    });
    return added;
  };

  const removeFromCompare = (idOrSlug) => {
    if (!idOrSlug) return;
    const target = String(idOrSlug);
    setCompareItems(prev => prev.filter(p => String(p.id) !== target && p.slug !== target));
  };

  const clearCompare = () => {
    setCompareItems([]);
    try {
      localStorage.removeItem('techcore_compare');
    } catch (e) {}
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
      setCompareItems,
      toggleCompare,
      addToCompare,
      removeFromCompare,
      clearCompare,
      compareMessage,
      setCompareMessage,
      isHydrated,
      builderSlots,
      setBuilderComponent,
      removeBuilderComponent,
      resetBuilder,
      user,
      token,
      loginUser,
      logoutUser,
      theme,
      toggleTheme
    }}>
      {children}
      {compareMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[9999] max-w-sm bg-slate-900/95 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span>{compareMessage}</span>
          </div>
          <button
            onClick={() => setCompareMessage('')}
            className="text-slate-400 hover:text-white transition-colors text-sm px-1 leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
    </ShopContext.Provider>
  );
}


export function useShop() {
  return useContext(ShopContext);
}
