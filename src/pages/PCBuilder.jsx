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

            {/* ================= EXACT IMAGE LAYOUT REPLICA START ================= */}
            <div id="printable-invoice-area" style={{ fontFamily: '"Times New Roman", Times, serif', color: '#000000', lineHeight: 1.35 }}>
              
              {/* 1. Header Grid */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                
                {/* Header Left: Store Brand & Address */}
                <div>
                  <h1 style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', fontWeight: 'bold', color: '#111111', margin: 0, lineHeight: 1.1 }}>
                    TechCore Gallery
                  </h1>
                  <div style={{ fontStyle: 'italic', fontSize: '13px', color: '#444444', marginBottom: '12px' }}>
                    Thanks for visit our shop
                  </div>
                  
                  <div style={{ fontSize: '13px', color: '#222222', lineHeight: '1.4' }}>
                    <div>Street Address: 2nd floor, Jalil Tower, Khulna</div>
                    <div>Branch: {invoiceCustomer.branch}</div>
                    <div>Phone 01956417386</div>
                  </div>
                </div>

                {/* Header Right: INVOICE Heading & Meta */}
                <div style={{ textAlign: 'right' }}>
                  <h1 style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '38px', fontWeight: 'bold', color: '#16a34a', margin: '0 0 10px 0', letterSpacing: '1px' }}>
                    INVOICE
                  </h1>
                  
                  <table style={{ marginLeft: 'auto', fontSize: '13px', borderCollapse: 'collapse', lineHeight: '1.4' }}>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 'bold', paddingRight: '16px', textAlign: 'right' }}>DATE:</td>
                        <td style={{ textAlign: 'right', minWidth: '130px' }}>{invoiceCustomer.date}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 'bold', paddingRight: '16px', textAlign: 'right' }}>INVOICE #</td>
                        <td style={{ textAlign: 'right' }}>{invoiceCustomer.invoiceNo}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 'bold', paddingRight: '16px', textAlign: 'right' }}>FOR:</td>
                        <td style={{ fontStyle: 'italic', textAlign: 'right' }}>Build a PC</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* 2. Bill To Block */}
              <div style={{ marginBottom: '1.5rem', fontSize: '13px', lineHeight: '1.4' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>Bill To:</div>
                <div>Name: {invoiceCustomer.name}</div>
                <div>Company Name: {invoiceCustomer.company}</div>
                <div>Street Address: {invoiceCustomer.address}</div>
                <div>City: {invoiceCustomer.city}</div>
                <div>Phone: {invoiceCustomer.phone}</div>
              </div>

              {/* 3. Description & Amount Table (Matching Exact Image Borders & Padding) */}
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #000000', marginBottom: '0' }}>
                <thead>
                  <tr style={{ background: '#ededed', borderBottom: '1.5px solid #000000' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'center', borderRight: '1.5px solid #000000', fontWeight: 'bold', fontSize: '14px', fontFamily: '"Times New Roman", Times, serif' }}>
                      DESCRIPTION
                    </th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', width: '150px', fontFamily: '"Times New Roman", Times, serif' }}>
                      AMOUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItemsList.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #000000' }}>
                      <td style={{ padding: '5px 10px', borderRight: '1.5px solid #000000', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{item.name}</span>
                          {item.qty && item.qty > 1 && (
                            <span style={{ paddingRight: '40px', fontWeight: 'normal' }}>{item.qty}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '5px 10px', textAlign: 'right', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {item.price ? Number(item.price * (item.qty || 1)).toLocaleString() : '0'}.00৳
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', borderRight: '1.5px solid #000000' }}>
                      TOTAL
                    </td>
                    <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', background: '#e2e8f0', borderTop: '1.5px solid #000000' }}>
                      {Number(invoiceTotalSum).toLocaleString()}.00৳
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* 4. Footer & Signature */}
              <div style={{ marginTop: '24px', fontSize: '13px' }}>
                <div style={{ marginBottom: '24px' }}>
                  Make all checks payable to TechCore Gallery
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                  <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '14px' }}>
                    PAID BY {invoiceCustomer.paymentMethod} {Number(invoiceTotalSum).toLocaleString()} BDT
                  </div>

                  <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '13px', width: '180px', borderTop: '1px solid #000000', paddingTop: '4px' }}>
                    Signature
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', letterSpacing: '0.5px' }}>
                  THANK YOU FOR YOUR BUSINESS!
                </div>
              </div>

            </div>
            {/* ================= EXACT IMAGE LAYOUT REPLICA END ================= */}

          </div>
        </div>
      )}

    </div>
  );
}
