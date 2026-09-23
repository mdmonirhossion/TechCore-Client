import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Cpu, Tv, Grid, HardDrive, Zap, Database, Monitor, Wind, Box, Headphones,
  CheckCircle, AlertTriangle, Printer, ShoppingCart, RefreshCw, Sparkles, Plus, Trash2, FileText, X
} from 'lucide-react';

const BUILD_CATEGORIES = [
  { key: 'CPU', name: 'Processor', slug: 'processor', icon: Cpu },
  { key: 'CPU Cooler', name: 'CPU Cooler', slug: 'cpu-cooler', icon: Wind },
  { key: 'Motherboard', name: 'Motherboard', slug: 'motherboard', icon: Grid },
  { key: 'RAM', name: 'RAM (Memory)', slug: 'ram', icon: HardDrive },
  { key: 'GPU', name: 'Graphics Card', slug: 'gpu', icon: Tv },
  { key: 'SSD', name: 'Storage (SSD)', slug: 'storage', icon: Database },
  { key: 'HDD', name: 'Storage (HDD)', slug: 'storage', icon: Database },
  { key: 'PSU', name: 'Power Supply', slug: 'power-supply', icon: Zap },
  { key: 'Casing', name: 'Casing', slug: 'casing', icon: Box },
  { key: 'Monitor', name: 'Monitor', slug: 'monitor', icon: Monitor },
  { key: 'Keyboard', name: 'Keyboard', slug: 'accessories', icon: Headphones },
  { key: 'Mouse', name: 'Mouse', slug: 'accessories', icon: Headphones }
];

export default function PCBuilder({ onNavigate }) {
  const { builderSlots, setBuilderComponent, removeBuilderComponent, resetBuilder, addToCart, user } = useShop();
  const [activePickerCategory, setActivePickerCategory] = useState(null);
  const [pickerProducts, setPickerProducts] = useState([]);
  const [loadingPicker, setLoadingPicker] = useState(false);
  const [compatibility, setCompatibility] = useState(null);

  // Invoice Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  // Invoice Editable Customer Details
  const [invoiceCustomer, setInvoiceCustomer] = useState({
    name: user?.name || '',
    company: 'N/A',
    address: 'Jessore, Sadar',
    city: 'Jessore',
    phone: user?.phoneOrEmail || '',
    branch: '',
    invoiceNo: '',
    date: '',
    paymentMethod: ''
  });

  // AI Prompt Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiBudget, setAiBudget] = useState(90000);
  const [aiUseCase, setAiUseCase] = useState('Gaming & Video Editing');
  const [aiLoading, setAiLoading] = useState(false);

  // Trigger compatibility check whenever builder slots change
  useEffect(() => {
    fetch('/api/builder/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedComponents: builderSlots })
    })
      .then(res => res.json())
      .then(data => setCompatibility(data))
      .catch(err => console.error(err));
  }, [builderSlots]);

  const handleOpenPicker = (catObj) => {
    setActivePickerCategory(catObj);
    setLoadingPicker(true);

    fetch(`/api/products?category=${catObj.slug}`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.products || data.data || []);
        setPickerProducts(list);
        setLoadingPicker(false);
      })
      .catch(err => {
        console.error(err);
        setPickerProducts([]);
        setLoadingPicker(false);
      });
  };

  const handleSelectProductForSlot = (product) => {
    if (activePickerCategory) {
      setBuilderComponent(activePickerCategory.key, product);
      setActivePickerCategory(null);
    }
  };

  const calculateTotalCost = () => {
    return Object.values(builderSlots).reduce((sum, item) => {
      return sum + (item ? (item.discountPrice || item.price) : 0);
    }, 0);
  };

  const handleAddAllToCart = () => {
    let count = 0;
    Object.values(builderSlots).forEach(item => {
      if (item) {
        addToCart(item, 1);
        count++;
      }
    });
    if (count > 0) {
      alert(`Added ${count} PC components to your cart!`);
      onNavigate('cart');
    }
  };

  const handleRunAiRecommendation = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/recommend-pc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: aiBudget, useCase: aiUseCase })
      });
      const data = await res.json();
      if (data.build) {
        if (data.build.cpu) setBuilderComponent('CPU', data.build.cpu);
        if (data.build.motherboard) setBuilderComponent('Motherboard', data.build.motherboard);
        if (data.build.ram) setBuilderComponent('RAM', data.build.ram);
        if (data.build.gpu) setBuilderComponent('GPU', data.build.gpu);
        if (data.build.psu) setBuilderComponent('PSU', data.build.psu);
      }
      setShowAiModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const totalCost = calculateTotalCost();

  // Get array of selected components for invoice listing
  const selectedComponentList = Object.entries(builderSlots)
    .filter(([key, item]) => item !== null)
    .map(([key, item]) => ({
      categoryKey: key,
      name: item.name,
      price: item.discountPrice || item.price,
      warranty: item.warranty || '3 Years Warranty',
      qty: 1
    }));

  // Fallback demo build list matching image if user hasn't selected components yet
  const invoiceItemsList = selectedComponentList.length > 0 ? selectedComponentList : [
    { categoryKey: 'RAM', name: 'Adata 8GB DDR4 1600 Bus Desktop Ram, Adata Years - 21/11/2025', qty: 2, price: 1800 },
    { categoryKey: 'Motherboard', name: 'Esonic H81, 0274, 3 Years- 21/11/2026', qty: 1, price: 5500 },
    { categoryKey: 'Processor', name: 'Intel Core i5-4500 3.2 GHz Processor, 0430 No Warranty', qty: 1, price: 4800 },
    { categoryKey: 'SSD', name: 'KingSpace 128 GB NVME SSD, 1290, KingSpace 4 Years- 21/11/27', qty: 1, price: 2000 },
    { categoryKey: 'PSU', name: 'POWER SUPPLY OVO 550W, Long Cable 3 Years- 21/11/2026', qty: 1, price: 3500 },
    { categoryKey: 'Casing', name: 'Gamdias AURA ARGB Gaming Casing', qty: 1, price: 5200 },
    { categoryKey: 'Mouse', name: 'Aula Gaming Mouse S31, 2 Years- 21/11/2025', qty: 1, price: 1200 },
    { categoryKey: 'Keyboard', name: 'FAST KEY Desktop Keyboard 0720', qty: 1, price: 450 },
    { categoryKey: 'Monitor', name: 'GIGASONIC 19 Inch HD LED Monitor 2 Years- 21/11/2025', qty: 1, price: 5100 },
    { categoryKey: 'Accessories', name: 'HDMI Cable', qty: 1, price: 350 },
    { categoryKey: 'Accessories', name: 'Mouse Pad', qty: 1, price: 120 }
  ];

  const invoiceTotalSum = invoiceItemsList.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>

      {/* Header & Controls */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-cyan)', textTransform: 'uppercase' }}>
            Hardware Configuration Engine
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Custom <span className="gradient-text">PC Builder</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" style={{ border: '1px solid var(--primary-cyan)' }} onClick={() => setShowAiModal(true)}>
            <Sparkles size={16} color="var(--primary-cyan)" /> AI PC Assistant
          </button>
          <button className="btn-secondary" onClick={resetBuilder}>
            <RefreshCw size={15} /> Reset
          </button>
          <button
            style={{
              background: '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.1rem',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
            }}
            onClick={() => setShowInvoiceModal(true)}
          >
            <FileText size={16} /> View Official PC Invoice
          </button>
          <button className="btn-primary" onClick={handleAddAllToCart} disabled={totalCost === 0}>
            <ShoppingCart size={16} /> Add All To Cart (৳{totalCost.toLocaleString()})
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

        {/* 12 Component Slots List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {BUILD_CATEGORIES.map(cat => {
            const selectedItem = builderSlots[cat.key];
            const IconComp = cat.icon;

            return (
              <div
                key={cat.key}
                className="glass-panel"
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderColor: selectedItem ? 'rgba(0, 242, 254, 0.4)' : 'var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComp size={22} color="var(--primary-cyan)" />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {cat.name}
                    </div>

                    {selectedItem ? (
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#0f172a' }}>
                        {selectedItem.name}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        Select Component
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {selectedItem ? (
                    <>
                      <span style={{ fontWeight: 800, color: '#ea580c', fontSize: '0.95rem' }}>
                        ৳{(selectedItem.discountPrice || selectedItem.price).toLocaleString()}
                      </span>
                      <button onClick={() => removeBuilderComponent(cat.key)} style={{ background: 'none', color: '#f87171', padding: '0.4rem' }}>
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <button className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }} onClick={() => handleOpenPicker(cat)}>
                      <Plus size={14} /> Choose Component
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Hardware Compatibility & Power Calculation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Total Summary Box */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Build Summary</h3>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ea580c', marginBottom: '1rem' }}>
              ৳{totalCost.toLocaleString()} BDT
            </div>

            <button
              onClick={() => setShowInvoiceModal(true)}
              style={{
                width: '100%',
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                marginBottom: '1rem'
              }}
            >
              <Printer size={16} /> Generate & Print Invoice
            </button>

            {/* Power Calculator */}
            {compatibility && (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#64748b' }}>Estimated Power Load:</span>
                  <strong style={{ color: '#ea580c' }}>{compatibility.totalTdp}W</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: '#64748b' }}>Recommended PSU:</span>
                  <strong style={{ color: '#2563eb' }}>{compatibility.recommendedPsuWattage}W+</strong>
                </div>
              </div>
            )}
          </div>

          {/* Compatibility Diagnostics */}
          {compatibility && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                {compatibility.isCompatible ? (
                  <CheckCircle size={18} color="#16a34a" />
                ) : (
                  <AlertTriangle size={18} color="#f87171" />
                )}
                Hardware Diagnostics
              </h3>

              {compatibility.issues.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {compatibility.issues.map((iss, idx) => (
                    <div key={idx} style={{ padding: '0.65rem 0.85rem', fontSize: '0.82rem', borderRadius: 8, background: iss.severity === 'error' ? '#fef2f2' : '#fff7ed', color: iss.severity === 'error' ? '#dc2626' : '#ea580c', border: `1px solid ${iss.severity === 'error' ? '#fecaca' : '#ffedd5'}` }}>
                      <div>
                        <strong>{iss.title}:</strong> {iss.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {compatibility.validChecks.map((v, idx) => (
                <div key={idx} style={{ fontSize: '0.82rem', color: '#16a34a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={14} /> {v.message}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Component Picker Modal */}
      {activePickerCategory && (
        <div className="modal-overlay" onClick={() => setActivePickerCategory(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Select {activePickerCategory.name}</h3>
              <button onClick={() => setActivePickerCategory(null)} style={{ background: 'none', color: '#0f172a', fontWeight: 800 }}>✕</button>
            </div>

            {loadingPicker ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>Loading components...</div>
            ) : pickerProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>No products available in this category.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {pickerProducts.map(p => (
                  <div
                    key={p.id}
                    className="glass-panel"
                    style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                      <img src={p.images[0]} alt="" style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {Object.entries(p.specifications || {}).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 800, color: '#ea580c' }}>৳{(p.discountPrice || p.price).toLocaleString()}</span>
                      <button className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }} onClick={() => handleSelectProductForSlot(p)}>
                        Add Component
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Recommendation Modal */}
      {showAiModal && (
        <div className="modal-overlay" onClick={() => setShowAiModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={20} color="#ea580c" /> AI Custom PC Recommender
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Set your target budget and primary use case, and AI will automatically assemble compatible hardware.
            </p>

            <div className="form-group">
              <label className="form-label">Target Budget (BDT): ৳{Number(aiBudget).toLocaleString()}</label>
              <input
                type="range"
                min="40000"
                max="250000"
                step="5000"
                value={aiBudget}
                onChange={(e) => setAiBudget(e.target.value)}
                style={{ accentColor: '#ea580c' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Requirement</label>
              <select className="form-control" value={aiUseCase} onChange={(e) => setAiUseCase(e.target.value)}>
                <option value="Gaming & Esports">High FPS Gaming & Esports</option>
                <option value="Video Editing & 3D Render">4K Video Editing & 3D Render</option>
                <option value="Programming & AI ML">Software Development & AI Workloads</option>
                <option value="Budget Home Office">Budget Home & Office Setup</option>
              </select>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '1rem', background: '#ea580c' }}
              onClick={handleRunAiRecommendation}
              disabled={aiLoading}
            >
              {aiLoading ? 'Assembling Hardware...' : 'Generate AI PC Build'}
            </button>
          </div>
        </div>
      )}

      {/* ==================== EXACT MATCH STORE PC BUILD INVOICE MODAL ==================== */}
      {showInvoiceModal && (
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
              borderRadius: '12px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '94vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              padding: '2.5rem 3rem',
              position: 'relative'
            }}
          >
            
            {/* Modal Control Bar (Hidden when printing) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: '#f8fafc', padding: '0.85rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                🖨️ Official PC Build Invoice & Memo Preview
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.55rem 1.2rem',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Printer size={16} /> Print / Save PDF Memo
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  style={{ background: '#cbd5e1', color: '#0f172a', border: 'none', borderRadius: '6px', padding: '0.55rem 0.9rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Close ✕
                </button>
              </div>
            </div>

            {/* ================= OFFICIAL TECHCORE INVOICE DOCUMENT START ================= */}
            <div id="printable-invoice-area" style={{ background: '#ffffff', color: '#0f172a', borderRadius: '12px', padding: '2.5rem', fontFamily: "'Urbanist', sans-serif" }}>
              
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
                    PC BUILD INVOICE
                  </h2>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                    Invoice No : <span style={{ color: '#0f172a' }}>#{invoiceCustomer.invoiceNo || 'BUILD-94821'}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Date : {invoiceCustomer.date || new Date().toLocaleDateString('en-GB')}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Order Type : <span style={{ fontWeight: 700, color: '#ea580c' }}>Custom PC Quotation</span>
                  </div>
                </div>
              </div>

              {/* Billed To & Customer Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.75rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    BILL TO
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{invoiceCustomer.name || user?.name || 'Valued Customer'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>Phone: {invoiceCustomer.phone || user?.phoneOrEmail || '01956417386'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>Company: {invoiceCustomer.company || 'N/A'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    LOCATION & BRANCH
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{invoiceCustomer.address || 'Street Address: 2nd floor, Jalil Tower'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>City: {invoiceCustomer.city || 'Khulna'}</div>
                  {invoiceCustomer.branch && <div style={{ fontSize: '0.85rem', color: '#475569' }}>Branch: {invoiceCustomer.branch}</div>}
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.75rem' }}>
                <thead>
                  <tr style={{ background: '#ea580c', color: '#ffffff' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, width: '50px' }}>NO</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 800, width: '120px' }}>COMPONENT</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 800 }}>DESCRIPTION & SPECIFICATION</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, width: '60px' }}>QTY</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 800, width: '120px' }}>UNIT PRICE</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 800, width: '130px' }}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItemsList.map((item, idx) => {
                    const itemPrice = Number(item.price || 0);
                    const itemQty = Number(item.qty || 1);
                    return (
                      <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>
                          {String(idx + 1).padStart(2, '0')}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 800, color: '#ea580c' }}>
                          {item.categoryKey || 'Part'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                          {item.name}
                          {item.warranty && <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>Warranty: {item.warranty}</div>}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                          {itemQty}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.88rem', color: '#334155' }}>
                          ৳{itemPrice.toLocaleString()}
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
                    All PC components carry official brand warranty. Please preserve this PC quotation & invoice document for warranty claims and hardware compatibility support.
                  </p>

                  <div style={{ marginTop: '2rem', display: 'inline-block', textAlign: 'center' }}>
                    <div style={{ borderBottom: '1px solid #cbd5e1', width: '160px', marginBottom: '0.3rem' }}></div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Authorized Signature</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
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
                    <span>Total Amount:</span>
                    <span>৳{Number(invoiceTotalSum).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Invoice Footer Banner */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ea580c', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  THANK YOU FOR BUILDING YOUR PC WITH TECHCORE
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  TechCore Bangladesh | Complete Computer & Electronics Store
                </div>
              </div>

            </div>
            {/* ================= OFFICIAL TECHCORE INVOICE DOCUMENT END ================= */}

          </div>
        </div>
      )}

    </div>
  );
}
