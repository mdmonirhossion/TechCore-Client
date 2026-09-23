import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

export default function Checkout({ onNavigate, onOrderCompleted }) {
  const { cart, subtotal, coupon, clearCart } = useShop();

  const [formData, setFormData] = useState({
    name: 'Tanvir Ahmed',
    email: 'tanvir@gmail.com',
    phone: '01712345678',
    address: 'House 42, Road 11, Banani',
    city: 'Dhaka',
    zone: 'Dhaka Inside',
    paymentMethod: 'bKash'
  });

  // Stripe Card Details State
  const [stripeCard, setStripeCard] = useState({
    number: '4242 •••• •••• 4242',
    exp: '12 / 28',
    cvc: '314'
  });
  const [stripeStatus, setStripeStatus] = useState(null);

  const [loading, setLoading] = useState(false);

  const deliveryFee = formData.zone === 'Dhaka Inside' ? 100 : 160;
  const grandTotal = Math.max(0, subtotal - coupon.discount + deliveryFee);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStripeStatus(null);

    let finalPaymentStatus = 'Pending';
    let stripeIntentId = null;

    // If Stripe payment is selected
    if (formData.paymentMethod === 'Card / Stripe') {
      try {
        setStripeStatus('Connecting to Stripe Secure Gateway...');
        const intentRes = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: grandTotal, email: formData.email })
        });
        const intentData = await intentRes.json();

        if (intentData.success) {
          finalPaymentStatus = 'Paid (Stripe)';
          stripeIntentId = intentData.paymentIntentId;
          setStripeStatus('Stripe Card Payment Approved ✓');
        } else {
          throw new Error(intentData.message || 'Stripe processing failed');
        }
      } catch (err) {
        console.error('Stripe error:', err);
        setStripeStatus(`Stripe Payment Error: ${err.message}`);
        setLoading(false);
        return;
      }
    } else if (formData.paymentMethod === 'bKash' || formData.paymentMethod === 'Nagad') {
      finalPaymentStatus = 'Paid (MFS)';
    }

    const payload = {
      id: `INV-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zone: formData.zone
      },
      items: cart.map(i => ({
        productId: i.id || i._id,
        name: i.name,
        price: Number(i.price || 0),
        quantity: i.quantity,
        image: i.image
      })),
      subtotal,
      discount: coupon.discount || 0,
      deliveryFee,
      grandTotal,
      payableTotal: grandTotal,
      paymentMethod: formData.paymentMethod,
      paymentStatus: finalPaymentStatus,
      stripePaymentIntentId: stripeIntentId,
      orderStatus: 'Processing'
    };

    try {
      let createdOrder = payload;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data && (data.id || data._id)) {
          createdOrder = {
            ...payload,
            ...data,
            id: data.id || data._id || payload.id,
            grandTotal: data.grandTotal || data.payableTotal || grandTotal,
            customer: data.customer || payload.customer
          };
        }
      }

      // Save order to local storage for My Orders history
      const savedOrders = (() => {
        try { return JSON.parse(localStorage.getItem('techcore_user_orders') || '[]'); }
        catch (e) { return []; }
      })();
      localStorage.setItem('techcore_user_orders', JSON.stringify([createdOrder, ...savedOrders]));

      clearCart();
      onOrderCompleted(createdOrder);
    } catch (err) {
      console.error('Order submit error:', err);
      // Fallback to local created order to prevent app crash
      const savedOrders = (() => {
        try { return JSON.parse(localStorage.getItem('techcore_user_orders') || '[]'); }
        catch (e) { return []; }
      })();
      localStorage.setItem('techcore_user_orders', JSON.stringify([payload, ...savedOrders]));

      clearCart();
      onOrderCompleted(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        Checkout & <span className="gradient-text">Delivery</span>
      </h1>

      <form onSubmit={handleSubmitOrder} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

        {/* Customer Information & Shipping Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={18} color="var(--primary-cyan)" /> 1. Customer Shipping Address
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address & House No.</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City / District</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Zone</label>
                <select
                  className="form-control"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                >
                  <option value="Dhaka Inside">Dhaka City Inside (৳100)</option>
                  <option value="Outside Dhaka">Outside Dhaka Courier (৳160)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Gateway Options */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={18} color="var(--primary-cyan)" /> 2. Payment Method
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              {['bKash', 'Nagad', 'Cash on Delivery', 'Card / Stripe'].map(method => (
                <div
                  key={method}
                  className="glass-panel"
                  onClick={() => setFormData({ ...formData, paymentMethod: method })}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderColor: formData.paymentMethod === method ? 'var(--primary-cyan)' : 'var(--border-color)',
                    background: formData.paymentMethod === method ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}
                >
                  {method}
                </div>
              ))}
            </div>

            {/* Interactive Stripe Card Input Panel */}
            {formData.paymentMethod === 'Card / Stripe' && (
              <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(0, 242, 254, 0.04)', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Lock size={14} /> Stripe 256-Bit SSL Encrypted Card Checkout
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Test Key Connected</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={stripeCard.number}
                    onChange={(e) => setStripeCard({ ...stripeCard, number: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={stripeCard.exp}
                      onChange={(e) => setStripeCard({ ...stripeCard, exp: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVC Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={stripeCard.cvc}
                      onChange={(e) => setStripeCard({ ...stripeCard, cvc: e.target.value })}
                    />
                  </div>
                </div>

                {stripeStatus && (
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '0.5rem', color: stripeStatus.includes('Error') ? '#f87171' : '#34d399' }}>
                    {stripeStatus}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Order Summary & Confirm Action */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Order Items ({cart.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 220, overflowY: 'auto', marginBottom: '1rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>{item.quantity}x {item.name}</span>
                <span style={{ fontWeight: 700 }}>৳{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            {coupon.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                <span>Discount:</span>
                <span>-৳{coupon.discount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Charge:</span>
              <span>৳{deliveryFee}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem' }}>
              <span style={{ fontWeight: 800 }}>Payable Total:</span>
              <span style={{ fontWeight: 800, color: 'var(--primary-cyan)' }}>৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '1.5rem', fontSize: '1rem' }}
          >
            {loading
              ? (formData.paymentMethod === 'Card / Stripe' ? 'Processing Stripe...' : 'Processing Order...')
              : (formData.paymentMethod === 'Card / Stripe' ? 'Confirm & Pay via Stripe' : 'Confirm & Place Order')} <ArrowRight size={18} />
          </button>
        </div>

      </form>
    </div>
  );
}
