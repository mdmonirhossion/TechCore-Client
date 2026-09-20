import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, Package, ShoppingBag, Wrench, Users, DollarSign, AlertTriangle, TrendingUp, RefreshCw, Plus, Edit2, Check
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error(err));

    fetch('/api/admin/inventory')
      .then(res => res.json())
      .then(data => setInventory(data || []))
      .catch(err => console.error(err));

    fetch('/api/admin/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(data || []))
      .catch(err => console.error(err));
  }, []);

  const handleUpdateStock = async (id) => {
    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStock: newStockVal })
      });
      if (res.ok) {
        setInventory(inventory.map(item => item.id === id ? { ...item, currentStock: Number(newStockVal) } : item));
        setEditingStockId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const COLORS = ['#00f2fe', '#7928ca', '#ff9900', '#10b981'];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>

      {/* Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="glass-panel" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: 800, textTransform: 'uppercase' }}>
            Executive Administration & ERP
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.3rem 0' }}>
            TechCore <span className="gradient-text">Control Center</span>
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="glass-panel" style={{ display: 'flex', gap: '0.5rem', padding: '0.35rem' }}>
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'inventory', label: 'Inventory ERP', icon: Package },
            { id: 'suppliers', label: 'Suppliers', icon: Users }
          ].map(t => {
            const IconComp = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  background: activeTab === t.id ? 'var(--primary-blue)' : 'transparent',
                  color: activeTab === t.id ? '#ffffff' : 'var(--text-main)',
                  padding: '0.5rem 1rem',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <IconComp size={16} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. OVERVIEW & ANALYTICS TAB */}
      {activeTab === 'overview' && analytics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-cyan)', margin: '0.3rem 0' }}>
                ৳{analytics.kpis.revenue.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingUp size={14} /> +18.4% from last month
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Gross Profit</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', margin: '0.3rem 0' }}>
                ৳{analytics.kpis.grossProfit.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Estimated ~25% Margin</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Orders</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.3rem 0' }}>
                {analytics.kpis.totalOrders}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)' }}>Active Store Fulfillment</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Low Stock Alerts</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171', margin: '0.3rem 0' }}>
                {analytics.kpis.lowStockCount} Products
              </div>
              <div style={{ fontSize: '0.78rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={14} /> Requires Stock Replenishment
              </div>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Monthly Revenue vs Profit Growth</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={analytics.salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip contentStyle={{ background: '#ffffff', color: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="sales" stroke="#00f2fe" strokeWidth={3} />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Sales Share by Category</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={analytics.categoryShare} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {analytics.categoryShare.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#ffffff', color: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. INVENTORY ERP TAB */}
      {activeTab === 'inventory' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>ERP Stock & Inventory Tracking</h2>
          <table className="spec-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Sold</th>
                <th>Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary-cyan)' }}>{item.sku}</td>
                  <td style={{ fontWeight: 700 }}>{item.name}</td>
                  <td>{item.category}</td>
                  <td style={{ fontSize: '1rem', fontWeight: 800 }}>
                    {editingStockId === item.id ? (
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: 80, padding: '0.2rem 0.5rem' }}
                        value={newStockVal}
                        onChange={(e) => setNewStockVal(e.target.value)}
                      />
                    ) : (
                      item.currentStock
                    )}
                  </td>
                  <td>{item.soldCount} Units</td>
                  <td>
                    <span className="glass-panel" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 800, color: item.status === 'LOW_STOCK' ? '#f87171' : '#34d399' }}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {editingStockId === item.id ? (
                      <button className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }} onClick={() => handleUpdateStock(item.id)}>
                        <Check size={14} /> Save
                      </button>
                    ) : (
                      <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }} onClick={() => { setEditingStockId(item.id); setNewStockVal(item.currentStock); }}>
                        <Edit2 size={13} /> Update Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. SUPPLIERS TAB */}
      {activeTab === 'suppliers' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>Hardware Suppliers & Purchase Directory</h2>
          <table className="spec-table">
            <thead>
              <tr>
                <th>Supplier Company</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Total Purchase</th>
                <th>Due Amount</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(sup => (
                <tr key={sup.id}>
                  <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>{sup.name}</td>
                  <td>{sup.contactPerson}</td>
                  <td>{sup.phone}</td>
                  <td>{sup.email}</td>
                  <td style={{ fontWeight: 700 }}>৳{sup.totalPurchase.toLocaleString()}</td>
                  <td style={{ fontWeight: 800, color: sup.dueAmount > 0 ? '#f87171' : '#34d399' }}>
                    ৳{sup.dueAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
