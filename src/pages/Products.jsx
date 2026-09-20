import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, Search, RefreshCw } from 'lucide-react';

export default function Products({ categoryFilter, searchFilter, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState(250000);
  const [sortBy, setSortBy] = useState('default');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setSelectedCategory(categoryFilter || '');
  }, [categoryFilter]);

  useEffect(() => {
    fetch('/api/brands').then(res => res.json()).then(data => setBrands(data || []));
    fetch('/api/categories').then(res => res.json()).then(data => setCategories(data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = `/api/products?sort=${sortBy}`;
    if (selectedCategory) query += `&category=${selectedCategory}`;
    if (selectedBrand) query += `&brand=${selectedBrand}`;
    if (maxPrice) query += `&maxPrice=${maxPrice}`;
    if (searchFilter) query += `&search=${encodeURIComponent(searchFilter)}`;

    fetch(query)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedCategory, selectedBrand, maxPrice, sortBy, searchFilter]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMaxPrice(250000);
    setSortBy('default');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {searchFilter ? `Search Results for "${searchFilter}"` : selectedCategory ? `${selectedCategory.toUpperCase()} Catalog` : 'All Computer Products'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Showing {products.length} matching items
          </p>
        </div>

        {/* Sort selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SlidersHorizontal size={16} color="var(--primary-cyan)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Sort By:</span>
          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.88rem' }}
          >
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* Side Filter Panel */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <span style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter size={16} color="var(--primary-cyan)" /> Filter Products
            </span>
            <button onClick={resetFilters} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 2 }}>
              <RefreshCw size={12} /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Category</label>
            <select className="form-control" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Brand</label>
            <select className="form-control" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
              <option value="">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span className="form-label" style={{ fontWeight: 700, color: 'white' }}>Max Price:</span>
              <span style={{ color: 'var(--primary-cyan)', fontWeight: 800 }}>৳{Number(maxPrice).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="250000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary-cyan)' }}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              Loading TechCore Catalog...
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Search size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3>No products matched your criteria</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem 0' }}>
                Try clearing filters or searching for another keyword.
              </p>
              <button className="btn-secondary" onClick={resetFilters}>Reset All Filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
