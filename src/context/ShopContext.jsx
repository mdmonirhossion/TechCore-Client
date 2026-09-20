import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // 1. Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('techcore_cart');
    return saved ? JSON.parse(saved) : [
      { id: 'prod-301', name: 'ASUS Dual GeForce RTX 4060 OC 8GB GDDR6', price: 39999, quantity: 1, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop' }
    ];
  });
  const [coupon, setCoupon] = useState({ code: '', discount: 0 });

  // 2. Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('techcore_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

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
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('techcore_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist localstorage
  useEffect(() => {
    localStorage.setItem('techcore_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('techcore_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('techcore_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('techcore_user');
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
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        quantity: qty,
        image: product.images[0]
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
    if (code.toUpperCase() === 'TECH10') {
      const sub = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const disc = Math.round(sub * 0.10);
      setCoupon({ code: 'TECH10', discount: disc });
      return { success: true, message: '10% Coupon Discount Applied!' };
    }
    return { success: false, message: 'Invalid Coupon Code. Try TECH10' };
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Compare Functions
  const toggleCompare = (product) => {
    setCompareItems(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 products at a time.');
        return prev;
      }
      return [...prev, product];
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
