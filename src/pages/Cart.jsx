import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Trash2, ArrowRight, Tag, ArrowLeft } from 'lucide-react';

export default function Cart({ onNavigate }) {
  const { cart, updateCartQty, removeFromCart, subtotal, coupon, applyCouponCode } = useShop();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCouponCode(couponInput);
    setCouponMessage(res);
  };

  const deliveryEst = subtotal > 0 ? 100 : 0;
  const grandTotal = Math.max(0, subtotal - coupon.discount + deliveryEst);

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: 500, margin: '0 auto' }}>
          <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h2>Your Cart is Currently Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem 0' }}>
            Explore our hardware catalog or build a PC to add components.
          </p>
          <button className="btn-primary" onClick={() => onNavigate('products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <button className="btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => onNavigate('products')}>
        <ArrowLeft size={14} /> Continue Shopping
      </button>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        Shopping <span className="gradient-text">Cart</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

        {/* Cart Table */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ paddingBottom: '0.75rem' }}>Product</th>
                <th style={{ paddingBottom: '0.75rem' }}>Price</th>
                <th style={{ paddingBottom: '0.75rem' }}>Quantity</th>
                <th style={{ paddingBottom: '0.75rem' }}>Total</th>
                <th style={{ paddingBottom: '0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={item.image} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</span>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '0.9rem' }}>৳{item.price.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 6 }}>
                      <button onClick={() => updateCartQty(item.id, -1)} style={{ padding: '0.3rem 0.6rem', background: 'none', color: 'white' }}>-</button>
                      <span style={{ padding: '0.3rem 0.6rem', fontSize: '0.88rem', fontWeight: 700 }}>{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.id, 1)} style={{ padding: '0.3rem 0.6rem', background: 'none', color: 'white' }}>+</button>
                    </div>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--primary-cyan)', fontSize: '0.95rem' }}>
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </td>
                  <td>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', color: '#f87171', padding: '0.4rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary & Coupon */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Order Summary
          </h3>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Apply Promo Coupon (Try: TECH10)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Enter TECH10"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                style={{ flex: 1, textTransform: 'uppercase' }}
              />
              <button type="submit" className="btn-secondary" style={{ padding: '0.5rem 0.85rem' }}>Apply</button>
            </div>
            {couponMessage && (
              <div style={{ fontSize: '0.78rem', marginTop: '0.4rem', color: couponMessage.success ? '#34d399' : '#f87171' }}>
                {couponMessage.message}
              </div>
            )}
          </form>

          {/* Summary Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
              <span style={{ fontWeight: 700 }}>৳{subtotal.toLocaleString()}</span>
            </div>
            {coupon.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                <span>Coupon Discount ({coupon.code}):</span>
                <span style={{ fontWeight: 700 }}>-৳{coupon.discount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery Fee:</span>
              <span style={{ fontWeight: 700 }}>৳{deliveryEst}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem' }}>
              <span style={{ fontWeight: 800 }}>Grand Total:</span>
              <span style={{ fontWeight: 800, color: 'var(--primary-cyan)' }}>৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }} onClick={() => onNavigate('checkout')}>
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
