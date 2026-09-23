import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag, Package, Truck, Clock, CheckCircle2, AlertCircle, ChevronRight,
  Printer, ArrowLeft, Search, FileText, UserCheck, ShieldCheck, CreditCard
} from 'lucide-react';

export default function MyOrders({ onNavigate }) {
  const { user } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // 1. Try fetching orders from localStorage first
    const localSavedOrders = (() => {
      try {
        return JSON.parse(localStorage.getItem('techcore_user_orders') || '[]');
      } catch (e) {
        return [];
      }
    })();

    // 2. Fetch from backend API
    const currentUserEmail = user?.email || user?.phoneOrEmail;
    if (currentUserEmail) {
      fetch('/api/orders')
        .then(res => {
          if (!res.ok) throw new Error('Backend order endpoint not found');
          return res.json();
        })
        .then(data => {
          const userOrders = Array.isArray(data)
            ? data.filter(o => (o.customer?.email || '').toLowerCase() === currentUserEmail.toLowerCase() || o.customer?.phone === currentUserEmail)
            : [];
          
          if (userOrders.length > 0) {
            setOrders(userOrders);
          } else if (localSavedOrders.length > 0) {
            setOrders(localSavedOrders);
          } else {
            setOrders(getDemoOrders(currentUserEmail));
          }
        })
        .catch(() => {
          if (localSavedOrders.length > 0) {
            setOrders(localSavedOrders);
          } else {
            setOrders(getDemoOrders(currentUserEmail));
          }
        })
        .finally(() => setLoading(false));
    } else {
      setOrders(localSavedOrders.length > 0 ? localSavedOrders : getDemoOrders('Guest'));
      setLoading(false);
    }
  }, [user]);

  // Demo order generator for rich UI demo
  function getDemoOrders(email) {
    return [
      {
        id: 'ORD-94821',
        createdAt: new Date().toISOString(),
        customer: {
          name: user?.name || 'Valued Customer',
          email: email || 'customer@gmail.com',
          phone: '01712345678',
          address: 'House 42, Road 11, Banani',
          city: 'Dhaka',
          zone: 'Dhaka Inside'
        },
        items: [
          {
            productId: 'p1',
            name: 'ASUS Dual GeForce RTX 4060 OC 8GB GDDR6',
            price: 37500,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'
          }
        ],
        subtotal: 37500,
        discount: 0,
        deliveryFee: 100,
        payableTotal: 37600,
        paymentMethod: 'bKash',
        paymentStatus: 'Paid (MFS)',
        orderStatus: 'Processing',
        estimatedDelivery: 'Tomorrow, 5:00 PM'
      }
    ];
  }

  // Filtered orders list
  const filteredOrders = orders.filter(ord => {
    const ordId = (ord.id || ord._id || '').toLowerCase();
    const matchesSearch = ordId.includes(searchQuery.toLowerCase()) ||
                          (ord.items || []).some(item => (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || ord.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: CheckCircle2, text: 'Delivered' };
      case 'Shipped':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', icon: Truck, text: 'Shipped' };
      case 'Processing':
      default:
        return { bg: '#fff7ed', color: '#ea580c', border: '#ffedd5', icon: Clock, text: 'Processing' };
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem 4rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Top Breadcrumb & User Info Header */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.75rem',
          marginBottom: '1.75rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff7ed', border: '2px solid #ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={28} color="#ea580c" />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase' }}>
                <ShieldCheck size={14} /> Customer Purchase Portal
              </div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0' }}>
                My Order <span style={{ color: '#ea580c' }}>History</span>
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                Logged in as: <strong>{user?.email || user?.phoneOrEmail || 'Guest Customer'}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => onNavigate('products')}
              style={{
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.65rem 1.25rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {[
              { id: 'ALL', label: `All Orders (${orders.length})` },
              { id: 'Processing', label: 'Processing' },
              { id: 'Shipped', label: 'Shipped' },
              { id: 'Delivered', label: 'Delivered' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  background: statusFilter === tab.id ? '#0f172a' : '#ffffff',
                  color: statusFilter === tab.id ? '#ffffff' : '#475569',
                  border: statusFilter === tab.id ? '1px solid #0f172a' : '1px solid #cbd5e1',
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <input
              type="text"
              placeholder="Search by Order ID or Item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 1rem 0.55rem 2.3rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none',
                background: '#ffffff'
              }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>

        </div>

        {/* Orders List Container */}
        {loading ? (
          <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '16px', textAlign: 'center', color: '#64748b' }}>
            Loading your order history...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
              <Package size={32} color="#ea580c" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>No Orders Found</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {searchQuery ? 'No orders match your search criteria.' : "You haven't placed any orders yet."}
            </p>
            <button
              onClick={() => onNavigate('products')}
              style={{ background: '#ea580c', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
            >
              Explore Tech Catalog
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredOrders.map((order, idx) => {
              const oId = order.id || order._id || `ORD-${idx}`;
              const badge = getStatusBadge(order.orderStatus || 'Processing');
              const BadgeIcon = badge.icon;
              const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently Placed';
              const orderTotal = Number(order.grandTotal ?? order.payableTotal ?? order.subtotal ?? 0);

              return (
                <div
                  key={oId}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Card Top Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                          Order #{oId}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <BadgeIcon size={13} /> {badge.text}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Placed on: <strong>{formattedDate}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ea580c' }}>
                        ৳{orderTotal.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                        Payment: <span style={{ color: '#0f172a', fontWeight: 800 }}>{order.paymentMethod || 'bKash'}</span> ({order.paymentStatus || 'Paid'})
                      </div>
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'}
                            alt=""
                            style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Qty: {item.quantity} x ৳{item.price.toLocaleString()}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Bottom Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Truck size={16} color="#ea580c" />
                      <span>Delivery Address: <strong>{order.customer?.address || 'Dhaka'}, {order.customer?.city || 'Dhaka'}</strong></span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                      <button
                        onClick={() => onNavigate('track-order')}
                        style={{
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          padding: '0.5rem 0.9rem',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Truck size={14} /> Track Order
                      </button>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          background: '#fff7ed',
                          color: '#ea580c',
                          border: '1px solid #ffedd5',
                          borderRadius: '8px',
                          padding: '0.5rem 0.9rem',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <FileText size={14} /> View Invoice
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Invoice Popover Modal */}
        {selectedOrder && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div
              id="printable-invoice-area"
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                maxWidth: '640px',
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '1px solid #e2e8f0',
                padding: '2.25rem'
              }}
            >
              
              {/* Modal Header (Close button hidden during print) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ea580c', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    TECH<span style={{ color: '#ea580c' }}>CORE</span> INVOICE
                  </h2>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Star Tech Official E-Receipt</div>
                </div>
                <button
                  className="no-print"
                  onClick={() => setSelectedOrder(null)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 34, height: 34, fontWeight: 800, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              {/* Order Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1.1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>Order Reference:</div>
                  <strong style={{ color: '#ea580c', fontSize: '1rem' }}>#{selectedOrder.id}</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>Customer Name:</div>
                  <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{selectedOrder.customer?.name}</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>Phone Number:</div>
                  <strong style={{ color: '#0f172a' }}>{selectedOrder.customer?.phone}</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>Payment Method:</div>
                  <strong style={{ color: '#0f172a' }}>{selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</strong>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 0.85rem', fontWeight: 800, color: '#0f172a' }}>Item Description</th>
                    <th style={{ padding: '0.75rem 0.85rem', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '0.75rem 0.85rem', fontWeight: 800, color: '#0f172a', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((it, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#0f172a' }}>{it.name}</td>
                      <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center', fontWeight: 600 }}>{it.quantity}</td>
                      <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>৳{(it.price * it.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>৳{(selectedOrder.subtotal || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Delivery Charge:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>৳{selectedOrder.deliveryFee || 100}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, color: '#ea580c', borderTop: '2px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <span>Total Amount Paid:</span>
                  <span>৳{(selectedOrder.payableTotal || selectedOrder.subtotal || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Print Action Buttons (Hidden when printing) */}
              <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <button
                  onClick={() => window.print()}
                  style={{ background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.92rem', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)' }}
                >
                  <Printer size={18} /> Print Memo
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
