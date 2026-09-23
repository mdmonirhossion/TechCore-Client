import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // Helper to safely parse localstorage
  const safeStorageParse = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
      return fallback;
    }
  };

  // 1. Cart State
  const [cart, setCart] = useState(() => safeStorageParse('techcore_cart', [
    { id: 'prod-301', name: 'ASUS Dual GeForce RTX 4060 OC 8GB GDDR6', price: 39999, quantity: 1, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop' }
  ]));
  const [coupon, setCoupon] = useState({ code: '', discount: 0 });

  // 2. Wishlist State
  const [wishlist, setWishlist] = useState(() => safeStorageParse('techcore_wishlist', []));

  // 3. Compare State
  const [compareItems, setCompareItems] = useState([]);

  // 4. PC Builder State (12 slots)
  const [builderSlots, setBuilderSlots] = useState({
    CPU: null,
    'CPU Cooler': null,
    Motherboard: null,
    RAM: null,
    GPU: null,
    SSD: null,
    HDD: null,
    PSU: null,
    Casing: null,
    Monitor: null,
    Keyboard: null,
    Mouse: null
  });

  // 5. User Auth State
  const [user, setUser] = useState(() => safeStorageParse('techcore_user', null));

  // Persist localstorage
  useEffect(() => {
    try {
      localStorage.setItem('techcore_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('techcore_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist to localStorage:', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('techcore_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('techcore_user');
      }
    } catch (e) {
      console.error('Error saving user to localStorage:', e);
    }
  }, [user]);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
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
  };

  const applyCouponCode = (code) => {
    if ((code || '').toUpperCase() === 'TECH10') {
      const sub = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const disc = Math.round(sub * 0.10);
      setCoupon({ code: 'TECH10', discount: disc });
      return { success: true, message: '10% Coupon Discount Applied!' };
    }
    return { success: false, message: 'Invalid Coupon Code. Try TECH10' };
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
