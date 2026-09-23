import React, { useState } from 'react';
import { Laptop, Sparkles, CheckCircle2, ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function LaptopFinder({ onSelectProduct }) {
  const [budget, setBudget] = useState(150000);
  const [scenario, setScenario] = useState('Gaming');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useShop();

  const handleSearchLaptops = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/laptop-finder/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxBudget: budget, usageScenario: scenario })
      });
      if (!res.ok) throw new Error('Recommendation request failed');
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.recommendations || data.laptops || []);
      setResults(list);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const scenarios = [
    { id: 'Gaming', label: 'Gaming & Esports', desc: 'High Refresh Rate & Dedicated GPU' },
    { id: 'Video Editing', label: 'Video Editing & 3D', desc: '100% sRGB Display & High VRAM' },
    { id: 'Programming', label: 'Software & Web Dev', desc: 'High RAM & Fast CPU Cores' },
    { id: 'Student', label: 'Student & Office', desc: 'Slim Portable & Long Battery Life' }
  ];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: 900 }}>

      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="glass-panel" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', color: 'var(--primary-cyan)', fontWeight: 800, textTransform: 'uppercase' }}>
          Interactive Questionnaire Tool
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0' }}>
          Smart <span className="gradient-text">Laptop Finder</span> Assistant
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
          Answer 2 simple questions to get personalized laptop recommendations matched to your workflow.
        </p>
      </div>

      {/* Questionnaire Form */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <form onSubmit={handleSearchLaptops}>
          {/* Question 1: Budget */}
          <div style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
              1. What is your budget limit?
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-cyan)', marginBottom: '0.5rem' }}>
              <span>৳50,000</span>
              <span>Target: ৳{Number(budget).toLocaleString()} BDT</span>
              <span>৳250,000+</span>
            </div>
            <input
              type="range"
              min="50000"
              max="250000"
              step="10000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary-cyan)' }}
            />
          </div>

          {/* Question 2: Usage Scenario */}
          <div style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
              2. What do you primarily use your laptop for?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {scenarios.map(sc => (
                <div
                  key={sc.id}
                  className="glass-panel"
                  onClick={() => setScenario(sc.id)}
                  style={{
                    padding: '1rem',
                    cursor: 'pointer',
                    borderColor: scenario === sc.id ? 'var(--primary-cyan)' : 'var(--border-color)',
                    background: scenario === sc.id ? 'rgba(0, 242, 254, 0.1)' : 'transparent'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', marginBottom: '0.2rem' }}>{sc.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sc.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}>
            {loading ? 'Analyzing Laptops...' : 'Find Matching Laptops'} <Sparkles size={18} />
          </button>
        </form>
      </div>

      {/* Results Section */}
      {Array.isArray(results) && results.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            Top Recommended <span className="gradient-text">Laptops</span> ({results.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {results.map((item, idx) => {
              const laptop = item.laptop || item;
              const matchPercentage = item.matchPercentage || 95;
              const lId = laptop.id || laptop._id || `lap-${idx}`;
              const lImg = Array.isArray(laptop.images) && laptop.images.length > 0
                ? laptop.images[0]
                : (laptop.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop');

              return (
                <div
                  key={lId}
                  className="glass-panel"
                  style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '180px 1fr 200px', gap: '1.5rem', alignItems: 'center' }}
                >
                  <img src={lImg} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 10 }} />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                      <span className="glass-panel" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', background: '#10b981', color: 'black', fontWeight: 800 }}>
                        {matchPercentage}% Match
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: 800, textTransform: 'uppercase' }}>
                        {laptop.brand || 'TechCore'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer' }} onClick={() => onSelectProduct(lId)}>
                      {laptop.name}
                    </h3>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      {laptop.specifications?.processor} • {laptop.specifications?.ram} • {laptop.specifications?.graphics}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-cyan)', marginBottom: '0.5rem' }}>
                      ৳{Number(laptop.discountPrice || laptop.price || 0).toLocaleString()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button className="btn-primary" style={{ padding: '0.5rem', fontSize: '0.85rem', justifyContent: 'center' }} onClick={() => addToCart(laptop)}>
                        <ShoppingCart size={14} /> Add to Cart
                      </button>
                      <button className="btn-secondary" style={{ padding: '0.5rem', fontSize: '0.85rem', justifyContent: 'center' }} onClick={() => onSelectProduct(lId)}>
                        View Specs
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
