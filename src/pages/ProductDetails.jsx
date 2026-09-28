import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Heart, Scale, Star, ArrowLeft, ChevronUp, ChevronDown
} from 'lucide-react';

export default function ProductDetails({ productId, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [paymentOption, setPaymentOption] = useState('cash'); // 'cash' | 'emi'
  const [activeTab, setActiveTab] = useState('specification'); // 'specification' | 'summary' | 'review'
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const { addToCart, wishlist, toggleWishlist, compareItems, toggleCompare } = useShop();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        if (data && (data.id || data._id || data.name)) {
          setProduct(data);
        } else {
          setProduct(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setProduct(null);
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    if (product) {
      try {
        const pId = product.id || product._id;
        const saved = JSON.parse(localStorage.getItem('techcore_recently_viewed') || '[]');
        const filtered = saved.filter(item => (item.id || item._id) !== pId);
        const updated = [product, ...filtered].slice(0, 5);
        localStorage.setItem('techcore_recently_viewed', JSON.stringify(updated));
        setRecentlyViewed(updated);
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem('techcore_recently_viewed') || '[]');
        setRecentlyViewed(saved);
      } catch (e) {}
    }
  }, [product]);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Product Details...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={() => onNavigate('products')}>
          Back to Store
        </button>
      </div>
    );
  }

  const pId = product.id || product._id;
  const isWishlisted = wishlist.some(p => (p.id === pId || p._id === pId));
  const isCompared = compareItems.some(p => (p.id === pId || p._id === pId));

  const priceNum = Number(product.price || 0);
  const discNum = product.discountPrice ? Number(product.discountPrice) : priceNum;

  // Images list handling
  const imageList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'];

  // Multiply thumbnails if single image to demonstrate gallery if needed
  const displayThumbnails = imageList.length === 1
    ? [imageList[0], imageList[0], imageList[0], imageList[0], imageList[0]]
    : imageList;

  // Calculate EMI price (approx 6 months)
  const emiMonthly = Math.round(priceNum / 6);
  const emiRegularTotal = Math.round(priceNum * 1.07);

  // Parse Key Features & Specification Categories from description if specifications is empty
  const parseProductSpecs = () => {
    const keyFeatures = [];
    const specGroups = {};
    let currentCategory = 'Display Features';

    const rawSpecs = product.specifications && Object.keys(product.specifications).length > 0
      ? product.specifications
      : null;

    if (rawSpecs) {
      specGroups['General Specifications'] = rawSpecs;
      Object.entries(rawSpecs).forEach(([k, v]) => {
        keyFeatures.push(`${k}: ${v}`);
      });
      return { keyFeatures: keyFeatures.slice(0, 5), specGroups };
    }

    const rawDesc = product.description || '';
    const lines = rawDesc.split('\n').map(l => l.trim()).filter(Boolean);

    lines.forEach(line => {
      if (line.includes(':') && !line.includes('\t') && keyFeatures.length < 5) {
        keyFeatures.push(line);
      }

      if (line.includes('\t')) {
        const [k, v] = line.split('\t');
        if (!specGroups[currentCategory]) specGroups[currentCategory] = {};
        specGroups[currentCategory][k.trim()] = v ? v.trim() : '';
      } else if (line.includes(':')) {
        const parts = line.split(':');
        const k = parts[0].trim();
        const v = parts.slice(1).join(':').trim();
        if (!specGroups[currentCategory]) specGroups[currentCategory] = {};
        specGroups[currentCategory][k] = v;
      } else {
        if (!['Model', 'Resolution', 'Display', 'Ports', 'Features'].some(h => line.startsWith(h))) {
          currentCategory = line.trim();
        }
      }
    });

    if (keyFeatures.length === 0) {
      keyFeatures.push(`Model: ${product.sku || product.name.split(' ')[0]}`);
      keyFeatures.push(`Brand: ${product.brand || 'TechCore'}`);
      keyFeatures.push(`Category: ${product.category || 'Hardware'}`);
      keyFeatures.push(`Warranty: ${product.warranty || 'Official Warranty'}`);
    }

    if (Object.keys(specGroups).length === 0) {
      specGroups['Specifications'] = {
        'Brand': product.brand || 'TechCore',
        'Model': product.sku || product.name,
        'Category': product.category,
        'Stock': product.stock > 0 ? `${product.stock} Units` : 'Out of Stock',
        'Warranty': product.warranty || 'Standard Warranty'
      };
    }

    return { keyFeatures, specGroups };
  };

  const { keyFeatures, specGroups } = parseProductSpecs();

  const handleBuyNow = () => {
    addToCart(product, qty);
    if (onNavigate) {
      onNavigate('checkout');
    }
  };

  const scrollToSpecs = () => {
    setActiveTab('specification');
    const el = document.getElementById('specifications-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: '#f2f4f8', minHeight: '100vh', padding: '1.5rem 0 3rem 0' }}>
      <div className="container">
        
        {/* Back Button */}
        <button
          onClick={() => onNavigate('products')}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '0.4rem 0.85rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#334155',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <ArrowLeft size={14} /> Back to Catalog
        </button>

        {/* TOP SECTION: Star Tech Style Product Showcase Card */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '1.75rem' }}>
          
          {/* 1. Product Title */}
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a2b4c', lineHeight: 1.35, marginBottom: '0.75rem' }}>
            {product.name}
          </h1>

          {/* 2. Status / Price Badges Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
            background: '#f8fafc',
            padding: '0.5rem 0.85rem',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.75rem',
            fontSize: '0.82rem',
            fontWeight: 700
          }}>
            <span style={{ background: '#e2e8f0', padding: '0.2rem 0.75rem', borderRadius: '16px', color: '#0f172a' }}>
              Price: <strong style={{ color: '#0f172a' }}>{discNum.toLocaleString()}৳</strong>
            </span>
            <span style={{ background: '#e2e8f0', padding: '0.2rem 0.75rem', borderRadius: '16px', color: '#0f172a' }}>
              Stock: <strong style={{ color: product.stock > 0 ? '#16a34a' : '#dc2626' }}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
            </span>
            <span style={{ background: '#e2e8f0', padding: '0.2rem 0.75rem', borderRadius: '16px', color: '#0f172a' }}>
              Brand: <strong style={{ color: '#d92d20' }}>{product.brand || 'ASUS'}</strong>
            </span>
            <span style={{ background: '#e2e8f0', padding: '0.2rem 0.75rem', borderRadius: '16px', color: '#0f172a' }}>
              Model: <strong style={{ color: '#0f172a' }}>{product.sku || 'VY229HF'}</strong>
            </span>
          </div>

          {/* 3. Main Grid: Left Image Gallery & Right Key Features/Payment */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 460px) 1fr', gap: '2.5rem', alignItems: 'start' }}>
            
            {/* Left Image Showcase */}
            <div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                
                {/* Vertical Thumbnails */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {displayThumbnails.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(idx % imageList.length)}
                      style={{
                        width: '54px',
                        height: '54px',
                        border: selectedImage === (idx % imageList.length) ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '3px',
                        cursor: 'pointer',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <img src={img} alt="thumb" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                  ))}
                </div>

                {/* Main Image Box */}
                <div style={{
                  flex: 1,
                  height: '350px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem'
                }}>
                  <img
                    src={imageList[selectedImage] || imageList[0]}
                    alt={product.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              </div>

              {/* Promo Banner Graphic Below Product Image */}
              <div style={{
                marginTop: '1.25rem',
                background: 'linear-gradient(90deg, #0b1120 0%, #1e1b4b 100%)',
                borderRadius: '8px',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: '#ea580c', color: '#fff', fontSize: '0.75rem', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    GAMING
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.03em' }}>
                    HELLHOUND AMD RADEON RX 5070
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#93c5fd', fontWeight: 700 }}>
                  MAKE EVERY PLAY COUNT
                </div>
              </div>

            </div>

            {/* Right Side: Key Features & Payment Options */}
            <div>
              
              {/* Key Features Header & List */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a2b4c', marginBottom: '0.6rem' }}>
                  Key Features
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', color: '#334155' }}>
                  {keyFeatures.map((feat, i) => (
                    <li key={i} style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={scrollToSpecs}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ea580c',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    marginTop: '0.6rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  View More Info
                </button>
              </div>

              {/* Payment Options Header & Cards */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a2b4c', marginBottom: '0.75rem' }}>
                  Payment Options
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  
                  {/* Cash Discount Option Card */}
                  <div
                    onClick={() => setPaymentOption('cash')}
                    style={{
                      border: paymentOption === 'cash' ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      background: paymentOption === 'cash' ? '#f0f7ff' : '#ffffff',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentOption === 'cash'}
                        onChange={() => setPaymentOption('cash')}
                        style={{ marginTop: '0.25rem', accentColor: '#3b82f6', width: '16px', height: '16px' }}
                      />
                      <div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
                          {discNum.toLocaleString()}৳
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginTop: '0.3rem' }}>
                          Cash Discount Price
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Online / Cash Payment
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly EMI Option Card */}
                  <div
                    onClick={() => setPaymentOption('emi')}
                    style={{
                      border: paymentOption === 'emi' ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      background: paymentOption === 'emi' ? '#f0f7ff' : '#ffffff',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentOption === 'emi'}
                        onChange={() => setPaymentOption('emi')}
                        style={{ marginTop: '0.25rem', accentColor: '#3b82f6', width: '16px', height: '16px' }}
                      />
                      <div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
                          {emiMonthly.toLocaleString()}৳/ month
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginTop: '0.3rem' }}>
                          Regular Price: {emiRegularTotal.toLocaleString()}৳
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          0% EMI for up to 6 Months***
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quantity Stepper & Buy Now Button Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                
                {/* Quantity Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  background: '#ffffff',
                  overflow: 'hidden'
                }}>
                  <input
                    type="text"
                    readOnly
                    value={qty}
                    style={{
                      width: '44px',
                      textAlign: 'center',
                      border: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: '#0f172a'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #cbd5e1' }}>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      style={{ background: '#f8fafc', border: 'none', padding: '0.2rem 0.5rem', color: '#334155', borderBottom: '1px solid #cbd5e1' }}
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      style={{ background: '#f8fafc', border: 'none', padding: '0.2rem 0.5rem', color: '#334155' }}
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>
                </div>

                {/* Buy Now Button (Solid Blue Pill) */}
                <button
                  onClick={handleBuyNow}
                  style={{
                    background: '#3749bb',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    padding: '0.75rem 2.5rem',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(55, 73, 187, 0.25)',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#3749bb'}
                >
                  Buy Now
                </button>

                {/* Action Icon Buttons */}
                <button
                  onClick={() => toggleWishlist(product)}
                  title="Wishlist"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Heart size={18} color={isWishlisted ? '#ea580c' : '#64748b'} fill={isWishlisted ? '#ea580c' : 'none'} />
                </button>

                <button
                  onClick={() => toggleCompare(product)}
                  title="Compare"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Scale size={18} color={isCompared ? '#0284c7' : '#64748b'} />
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: Specification Tabs & Recently Viewed Sidebar (Image 2) */}
        <div id="specifications-section" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left Column: Specs Tabs & Content Table */}
          <div>
            
            {/* Navigation Tabs Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <button
                onClick={() => setActiveTab('specification')}
                style={{
                  background: activeTab === 'specification' ? '#ea580c' : '#ffffff',
                  color: activeTab === 'specification' ? '#ffffff' : '#334155',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '6px',
                  border: activeTab === 'specification' ? 'none' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'specification' ? '0 2px 8px rgba(234, 88, 12, 0.25)' : 'none'
                }}
              >
                Specification
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                style={{
                  background: activeTab === 'summary' ? '#ea580c' : '#ffffff',
                  color: activeTab === 'summary' ? '#ffffff' : '#334155',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '6px',
                  border: activeTab === 'summary' ? 'none' : '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('review')}
                style={{
                  background: activeTab === 'review' ? '#ea580c' : '#ffffff',
                  color: activeTab === 'review' ? '#ffffff' : '#334155',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '6px',
                  border: activeTab === 'review' ? 'none' : '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                Review
              </button>
            </div>

            {/* Tab Body Card Container */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              
              {activeTab === 'specification' && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a2b4c', marginBottom: '1.25rem' }}>
                    Specification
                  </h2>

                  {Object.entries(specGroups).map(([groupTitle, specs]) => (
                    <div key={groupTitle} style={{ marginBottom: '1.5rem' }}>
                      <div style={{
                        background: '#f1f5f9',
                        color: '#ea580c',
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        padding: '0.6rem 1rem',
                        borderRadius: '4px',
                        marginBottom: '0.5rem'
                      }}>
                        {groupTitle}
                      </div>

                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <tbody>
                          {Object.entries(specs).map(([k, v]) => (
                            <tr key={k} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '0.65rem 1rem', width: '35%', color: '#0f172a', fontWeight: 700, verticalAlign: 'top' }}>
                                {k}
                              </td>
                              <td style={{ padding: '0.65rem 1rem', color: '#334155', fontWeight: 600 }}>
                                {String(v)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'summary' && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a2b4c', marginBottom: '1rem' }}>
                    Product Description & Summary
                  </h2>
                  <div style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#334155', whitespace: 'pre-line' }}>
                    {product.description || 'No additional summary provided.'}
                  </div>
                </div>
              )}

              {activeTab === 'review' && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a2b4c', marginBottom: '1rem' }}>
                    Customer Reviews ({product.reviewsCount || 0})
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ea580c' }}>
                      {product.rating || '5.0'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: 4, color: '#fbbf24' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={18} fill="#fbbf24" color="#fbbf24" />
                        ))}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Based on verified customer purchase experience
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Sidebar: Recently View (Image 2) */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb', textAlign: 'center', marginBottom: '1.25rem' }}>
              Recently View
            </h3>

            {recentlyViewed.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '1rem 0' }}>
                No recently viewed products yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {recentlyViewed.slice(0, 4).map(rp => {
                  const rpId = rp.id || rp._id;
                  const rpImg = Array.isArray(rp.images) && rp.images.length > 0 ? rp.images[0] : (rp.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop');
                  const rpPrice = rp.discountPrice || rp.price || 0;

                  return (
                    <div
                      key={rpId}
                      onClick={() => onNavigate(`product-detail:${rpId}`)}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center',
                        cursor: 'pointer',
                        paddingBottom: '0.85rem',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      <div style={{ width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, padding: '4px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={rpImg} alt={rp.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {rp.name}
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#d92d20', marginTop: '0.2rem' }}>
                          {Number(rpPrice).toLocaleString()}৳
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

