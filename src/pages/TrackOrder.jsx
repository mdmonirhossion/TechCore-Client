import React, { useState } from 'react';
import { Package, Search, Clock, CheckCircle2, Truck, Check } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('INV-10045');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId.trim().toUpperCase()}`);
      if (!res.ok) throw new Error('Order ID not found');
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError('Order not found. Try INV-10045 or check your invoice ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const stages = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'];

  const getCurrentStepIndex = (currentStatus) => {
    return stages.indexOf(currentStatus || 'Pending');
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: 800 }}>

      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
          Track Your <span className="gradient-text">Order</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
          Enter your Invoice ID (e.g., INV-10045) to view live courier and packaging status.
        </p>

        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.5rem', maxWidth: 460, margin: '1.5rem auto 0 auto' }}>
          <input
            type="text"
            className="form-control"
            placeholder="INV-10045"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={{ textTransform: 'uppercase' }}
          />
          <button type="submit" className="btn-primary">
            <Search size={16} /> Track Status
          </button>
        </form>
      </div>

      {loading && <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Fetching live tracking info...</div>}
      {error && <div className="alert-box alert-danger" style={{ maxWidth: 460, margin: '0 auto' }}>{error}</div>}

      {order && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>#{order.id}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Recipient: {order.customer.name} ({order.customer.phone})</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Destination: {order.customer.zone}</div>
              <div style={{ fontWeight: 700, color: '#34d399' }}>Total: ৳{order.grandTotal.toLocaleString()}</div>
            </div>
          </div>

          {/* Progress Bar Timeline */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '2.5rem' }}>
            {stages.map((stg, idx) => {
              const currentIdx = getCurrentStepIndex(order.orderStatus);
              const isPassed = idx <= currentIdx;
              return (
                <div key={stg} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: isPassed ? 'var(--primary-cyan)' : '#1c2636',
                      color: isPassed ? 'black' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      margin: '0 auto 0.5rem auto'
                    }}
                  >
                    {isPassed ? <Check size={16} /> : idx + 1}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: isPassed ? 700 : 500, color: isPassed ? 'white' : 'var(--text-muted)' }}>
                    {stg}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline Logs */}
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>Status History</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {order.trackingHistory.map((h, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem' }}>
                <Clock size={16} color="var(--primary-cyan)" />
                <span style={{ fontWeight: 700, color: 'white' }}>{h.status}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>- {h.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
