import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingCart, Heart, Scale, Star, ShieldCheck } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart, wishlist, toggleWishlist, compareItems, toggleCompare } = useShop();

  if (!product) return null;

  const pId = product.id || product._id;
  const isWishlisted = wishlist.some(p => p.id === pId || p._id === pId);
  const isCompared = compareItems.some(p => p.id === pId || p._id === pId);

  const priceNum = Number(product.price || 0);
  const discNum = product.discountPrice ? Number(product.discountPrice) : priceNum;

  const savedAmount = priceNum > discNum ? (priceNum - discNum) : 0;
  const discountPercent = priceNum > discNum
    ? Math.round(((priceNum - discNum) / priceNum) * 100)
    : 0;

  const imgUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop');

  return (
    <div
      className="product-card"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        position: 'relative'
      }}
    >
      {/* Top Purple Pill Badge (Star Tech Style) */}
      {savedAmount > 0 ? (
        <span
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 5,
            background: '#6b21a8',
            color: '#ffffff',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '0.25rem 0.65rem',
            borderRadius: '12px',
            letterSpacing: '0.02em',
            boxShadow: '0 2px 6px rgba(107, 33, 168, 0.3)'
          }}
        >
          Save: {savedAmount.toLocaleString()}৳ (-{discountPercent}%)
        </span>
      ) : (
        <span
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 5,
            background: '#6b21a8',
            color: '#ffffff',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '0.25rem 0.65rem',
            borderRadius: '12px'
          }}
        >
          Earn Point: {Math.round(priceNum / 100)}
        </span>
      )}

      {/* Product Image Box */}
      <div
        onClick={() => onSelectProduct(pId)}
        style={{
          width: '100%',
          height: '200px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <img
          src={imgUrl}
          alt={product.name || 'Product Image'}
          loading="lazy"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease'
          }}
        />

        {/* Official Warranty Badge Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#0369a1',
            background: 'rgba(240, 249, 255, 0.95)',
            padding: '0.15rem 0.4rem',
            borderRadius: '4px',
            border: '1px solid #bae6fd'
          }}
        >
          <ShieldCheck size={11} color="#0284c7" /> OFFICIAL WARRANTY
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, borderTop: '1px solid #f1f5f9' }}>
        
        {/* Brand & Rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
            {product.brand || 'TechCore'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', color: '#eab308', fontWeight: 700 }}>
            <Star size={12} fill="#eab308" color="#eab308" /> {product.rating || '5.0'}
          </div>
        </div>

        {/* Product Title (2 lines clamp) */}
        <h3
          onClick={() => onSelectProduct(pId)}
          style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.35,
            cursor: 'pointer',
            margin: '0.2rem 0 0.8rem 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7em'
          }}
        >
          {product.name}
        </h3>

        {/* Pricing (Star Tech Style Red Price) */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d92d20' }}>
            {discNum.toLocaleString()}৳
          </span>
          {discNum < priceNum && (
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
              {priceNum.toLocaleString()}৳
            </span>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
          <button
            className="btn-primary"
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '0.82rem',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              border: 'none',
              borderRadius: '8px'
            }}
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
          >
            <ShoppingCart size={15} /> Buy Now
          </button>

          <button
            className="btn-secondary"
            style={{ padding: '0.5rem', borderColor: isWishlisted ? '#ea580c' : '#cbd5e1' }}
            onClick={() => toggleWishlist(product)}
            title="Wishlist"
          >
            <Heart size={15} color={isWishlisted ? '#ea580c' : '#475569'} fill={isWishlisted ? '#ea580c' : 'none'} />
          </button>

          <button
            className="btn-secondary"
            style={{ padding: '0.5rem', borderColor: isCompared ? '#0284c7' : '#cbd5e1' }}
            onClick={() => toggleCompare(product)}
            title="Compare Product"
          >
            <Scale size={15} color={isCompared ? '#0284c7' : '#475569'} />
          </button>
        </div>

      </div>

    </div>
  );
}
