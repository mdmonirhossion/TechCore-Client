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

        {/* Detailed Invoice Overlay Modal */}
        {selectedOrder && (() => {
          const oIdStr = selectedOrder.id || selectedOrder._id || 'INV-10045';
          const cust = selectedOrder.customer || {};
          const itemsList = Array.isArray(selectedOrder.items) ? selectedOrder.items : [];
          const sub = Number(selectedOrder.subtotal || 0);
          const disc = Number(selectedOrder.discount || 0);
          const del = Number(selectedOrder.deliveryFee || 100);
          const grand = Number(selectedOrder.grandTotal ?? selectedOrder.payableTotal ?? (sub - disc + del));

          return (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              overflowY: 'auto'
            }}>
              <div
                className="modal-card-container"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  maxWidth: '880px',
                  width: '100%',
                  maxHeight: '94vh',
                  overflowY: 'auto',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                  padding: '2rem 2.5rem',
                  position: 'relative'
                }}
              >
                {/* Modal Top Control Bar */}
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                    📄 Official Order Invoice Document
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => window.print()}
                      style={{
                        background: '#ea580c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.55rem 1.25rem',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Printer size={16} /> Print Memo
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      style={{ background: '#cbd5e1', color: '#0f172a', border: 'none', borderRadius: '6px', padding: '0.55rem 0.9rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Close ✕
                    </button>
                  </div>
                </div>

                {/* Standard Official Invoice Document (Matching Image 4) */}
                <div
                  id="printable-invoice-area"
                  className="standard-invoice-paper"
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '2.5rem',
                    fontFamily: "'Urbanist', sans-serif"
                  }}
                >
                  {/* Invoice Top Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #ea580c', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                        <Cpu size={32} color="#ea580c" />
                        <span>TECH<span style={{ color: '#ea580c' }}>CORE</span></span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 600 }}>
                        Bangladesh's Premier Computer & Electronics Store
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span>28 Kazi Nazrul Islam Ave, Dhaka 1215</span>
                        <span>Hotline: 09678002003 / 16793 | support@techcore.com.bd</span>
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.25rem', minWidth: '220px', textAlign: 'right' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ea580c', letterSpacing: '0.05em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                        INVOICE
                      </h2>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                        Invoice No : <span style={{ color: '#0f172a' }}>#{oIdStr}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Date : {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Payment : <span style={{ fontWeight: 700, color: '#ea580c' }}>{selectedOrder.paymentMethod || 'bKash'}</span> ({selectedOrder.paymentStatus || 'Paid'})
                      </div>
                    </div>
                  </div>

                  {/* Billed To & Shipping Address */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.75rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                        BILL TO
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{cust.name || 'Valued Customer'}</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>Phone: {cust.phone || 'N/A'}</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>Email: {cust.email || 'N/A'}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                        SHIPPING ADDRESS
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{cust.address || 'Dhaka'}</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>{cust.city || 'Dhaka'} ({cust.zone || 'Dhaka Inside'})</div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.75rem' }}>
                    <thead>
                      <tr style={{ background: '#ea580c', color: '#ffffff' }}>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, width: '50px' }}>NO</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 800 }}>PRODUCT DESCRIPTION</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 800, width: '120px' }}>UNIT PRICE</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, width: '70px' }}>QTY</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 800, width: '130px' }}>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsList.map((item, idx) => {
                        const itemPrice = Number(item.price || 0);
                        const itemQty = Number(item.quantity || 1);
                        return (
                          <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>
                              {String(idx + 1).padStart(2, '0')}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                              {item.name}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.88rem', color: '#334155' }}>
                              ৳{itemPrice.toLocaleString()}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                              {itemQty}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: 800, color: '#ea580c' }}>
                              ৳{(itemPrice * itemQty).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Totals & Signature Section */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      <div style={{ fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', marginBottom: '0.3rem', fontSize: '0.75rem' }}>
                        TERMS & WARRANTY POLICY
                      </div>
                      <p style={{ lineHeight: 1.4, marginBottom: '1.5rem' }}>
                        All hardware carries official manufacturer warranty. Please preserve this invoice for claim & support services within 7 days replacement period.
                      </p>

                      <div style={{ marginTop: '2rem', display: 'inline-block', textAlign: 'center' }}>
                        <div style={{ borderBottom: '1px solid #cbd5e1', width: '160px', marginBottom: '0.3rem' }}></div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Authorized Signature</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', color: '#475569' }}>
                        <span>Sub Total:</span>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>৳{sub.toLocaleString()}</span>
                      </div>

                      {disc > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', color: '#16a34a' }}>
                          <span>Discount:</span>
                          <span style={{ fontWeight: 700 }}>-৳{disc.toLocaleString()}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', color: '#475569' }}>
                        <span>Delivery Fee:</span>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>৳{del}</span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          background: '#ea580c',
                          color: '#ffffff',
                          padding: '0.75rem 1rem',
                          borderRadius: '6px',
                          fontWeight: 900,
                          fontSize: '1.1rem',
                          marginTop: '0.4rem',
                          boxShadow: '0 4px 12px rgba(234, 88, 12, 0.2)'
                        }}
                      >
                        <span>Grand Total:</span>
                        <span>৳{grand.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Footer Banner */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ea580c', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      THANK YOU FOR YOUR BUSINESS
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      TechCore Bangladesh | Complete Computer & Electronics Store
                    </div>
                  </div>

                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
