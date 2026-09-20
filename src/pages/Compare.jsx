import React from 'react';
import { useShop } from '../context/ShopContext';
import { Scale, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function Compare({ onNavigate, onSelectProduct }) {
  const { compareItems, toggleCompare, addToCart } = useShop();

  if (compareItems.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: 500, margin: '0 auto' }}>
          <Scale size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h2>No Products Selected for Comparison</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem 0' }}>
            Click the scale icon on any product card to add up to 4 items for side-by-side spec comparison.
          </p>
          <button className="btn-primary" onClick={() => onNavigate('products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Collect all unique specification keys across selected items
  const allSpecKeys = Array.from(new Set(
    compareItems.flatMap(p => Object.keys(p.specifications || {}))
  ));

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <button className="btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => onNavigate('products')}>
        <ArrowLeft size={14} /> Back to Products
      </button>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        Product <span className="gradient-text">Comparison Matrix</span> ({compareItems.length}/4)
      </h1>

      <div style={{ overflowX: 'auto' }}>
        <table className="glass-panel spec-table" style={{ width: '100%', minWidth: 600 }}>
          <thead>
            <tr>
              <th style={{ width: '200px' }}>Features / Specs</th>
              {compareItems.map(item => (
                <th key={item.id} style={{ textAlign: 'center', verticalAlign: 'top', width: `${80 / compareItems.length}%` }}>
                  <div style={{ padding: '0.5rem' }}>
                    <img src={item.images[0]} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{item.name}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-cyan)', margin: '0.3rem 0' }}>
                      ৳{(item.discountPrice || item.price).toLocaleString()}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                      <button className="btn-primary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }} onClick={() => addToCart(item)}>
                        <ShoppingCart size={13} /> Cart
                      </button>
                      <button className="btn-secondary" style={{ padding: '0.35rem' }} onClick={() => toggleCompare(item)}>
                        <Trash2 size={13} color="#f87171" />
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Brand</td>
              {compareItems.map(item => (
                <td key={item.id} style={{ textAlign: 'center', fontWeight: 700 }}>{item.brand}</td>
              ))}
            </tr>
            <tr>
              <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Category</td>
              {compareItems.map(item => (
                <td key={item.id} style={{ textAlign: 'center' }}>{item.category}</td>
              ))}
            </tr>
            <tr>
              <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Warranty</td>
              {compareItems.map(item => (
                <td key={item.id} style={{ textAlign: 'center', color: '#34d399', fontWeight: 700 }}>{item.warranty}</td>
              ))}
            </tr>

            {/* Dynamic Specification Rows */}
            {allSpecKeys.map(key => (
              <tr key={key}>
                <td style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {key.replace(/([A-Z])/g, ' $1')}
                </td>
                {compareItems.map(item => (
                  <td key={item.id} style={{ textAlign: 'center' }}>
                    {item.specifications?.[key] ? String(item.specifications[key]) : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
