import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Cpu, Tv, Grid, HardDrive, Zap, Database, Monitor, Wind, Box, Headphones,
  CheckCircle, AlertTriangle, Printer, ShoppingCart, RefreshCw, Sparkles, Plus, Trash2
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
  const { builderSlots, setBuilderComponent, removeBuilderComponent, resetBuilder, addToCart } = useShop();
  const [activePickerCategory, setActivePickerCategory] = useState(null);
  const [pickerProducts, setPickerProducts] = useState([]);
  const [loadingPicker, setLoadingPicker] = useState(false);
  const [compatibility, setCompatibility] = useState(null);

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
        setPickerProducts(data.products || []);
        setLoadingPicker(false);
      })
      .catch(err => {
        console.error(err);
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
          <button className="btn-secondary" onClick={() => window.print()}>
            <Printer size={15} /> Print Quotation
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
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>
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
                      <span style={{ fontWeight: 800, color: 'var(--primary-cyan)', fontSize: '0.95rem' }}>
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
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(11, 15, 23, 0.9))' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Build Summary</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-cyan)', marginBottom: '1rem' }}>
              ৳{totalCost.toLocaleString()} BDT
            </div>

            {/* Power Calculator */}
            {compatibility && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Power Load:</span>
                  <strong style={{ color: 'var(--accent-amber)' }}>{compatibility.totalTdp}W</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Recommended PSU:</span>
                  <strong style={{ color: 'var(--primary-cyan)' }}>{compatibility.recommendedPsuWattage}W+</strong>
                </div>
              </div>
            )}
          </div>

          {/* Compatibility Diagnostics */}
          {compatibility && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                {compatibility.isCompatible ? (
                  <CheckCircle size={18} color="#34d399" />
                ) : (
                  <AlertTriangle size={18} color="#f87171" />
                )}
                Hardware Diagnostics
              </h3>

              {/* Issues List */}
              {compatibility.issues.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {compatibility.issues.map((iss, idx) => (
                    <div key={idx} className={`alert-box ${iss.severity === 'error' ? 'alert-danger' : 'alert-warning'}`} style={{ padding: '0.65rem 0.85rem', fontSize: '0.82rem' }}>
                      <div>
                        <strong>{iss.title}:</strong> {iss.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Validated Checks */}
              {compatibility.validChecks.map((v, idx) => (
                <div key={idx} style={{ fontSize: '0.82rem', color: '#34d399', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: 6 }}>
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
              <button onClick={() => setActivePickerCategory(null)} style={{ background: 'none', color: 'white', fontWeight: 800 }}>✕</button>
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
                      <span style={{ fontWeight: 800, color: 'var(--primary-cyan)' }}>৳{(p.discountPrice || p.price).toLocaleString()}</span>
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
              <Sparkles size={20} color="var(--primary-cyan)" /> AI Custom PC Recommender
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
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
                style={{ accentColor: 'var(--primary-cyan)' }}
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
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '1rem' }}
              onClick={handleRunAiRecommendation}
              disabled={aiLoading}
            >
              {aiLoading ? 'Assembling Hardware...' : 'Generate AI PC Build'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
