import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingCart, Heart, Scale, ShieldCheck, CheckCircle, Truck, Star, Cpu, ArrowLeft
} from 'lucide-react';

export default function ProductDetails({ productId, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
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
  const isWishlisted = wishlist.some(p => p.id === pId || p._id === pId);
  const isCompared = compareItems.some(p => p.id === pId || p._id === pId);

  const priceNum = Number(product.price || 0);
  const discNum = product.discountPrice ? Number(product.discountPrice) : priceNum;

  const mainImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop');

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <button className="btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => onNavigate('products')}>
        <ArrowLeft size={14} /> Back to Catalog
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>

        {/* Product Image Showcase */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <img
            src={mainImage}
            alt={product.name || 'Product Image'}
            style={{ width: '100%', maxHeight: '380px', objectFit: 'contain', borderRadius: 12 }}
          />
        </div>

        {/* Product Specs & Purchase Options */}
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-cyan)', textTransform: 'uppercase' }}>
            {product.brand} • {product.category}
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.3rem 0 0.75rem 0' }}>{product.name}</h1>

          {/* Rating & Review */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#fbbf24', fontWeight: 700 }}>
              <Star size={16} fill="#fbbf24" /> {product.rating} ({product.reviewsCount} reviews)
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--text-muted)' }}>SKU: <strong style={{ color: 'white' }}>{product.sku}</strong></span>
          </div>

          {/* Pricing Card */}
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>
                ৳{(product.discountPrice || product.price).toLocaleString()}
              </span>
              {product.discountPrice < product.price && (
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={16} color="#34d399" />
                <span>Stock: <strong>{product.stock > 0 ? `${product.stock} Units` : 'Out of Stock'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} color="var(--primary-cyan)" />
                <span>Warranty: <strong>{product.warranty}</strong></span>
              </div>
            </div>
          </div>

          {/* Quantity & Cart Action */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 8 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '0.6rem 1rem', background: 'none', color: 'white', fontWeight: 800 }}>-</button>
              <span style={{ padding: '0.6rem 1rem', fontWeight: 800 }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ padding: '0.6rem 1rem', background: 'none', color: 'white', fontWeight: 800 }}>+</button>
            </div>

            <button className="btn-primary" style={{ flex: 1, padding: '0.8rem', justifyContent: 'center' }} onClick={() => addToCart(product, qty)}>
              <ShoppingCart size={18} /> Add to Shopping Cart
            </button>

            <button className="btn-secondary" style={{ padding: '0.8rem' }} onClick={() => toggleWishlist(product)} title="Wishlist">
              <Heart size={18} color={isWishlisted ? 'var(--accent-amber)' : 'white'} fill={isWishlisted ? 'var(--accent-amber)' : 'none'} />
            </button>

            <button className="btn-secondary" style={{ padding: '0.8rem' }} onClick={() => toggleCompare(product)} title="Compare">
              <Scale size={18} color={isCompared ? 'var(--primary-cyan)' : 'white'} />
            </button>
          </div>

          {/* Technical Specifications Table */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'white' }}>Key Specifications</h3>
            <table className="spec-table">
              <tbody>
                {Object.entries(product.specifications || {}).map(([key, val]) => (
                  <tr key={key}>
                    <td style={{ fontWeight: 700, color: 'var(--text-muted)', width: '35%', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </td>
                    <td style={{ fontWeight: 600, color: 'white' }}>{String(val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <p><strong>Description:</strong> {product.description}</p>
          </div>

        </div>

      </div>
    </div>
  );
}
