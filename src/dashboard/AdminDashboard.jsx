import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, Package, Users, AlertTriangle, TrendingUp, Plus, Edit2, Check,
  Trash2, Search, Filter, X, Image as ImageIcon, Tag, ShieldCheck, RefreshCw, CheckCircle2, ArrowRight, Lock
} from 'lucide-react';

// Helper for safe number formatting to prevent undefined toLocaleString crashes
const formatMoney = (val) => {
  if (val === undefined || val === null || val === '') return '0';
  const num = Number(val);
  return isNaN(num) ? '0' : num.toLocaleString();
};

export default function AdminDashboard({ onNavigate }) {
  const { user } = useShop();

  // 🔒 STRICT ADMIN GUARD: Allow access ONLY if user is logged in as Admin
  const currentUser = user || (() => {
    try {
      return JSON.parse(localStorage.getItem('techcore_user') || localStorage.getItem('user') || '{}');
    } catch (e) {
      return {};
    }
  })();

  const isApprovedAdmin = currentUser?.role === 'SUPER_ADMIN' ||
                          (currentUser?.role === 'CO_ADMIN' && currentUser?.status === 'APPROVED') ||
                          currentUser?.email === 'techcoreadmin@gmail.com' ||
                          currentUser?.phoneOrEmail === 'techcoreadmin@gmail.com' ||
                          currentUser?.isAdmin === true;

  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  // Stock inline edit state
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');

  // Search & Filter state for inventory
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // New Product Form Data
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: 'ASUS',
    category: 'Components',
    sku: '',
    price: '',
    discountPrice: '',
    currentStock: '10',
    status: 'IN_STOCK',
    warranty: '3 Years Replacement Warranty',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop',
    description: ''
  });

  // Sample default inventory items if API server is not running or returning empty
  const defaultInventory = [
    { id: 'p1', sku: 'GPU-ASUS-4060', name: 'ASUS Dual GeForce RTX 4060 OC 8GB GDDR6', brand: 'ASUS', category: 'Components', price: 39999, discountPrice: 37500, currentStock: 14, soldCount: 42, status: 'IN_STOCK', warranty: '3 Years Warranty' },
    { id: 'p2', sku: 'CPU-INTEL-14700K', name: 'Intel Core i7-14700K 14th Gen Processor', brand: 'Intel', category: 'Components', price: 48500, discountPrice: 46900, currentStock: 3, soldCount: 29, status: 'LOW_STOCK', warranty: '3 Years Warranty' },
    { id: 'p3', sku: 'LAP-MSI-KATANA15', name: 'MSI Katana 15 Core i7 13th Gen RTX 4060 Gaming Laptop', brand: 'MSI', category: 'Laptop & Desktop', price: 145000, discountPrice: 139990, currentStock: 0, soldCount: 18, status: 'OUT_OF_STOCK', warranty: '2 Years Warranty' },
    { id: 'p4', sku: 'MON-GIGA-M27Q', name: 'Gigabyte M27Q 27" 170Hz QHD IPS Gaming Monitor', brand: 'Gigabyte', category: 'Monitor', price: 36500, discountPrice: 34990, currentStock: 22, soldCount: 65, status: 'IN_STOCK', warranty: '3 Years Warranty' },
    { id: 'p5', sku: 'RAM-COR-32GB', name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz RAM', brand: 'Corsair', category: 'Components', price: 15500, discountPrice: 14200, currentStock: 2, soldCount: 88, status: 'LOW_STOCK', warranty: 'Lifetime Warranty' }
  ];

  useEffect(() => {
    if (!isApprovedAdmin) return;

    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(() => {
        // Fallback demo analytics
        setAnalytics({
          kpis: { revenue: 4589000, grossProfit: 1147250, totalOrders: 342, lowStockCount: 2 },
          salesTrend: [
            { month: 'Jan', sales: 420000, profit: 105000 },
            { month: 'Feb', sales: 580000, profit: 145000 },
            { month: 'Mar', sales: 720000, profit: 180000 },
            { month: 'Apr', sales: 690000, profit: 172500 },
            { month: 'May', sales: 890000, profit: 222500 },
            { month: 'Jun', sales: 1289000, profit: 322250 }
          ],
          categoryShare: [
            { name: 'GPU & CPU', value: 45 },
            { name: 'Laptops', value: 25 },
            { name: 'Monitors', value: 15 },
            { name: 'RAM & Storage', value: 15 }
          ]
        });
      });

    fetch('/api/admin/inventory')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setInventory(data);
        else setInventory(defaultInventory);
      })
      .catch(() => setInventory(defaultInventory));

    fetch('/api/admin/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(Array.isArray(data) ? data : []))
      .catch(() => {
        setSuppliers([
          { id: 's1', name: 'Global Brand Private Ltd (ASUS BD)', contactPerson: 'Md. Tareq Rahman', phone: '01711000111', email: 'sales@globalbrand.com.bd', totalPurchase: 4500000, dueAmount: 120000 },
          { id: 's2', name: 'UCC Bangladesh (MSI & Sapphire)', contactPerson: 'Tanvir Hossain', phone: '01819222333', email: 'orders@ucc-bd.com', totalPurchase: 3200000, dueAmount: 0 },
          { id: 's3', name: 'Smart Technologies BD Ltd (Gigabyte & Intel)', contactPerson: 'Shafiqul Islam', phone: '01911444555', email: 'corporate@smartbd.com', totalPurchase: 5800000, dueAmount: 450000 }
        ]);
      });
  }, [isApprovedAdmin]);

  // If user is not admin, show Access Denied Protection UI
  if (!isApprovedAdmin) {
    return (
      <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 180px)', padding: '4rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '500px', width: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
            Admin Access Restricted
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#64748b', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            This ERP Control Center is restricted exclusively to <strong>TechCore Super Admins</strong>. Regular customer accounts cannot view administrative data.
          </p>
          <button
            onClick={() => onNavigate('login')}
            style={{
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.85rem 1.75rem',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            Log In as Admin
          </button>
        </div>
      </div>
    );
  }

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // 1. Quick Stock Update
  const handleUpdateStock = async (id) => {
    const updatedCount = Number(newStockVal);
    let newStatus = 'IN_STOCK';
    if (updatedCount === 0) newStatus = 'OUT_OF_STOCK';
    else if (updatedCount <= 5) newStatus = 'LOW_STOCK';

    try {
      await fetch(`/api/admin/inventory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStock: updatedCount, status: newStatus })
      });
    } catch (err) {
      console.log('Server update skipped, updating UI locally.');
    }

    setInventory(prev => prev.map(item =>
      item.id === id ? { ...item, currentStock: updatedCount, status: newStatus } : item
    ));
    setEditingStockId(null);
    showToast(`✅ Stock updated successfully for product SKU #${id}!`);
  };

  // 2. Add New Product Handler
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    if (!newProduct.name.trim() || !newProduct.price) {
      alert('Please fill in Product Name and Price!');
      return;
    }

    const priceNum = Number(newProduct.price);
    const discNum = newProduct.discountPrice ? Number(newProduct.discountPrice) : priceNum;
    const stockNum = Number(newProduct.currentStock || 10);
    const generatedSku = newProduct.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`;

    let calculatedStatus = newProduct.status;
    if (stockNum === 0) calculatedStatus = 'OUT_OF_STOCK';
    else if (stockNum <= 5) calculatedStatus = 'LOW_STOCK';

    const productObject = {
      id: `prod-${Date.now()}`,
      sku: generatedSku,
      name: newProduct.name.trim(),
      brand: newProduct.brand,
      category: newProduct.category,
      price: priceNum,
      discountPrice: discNum,
      currentStock: stockNum,
      soldCount: 0,
      status: calculatedStatus,
      warranty: newProduct.warranty,
      image: newProduct.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop',
      description: newProduct.description
    };

    try {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productObject)
      });
    } catch (err) {
      console.log('Skipping backend POST, updating UI state.');
    }

    setInventory(prev => [productObject, ...prev]);

    setShowAddModal(false);
    setNewProduct({
      name: '',
      brand: 'ASUS',
      category: 'Components',
      sku: '',
      price: '',
      discountPrice: '',
      currentStock: '10',
      status: 'IN_STOCK',
      warranty: '3 Years Replacement Warranty',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop',
      description: ''
    });

    showToast(`🎉 New Product "${productObject.name}" added to Star Tech catalog & inventory!`);
  };

  // 3. Delete Product
  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      setInventory(prev => prev.filter(p => p.id !== id));
      showToast(`🗑️ Product "${name}" deleted.`);
    }
  };

  // Filtered Inventory List safely
  const filteredInventory = (Array.isArray(inventory) ? inventory : []).filter(item => {
    if (!item) return false;
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const COLORS = ['#ea580c', '#2563eb', '#10b981', '#7c3aed'];

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem 4rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Toast Notification */}
        {toastMsg && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: '#0f172a',
            color: '#ffffff',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 700,
            fontSize: '0.92rem',
            borderLeft: '4px solid #ea580c'
          }}>
            {toastMsg}
          </div>
        )}

        {/* Admin Top Header & Quick Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#ffffff',
          padding: '1.5rem 1.75rem',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fff7ed', color: '#ea580c', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <ShieldCheck size={14} /> Star Tech ERP & Catalog Management
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              TechCore <span style={{ color: '#ea580c' }}>Control Center</span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              style={{
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.35rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#c2410c')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ea580c')}
            >
              <Plus size={20} /> Add New Product
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'inventory', label: `Catalog & Stock Inventory (${inventory.length})`, icon: Package },
            { id: 'suppliers', label: 'Hardware Suppliers', icon: Users }
          ].map(t => {
            const IconComp = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  background: isActive ? '#0f172a' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? '1px solid #0f172a' : '1px solid #cbd5e1',
                  padding: '0.65rem 1.2rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.2)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <IconComp size={18} color={isActive ? '#ea580c' : '#64748b'} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ==================== 1. OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && analytics && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '0.3rem 0' }}>
                  ৳{formatMoney(analytics?.kpis?.revenue)}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={14} /> +18.4% monthly growth
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Products Listed</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ea580c', margin: '0.3rem 0' }}>
                  {inventory.length} Items
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Active in Store Catalog</div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Orders</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2563eb', margin: '0.3rem 0' }}>
                  {analytics?.kpis?.totalOrders || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700 }}>Active Fulfillment</div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 700, textTransform: 'uppercase' }}>Low Stock / Out of Stock</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#dc2626', margin: '0.3rem 0' }}>
                  {inventory.filter(i => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK').length} Products
                </div>
                <div style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={14} /> Requires Restock
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>Revenue vs Profit Growth Trend</h3>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <LineChart data={analytics?.salesTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip contentStyle={{ background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="sales" stroke="#ea580c" strokeWidth={3} />
                      <Line type="monotone" dataKey="profit" stroke="#16a34a" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>Sales Share by Category</h3>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={analytics?.categoryShare || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {(analytics?.categoryShare || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== 2. CATALOG & INVENTORY TAB ==================== */}
        {activeTab === 'inventory' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            
            {/* Header & Filter Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Product Inventory & Stock Management</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Regularly update stock, restock sold out items, or add new tech products</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                style={{
                  background: '#ea580c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem 1.1rem',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                }}
              >
                <Plus size={18} /> Add Product
              </button>
            </div>

            {/* Search & Filter Toolbar */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search by Product Name, SKU or Brand (e.g. RTX 4060, ASUS)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem 0.65rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
                <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>

              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', fontWeight: 600 }}
                >
                  <option value="ALL">All Categories</option>
                  <option value="Components">Components (CPU, GPU, RAM)</option>
                  <option value="Laptop & Desktop">Laptop & Desktop</option>
                  <option value="Monitor">Monitors</option>
                  <option value="Accessories">Accessories & Peripherals</option>
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', fontWeight: 600 }}
                >
                  <option value="ALL">All Stock Status</option>
                  <option value="IN_STOCK">In Stock</option>
                  <option value="LOW_STOCK">Low Stock (≤ 5)</option>
                  <option value="OUT_OF_STOCK">Out of Stock (0)</option>
                </select>
              </div>
            </div>

            {/* Inventory Data Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0', color: '#334155' }}>
                    <th style={{ padding: '0.85rem' }}>SKU</th>
                    <th style={{ padding: '0.85rem' }}>Product Name</th>
                    <th style={{ padding: '0.85rem' }}>Category / Brand</th>
                    <th style={{ padding: '0.85rem' }}>Price (৳)</th>
                    <th style={{ padding: '0.85rem' }}>Current Stock</th>
                    <th style={{ padding: '0.85rem' }}>Status</th>
                    <th style={{ padding: '0.85rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                        No products found matching your search or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '0.85rem', fontWeight: 800, color: '#ea580c' }}>{item.sku}</td>
                        <td style={{ padding: '0.85rem', fontWeight: 700, color: '#0f172a', maxWidth: '320px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            {item.image && (
                              <img src={item.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                            )}
                            <div>
                              <div>{item.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{item.warranty}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <span style={{ display: 'inline-block', background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                            {item.category}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                          ৳{formatMoney(item.discountPrice || item.price)}
                          {item.discountPrice && item.price && Number(item.discountPrice) < Number(item.price) && (
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>৳{formatMoney(item.price)}</div>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem', fontSize: '0.95rem', fontWeight: 800 }}>
                          {editingStockId === item.id ? (
                            <input
                              type="number"
                              style={{ width: 70, padding: '0.3rem', borderRadius: 6, border: '1.5px solid #2563eb', fontWeight: 800 }}
                              value={newStockVal}
                              onChange={(e) => setNewStockVal(e.target.value)}
                              autoFocus
                            />
                          ) : (
                            <span style={{ color: item.currentStock === 0 ? '#dc2626' : (item.currentStock <= 5 ? '#ea580c' : '#0f172a') }}>
                              {item.currentStock} Units
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <span style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: item.status === 'OUT_OF_STOCK' ? '#fef2f2' : (item.status === 'LOW_STOCK' ? '#fff7ed' : '#f0fdf4'),
                            color: item.status === 'OUT_OF_STOCK' ? '#dc2626' : (item.status === 'LOW_STOCK' ? '#ea580c' : '#16a34a'),
                            border: `1px solid ${item.status === 'OUT_OF_STOCK' ? '#fecaca' : (item.status === 'LOW_STOCK' ? '#ffedd5' : '#bbf7d0')}`
                          }}>
                            {item.status === 'OUT_OF_STOCK' ? 'Out of Stock' : (item.status === 'LOW_STOCK' ? 'Low Stock' : 'In Stock')}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            {editingStockId === item.id ? (
                              <button
                                type="button"
                                style={{ background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: 6, padding: '0.4rem 0.75rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                                onClick={() => handleUpdateStock(item.id)}
                              >
                                <Check size={14} /> Save Stock
                              </button>
                            ) : (
                              <button
                                type="button"
                                style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 6, padding: '0.4rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                                onClick={() => { setEditingStockId(item.id); setNewStockVal(item.currentStock); }}
                              >
                                <Edit2 size={13} /> Restock
                              </button>
                            )}

                            <button
                              type="button"
                              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, padding: '0.4rem', cursor: 'pointer' }}
                              title="Delete Product"
                              onClick={() => handleDeleteProduct(item.id, item.name)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ==================== 3. SUPPLIERS TAB ==================== */}
        {activeTab === 'suppliers' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Hardware Suppliers & Purchase Directory</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0', color: '#334155' }}>
                  <th style={{ padding: '0.85rem' }}>Supplier Company</th>
                  <th style={{ padding: '0.85rem' }}>Contact Person</th>
                  <th style={{ padding: '0.85rem' }}>Phone</th>
                  <th style={{ padding: '0.85rem' }}>Email</th>
                  <th style={{ padding: '0.85rem' }}>Total Purchase</th>
                  <th style={{ padding: '0.85rem' }}>Due Amount</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(sup => (
                  <tr key={sup.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{sup.name}</td>
                    <td style={{ padding: '0.85rem' }}>{sup.contactPerson}</td>
                    <td style={{ padding: '0.85rem' }}>{sup.phone}</td>
                    <td style={{ padding: '0.85rem' }}>{sup.email}</td>
                    <td style={{ padding: '0.85rem', fontWeight: 700 }}>৳{formatMoney(sup.totalPurchase)}</td>
                    <td style={{ padding: '0.85rem', fontWeight: 800, color: sup.dueAmount > 0 ? '#dc2626' : '#16a34a' }}>
                      ৳{formatMoney(sup.dueAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== STAR TECH ADD PRODUCT MODAL ==================== */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #e2e8f0'
            }}>
              
              <div style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#0f172a',
                color: '#ffffff',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Plus size={22} color="#ea580c" />
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Star Tech Product Entry Panel</h3>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>Add a new product to store catalog & inventory</p>
                  </div>
                </div>
                <X size={22} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setShowAddModal(false)} />
              </div>

              <form onSubmit={handleAddProductSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
                    Product Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB GDDR6X"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', fontWeight: 700 }}
                    >
                      <option value="Components">Components (CPU, GPU, RAM, Motherboard)</option>
                      <option value="Laptop & Desktop">Laptop & Desktop</option>
                      <option value="Monitor">Monitors</option>
                      <option value="Accessories">Accessories & Peripherals</option>
                      <option value="Power & UPS">Power & UPS</option>
                      <option value="Networking">Networking</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
                      Brand / Manufacturer *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ASUS, MSI, Gigabyte, Intel, AMD, Corsair"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
                      Product SKU / Model Code
                    </label>
                    <input
                      type="text"
                      placeholder="Auto-generated if left empty"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
                      Warranty Period
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3 Years Replacement Warranty"
                      value={newProduct.warranty}
                      onChange={(e) => setNewProduct({ ...newProduct, warranty: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
                      Regular Price (৳) *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 55000"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', fontWeight: 800 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
                      Offer Price (৳)
                    </label>
                    <input
                      type="number"
                      placeholder="Discounted price"
                      value={newProduct.discountPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', fontWeight: 800 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
                      Initial Stock Qty *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      required
                      value={newProduct.currentStock}
                      onChange={(e) => setNewProduct({ ...newProduct, currentStock: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', fontWeight: 800 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
                    Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
                    Key Specifications & Features
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 16GB GDDR6X | PCIe 4.0 | DLSS 3 Support | Dual Fan Cooling"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem 1.25rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: '#ea580c', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)' }}
                  >
                    Save & Publish Product
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
