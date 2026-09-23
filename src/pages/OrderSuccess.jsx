import React from 'react';
import { CheckCircle, Printer, Package, Cpu, Phone, Mail, MapPin } from 'lucide-react';

export default function OrderSuccess({ order, onNavigate }) {
  if (!order || (!order.id && !order._id && !order.customer)) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>No Order Information Found</h2>
        <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={() => onNavigate('home')}>
          Return Home
        </button>
      </div>
    );
  }

  const orderIdStr = order.id || order._id || 'INV-SUCCESS';
  const customerObj = order.customer || {};
  const orderItems = Array.isArray(order.items) ? order.items : [];

  const subtotalNum = Number(order.subtotal || 0);
  const discountNum = Number(order.discount || 0);
  const deliveryNum = Number(order.deliveryFee || 0);
  const grandTotalNum = Number(
    order.grandTotal ?? order.payableTotal ?? order.totalAmount ?? (subtotalNum - discountNum + deliveryNum)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: 880 }}>

      {/* Screen-Only Order Confirmation Message (Hidden on Print / Image 2 requirement) */}
      <div className="no-print glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem', background: '#ffffff', border: '1px solid var(--border-color)' }}>
        <CheckCircle size={56} color="#10b981" style={{ marginBottom: '0.75rem' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          Order Confirmed & Placed!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Thank you for shopping with TechCore. Your Invoice number is <strong style={{ color: 'var(--primary-blue)' }}>#{orderIdStr}</strong>.
        </p>
      </div>

      {/* Screen-Only Action Buttons (Hidden on Print) */}
      <div className="no-print" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <button className="btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' }} onClick={handlePrint}>
          <Printer size={18} /> Print Official Invoice
        </button>
        <button className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }} onClick={() => onNavigate('track-order')}>
          <Package size={18} /> Track Order Progress
        </button>
      </div>

      {/* Standard Official Invoice Document (Matching Image 4) */}
      <div
        className="standard-invoice-paper"
        style={{
          background: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '2.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
          fontFamily: "'Urbanist', sans-serif"
        }}
      >
        {/* Invoice Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #ea580c', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          
          {/* Company Brand info */}
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

          {/* Invoice Meta Box (Top Right - Image 4) */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.25rem', minWidth: '220px', textAlign: 'right' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ea580c', letterSpacing: '0.05em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              INVOICE
            </h2>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
              Invoice No : <span style={{ color: '#0f172a' }}>#{orderIdStr}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
              Date : {order.createdAt || new Date().toLocaleDateString('en-GB')}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
              Payment : <span style={{ fontWeight: 700, color: '#ea580c' }}>{order.paymentMethod || 'bKash'}</span> ({order.paymentStatus || 'Paid'})
            </div>
          </div>

        </div>

        {/* Billed To & Shipping Address */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.75rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              BILL TO
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{customerObj.name || 'Valued Customer'}</div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>Phone: {customerObj.phone || 'N/A'}</div>
            <div style={{ fontSize: '0.85rem', color: '#475569' }}>Email: {customerObj.email || 'N/A'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              SHIPPING ADDRESS
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{customerObj.address || 'Dhaka'}</div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>{customerObj.city || 'Dhaka'} ({customerObj.zone || 'Dhaka Inside'})</div>
          </div>
        </div>

        {/* Items Table (Image 4 Styled) */}
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
            {orderItems.map((item, idx) => {
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

        {/* Totals & Signature Section (Image 4 Layout) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
          
          {/* Terms & Signature */}
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

          {/* Right Totals Summary (Image 4 Styled) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', color: '#475569' }}>
              <span>Sub Total:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>৳{subtotalNum.toLocaleString()}</span>
            </div>

            {discountNum > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', color: '#16a34a' }}>
                <span>Discount:</span>
                <span style={{ fontWeight: 700 }}>-৳{discountNum.toLocaleString()}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', color: '#475569' }}>
              <span>Delivery Fee:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>৳{deliveryNum}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justify: 'space-between',
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
              <span>৳{grandTotalNum.toLocaleString()}</span>
            </div>
          </div>

        </div>

        {/* Invoice Footer Banner (Image 4) */}
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
  );
}
