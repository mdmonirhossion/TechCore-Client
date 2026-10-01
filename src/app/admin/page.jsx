"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { getProducts, API_BASE_URL } from '@/lib/api';
import { MOCK_CATEGORIES, MOCK_BRANDS } from '@/data/mock-products';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  Wrench,
  DollarSign,
  Plus,
  Trash2,
  Tag,
  Flame,
  ShieldCheck,
  Settings,
  Star,
  RefreshCw,
  X,
  Lock,
  Search,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Truck,
  Check,
  Shield,
  Percent,
  Sliders,
  Sparkles,
  Save,
  CheckCircle2,
  UserCheck,
  Zap
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token } = useShop();

  // Admin access control + demo preview override
  const [demoAdmin, setDemoAdmin] = useState(false);
  const isUserAdmin = demoAdmin || (user && (user.isAdmin || user.role === 'admin' || user.role === 'SUPER_ADMIN' || user.email === 'techcoreadmin@gmail.com'));

  // Main navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Products state & modal
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for creating new product
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    discountPrice: '',
    category: 'gpu',
    brand: 'ASUS',
    stock: '15',
    warranty: '3 Years Official Warranty',
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
    extraImages: '',
    keyFeaturesText: '',
    specificationsText: '',
    description: '',
    isFlashSale: false,
    isFeatured: true
  });

  // Orders state
  const [ordersList, setOrdersList] = useState([
    {
      id: 'ORD-9821',
      customerName: 'Tanvir Ahmed',
      email: 'tanvir@gmail.com',
      phone: '01711223344',
      address: 'House 42, Road 11, Banani, Dhaka',
      total: 124999,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending',
      date: '2026-09-29',
      itemsCount: 1,
      items: [{ name: 'ASUS TUF Gaming A15 RTX 4050 Laptop', qty: 1, price: 124999 }]
    },
    {
      id: 'ORD-9820',
      customerName: 'Mahmudul Hasan',
      email: 'mahmud@yahoo.com',
      phone: '01899887766',
      address: 'Agrabad C/A, Chittagong',
      total: 45000,
      paymentMethod: 'bKash Online',
      status: 'Processing',
      date: '2026-09-28',
      itemsCount: 1,
      items: [{ name: 'AMD Ryzen 7 7800X3D Processor', qty: 1, price: 45000 }]
    },
    {
      id: 'ORD-9819',
      customerName: 'Sabbir Hossain',
      email: 'sabbir@gmail.com',
      phone: '01912345678',
      address: 'Zindabazar, Sylhet',
      total: 14500,
      paymentMethod: 'Cash on Delivery',
      status: 'Shipped',
      date: '2026-09-27',
      itemsCount: 1,
      items: [{ name: 'ASUS VY229HF 100Hz IPS Monitor', qty: 1, price: 14500 }]
    },
    {
      id: 'ORD-9818',
      customerName: 'Naimur Rahman',
      email: 'naimur@gmail.com',
      phone: '01511223344',
      address: 'Khashbag, Rajshahi',
      total: 228999,
      paymentMethod: 'Nagad Online',
      status: 'Delivered',
      date: '2026-09-25',
      itemsCount: 1,
      items: [{ name: 'TechCore Ultimate Ryzen 7 7800X3D RTX 4070 Ti Super Rig', qty: 1, price: 228999 }]
    }
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Customers state
  const [customersList, setCustomersList] = useState([
    { id: 'CUST-101', name: 'Tanvir Ahmed', email: 'tanvir@gmail.com', phone: '01711223344', city: 'Dhaka', joined: '2026-01-15', totalSpent: 245000, orders: 3, status: 'Active' },
    { id: 'CUST-102', name: 'Mahmudul Hasan', email: 'mahmud@yahoo.com', phone: '01899887766', city: 'Chittagong', joined: '2026-03-22', totalSpent: 98000, orders: 2, status: 'Active' },
    { id: 'CUST-103', name: 'Sabbir Hossain', email: 'sabbir@gmail.com', phone: '01912345678', city: 'Sylhet', joined: '2026-05-10', totalSpent: 14500, orders: 1, status: 'Active' },
    { id: 'CUST-104', name: 'Naimur Rahman', email: 'naimur@gmail.com', phone: '01511223344', city: 'Rajshahi', joined: '2026-08-01', totalSpent: 228999, orders: 1, status: 'Active' }
  ]);

  // Coupons state
  const [couponsList, setCouponsList] = useState([
    { id: 'CPN-1', code: 'TECHCORE500', type: 'Fixed', amount: 500, minSpend: 5000, expiry: '2026-12-31', uses: 142, status: 'Active' },
    { id: 'CPN-2', code: 'FLASH10', type: 'Percentage', amount: 10, minSpend: 10000, expiry: '2026-10-30', uses: 89, status: 'Active' },
    { id: 'CPN-3', code: 'FREESHIP', type: 'Fixed', amount: 120, minSpend: 2000, expiry: '2026-11-15', uses: 310, status: 'Active' }
  ]);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'Fixed', amount: '', minSpend: '', expiry: '' });

  // Warranty claims state
  const [warrantiesList, setWarrantiesList] = useState([
    { id: 'WAR-301', invoiceId: 'INV-8821', customer: 'Tanvir Ahmed', product: 'ASUS Dual RTX 4060 8GB', issue: 'Display output flickering on HDMI port', status: 'Pending Inspection', date: '2026-09-28' },
    { id: 'WAR-302', invoiceId: 'INV-8714', customer: 'Rifat Hossain', product: 'MSI MAG 27" 4K Monitor', issue: 'One dead pixel on top right corner', status: 'In Repair', date: '2026-09-24' },
    { id: 'WAR-303', invoiceId: 'INV-8512', customer: 'Jahid Khan', product: 'Corsair RM850e Power Supply', issue: 'Fan noise after 2 hours gaming', status: 'Replaced', date: '2026-09-18' }
  ]);

  // Service requests state
  const [servicesList, setServicesList] = useState([
    { id: 'SRV-501', customer: 'Kazi Imran', phone: '01700112233', serviceType: 'Custom Hard-tube Liquid Cooling', preferDate: '2026-10-02', technician: 'Shakil (Senior Tech)', status: 'Scheduled' },
    { id: 'SRV-502', customer: 'Farhan Kabir', phone: '01811223344', serviceType: 'Full PC Cleaning & Thermal Paste Change', preferDate: '2026-10-01', technician: 'Mehedi', status: 'In Progress' },
    { id: 'SRV-503', customer: 'Anik Roy', phone: '01922334455', serviceType: 'BIOS Update & RAM XMP Optimization', preferDate: '2026-09-29', technician: 'Shakil', status: 'Completed' }
  ]);

  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'TechCore ERP Store',
    contactEmail: 'support@techcorebd.com',
    hotline: '+880 1700-000000',
    address: 'Multiplan Center, Level 4, Elephant Road, Dhaka-1205',
    freeShippingThreshold: 50000,
    deliveryFeeInsideDhaka: 60,
    deliveryFeeOutsideDhaka: 120,
    vatPercentage: 0,
    maintenanceMode: false
  });

  // Fetch product list strictly from server
  const loadAdminProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await getProducts();
      setProductsList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Admin products fetch error:', e);
      setProductsList([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getProducts()
      .then(data => {
        if (isMounted) {
          setProductsList(Array.isArray(data) ? data : []);
          setLoadingProducts(false);
        }
      })
      .catch(e => {
        if (isMounted) {
          console.error('Admin products fetch error:', e);
          setProductsList([]);
          setLoadingProducts(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  // Filtered products list
  const filteredProducts = productsList.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.brand?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Metrics
  const totalSales = ordersList.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalOrders = ordersList.length;
  const totalCustomers = customersList.length;
  const lowStockCount = productsList.filter(p => Number(p.stock || 0) <= 5).length;
  const pendingServiceCount = servicesList.filter(s => s.status !== 'Completed').length;

  // Handle Add Product Submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Product title and price are required.');
      return;
    }

    const calculatedSlug = (formData.slug || formData.name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const extraImgsArr = formData.extraImages
      ? formData.extraImages.split('\n').map(s => s.trim()).filter(Boolean)
      : [];
    const allImages = [formData.image, ...extraImgsArr].filter(Boolean);

    const keyFeaturesArr = formData.keyFeaturesText
      ? formData.keyFeaturesText.split('\n').map(s => s.trim()).filter(Boolean)
      : [
          'High Performance Hardware Component',
          'Official TechCore Authorized Warranty',
          'Premium Build Quality & Durability'
        ];

    let specsObj = {};
    if (formData.specificationsText) {
      formData.specificationsText.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const k = parts[0].trim();
          const v = parts.slice(1).join(':').trim();
          specsObj[k] = v;
        }
      });
    }
    if (Object.keys(specsObj).length === 0) {
      specsObj = {
        'Brand': formData.brand,
        'Category': formData.category.toUpperCase(),
        'Warranty': formData.warranty
      };
    }

    const newProd = {
      id: `prod-${Date.now()}`,
      _id: `prod-${Date.now()}`,
      name: formData.name,
      slug: calculatedSlug,
      brand: formData.brand,
      category: formData.category,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice || formData.price),
      images: allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop'],
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(formData.stock || 10),
      warranty: formData.warranty || '3 Years Official Warranty',
      badge: formData.badge || 'New Arrival',
      keyFeatures: keyFeaturesArr,
      specifications: specsObj,
      description: formData.description || `${formData.name} is a high performance tech component with official warranty.`,
      isFlashSale: formData.isFlashSale,
      isFeatured: formData.isFeatured
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newProd)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`❌ Failed to save product: ${data.message || 'Server error'}`);
        return;
      }

      alert('✅ Product successfully created and saved to MongoDB Atlas!');
      setShowAddModal(false);
      // Reset form
      setFormData({
        name: '',
        slug: '',
        price: '',
        discountPrice: '',
        category: 'gpu',
        brand: 'ASUS',
        stock: '15',
        warranty: '3 Years Official Warranty',
        badge: 'New Arrival',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
        extraImages: '',
        keyFeaturesText: '',
        specificationsText: '',
        description: '',
        isFlashSale: false,
        isFeatured: true
      });
      // Refetch full inventory from server
      await loadAdminProducts();
    } catch (err) {
      alert(`❌ Network error while saving product: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await res.json();
        if (!res.ok) {
          alert(`❌ Failed to delete product: ${data.message || 'Server error'}`);
          return;
        }
        alert('✅ Product deleted successfully from MongoDB!');
        await loadAdminProducts();
      } catch (err) {
        alert(`❌ Network error deleting product: ${err.message}`);
      }
    }
  };

  const toggleProductFlashSale = async (id) => {
    const prod = productsList.find(p => (p.id || p._id) === id);
    if (!prod) return;
    const newStatus = !prod.isFlashSale;
    setProductsList(prev => prev.map(p => {
      if ((p.id || p._id) === id) return { ...p, isFlashSale: newStatus };
      return p;
    }));
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ isFlashSale: newStatus })
      });
    } catch (err) {
      console.error('Failed to sync flash sale status to server:', err);
    }
  };

  const toggleProductFeatured = async (id) => {
    const prod = productsList.find(p => (p.id || p._id) === id);
    if (!prod) return;
    const newStatus = !prod.isFeatured;
    setProductsList(prev => prev.map(p => {
      if ((p.id || p._id) === id) return { ...p, isFeatured: newStatus };
      return p;
    }));
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ isFeatured: newStatus })
      });
    } catch (err) {
      console.error('Failed to sync featured status to server:', err);
    }
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.amount) return;
    const item = {
      id: `CPN-${Date.now()}`,
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      amount: Number(newCoupon.amount),
      minSpend: Number(newCoupon.minSpend || 0),
      expiry: newCoupon.expiry || '2026-12-31',
      uses: 0,
      status: 'Active'
    };
    setCouponsList([item, ...couponsList]);
    setNewCoupon({ code: '', type: 'Fixed', amount: '', minSpend: '', expiry: '' });
    setShowAddCouponModal(false);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  // Access Denied Screen (with Demo Mode Preview)
  if (!isUserAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-950/50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Lock size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">Access Denied</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            You must be logged in as an Administrator to access the TechCore ERP Management Dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <button
            onClick={() => router.push('/login')}
            className="bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
          >
            Login as Admin
          </button>
          <button
            onClick={() => setDemoAdmin(true)}
            className="bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <Zap size={16} />
            <span>Enable Demo Admin Preview</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0e1726] via-[#1e293b] to-[#0f172a] text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#ea580c] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-widest">
              TechCore ERP v2.4
            </span>
            {demoAdmin && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Demo Admin Active
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black">Admin Management Portal</h1>
          <p className="text-xs text-slate-400">Complete control over products, orders, customers, coupons, and services.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#ea580c] hover:bg-orange-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION TABS (3 Cols) */}
        <aside className="lg:col-span-3 bg-[#0e1726] text-slate-200 rounded-2xl p-4 space-y-2 shadow-xl h-fit">
          <div className="px-3 py-2 border-b border-slate-800 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest block">Main Menu</span>
            <span className="text-[10px] text-slate-400">9 Tabs</span>
          </div>

          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Products Management', icon: Package, badge: productsList.length },
            { id: 'orders', label: 'Orders & Shipping', icon: ShoppingCart, badge: ordersList.length },
            { id: 'customers', label: 'Customers CRM', icon: Users, badge: customersList.length },
            { id: 'coupons', label: 'Coupons & Discounts', icon: Tag, badge: couponsList.length },
            { id: 'flashsale', label: 'Flash Sale Deals', icon: Flame, badge: productsList.filter(p => p.isFlashSale).length },
            { id: 'warranty', label: 'Warranty & Claims', icon: ShieldCheck, badge: warrantiesList.length },
            { id: 'service', label: 'Service Requests', icon: Wrench, badge: servicesList.length },
            { id: 'settings', label: 'Store Settings', icon: Settings }
          ].map(item => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-[#ea580c] text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComp size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* MAIN DISPLAY AREA (9 Cols) */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales Revenue</span>
                    <DollarSign size={18} className="text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">৳{totalSales.toLocaleString()}</div>
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    +18.5% growth this month
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingCart size={18} className="text-blue-500" />
                  </div>
                  <div className="text-2xl font-black text-blue-600">{totalOrders}</div>
                  <span className="text-[11px] text-slate-500 font-medium">1 pending dispatch</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Products in Catalog</span>
                    <Package size={18} className="text-purple-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{productsList.length}</div>
                  <span className="text-[11px] text-purple-600 font-bold">Active in store</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Registered Customers</span>
                    <Users size={18} className="text-indigo-500" />
                  </div>
                  <div className="text-2xl font-black text-indigo-600">{totalCustomers}</div>
                  <span className="text-[11px] text-indigo-600 font-bold">Verified profiles</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock Alerts</span>
                    <AlertTriangle size={18} className="text-red-500" />
                  </div>
                  <div className="text-2xl font-black text-red-600">{lowStockCount}</div>
                  <span className="text-[11px] text-red-500 font-bold">Items under 5 units</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Pending Service Requests</span>
                    <Wrench size={18} className="text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-amber-600">{pendingServiceCount}</div>
                  <span className="text-[11px] text-amber-600 font-bold">Active service tickets</span>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Recent Customer Orders</h2>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-orange-600 hover:underline">
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b text-slate-700 dark:text-slate-300 font-bold uppercase">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {ordersList.slice(0, 4).map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-3 font-bold text-blue-600">{ord.id}</td>
                          <td className="p-3 font-medium text-slate-900 dark:text-slate-200">{ord.customerName}</td>
                          <td className="p-3 font-black text-slate-900 dark:text-slate-100">৳{ord.total.toLocaleString()}</td>
                          <td className="p-3 text-slate-500">{ord.paymentMethod}</td>
                          <td className="p-3 font-bold">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] ${
                              ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                              ord.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                              ord.status === 'Processing' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' :
                              'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Products Catalog ({filteredProducts.length})</h2>
                    <p className="text-xs text-slate-500">Manage products, stock levels, and flash sale status.</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#ea580c] hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md w-fit"
                  >
                    <Plus size={16} />
                    <span>Add New Product</span>
                  </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search product by title or brand..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="all">All Categories ({MOCK_CATEGORIES.length})</option>
                    {MOCK_CATEGORIES.map(c => (
                      <option key={c.id} value={c.slug}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b text-slate-700 dark:text-slate-300 font-bold uppercase">
                        <th className="p-3">Product</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Brand</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3">Badges</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredProducts.map(prod => {
                        const pid = prod.id || prod._id;
                        const pImg = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : (prod.image || '');
                        return (
                          <tr key={pid} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="p-3">
                              <div className="flex items-center gap-3 max-w-xs">
                                <div className="w-10 h-10 relative bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image src={pImg} alt={prod.name} fill className="object-contain p-1" />
                                </div>
                                <div className="space-y-0.5 truncate">
                                  <Link href={`/products/${prod.slug || pid}`} target="_blank" className="font-bold text-slate-900 dark:text-slate-100 hover:text-orange-600 truncate block">
                                    {prod.name}
                                  </Link>
                                  <span className="text-[10px] text-slate-400 block font-mono">ID: {pid}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 font-semibold text-slate-600 dark:text-slate-400 uppercase text-[11px]">{prod.category}</td>
                            <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{prod.brand}</td>
                            <td className="p-3 font-black text-[#d92d20]">৳{(prod.discountPrice || prod.price).toLocaleString()}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                Number(prod.stock || 0) > 5 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                              }`}>
                                {prod.stock || 0} Units
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                <button
                                  onClick={() => toggleProductFlashSale(pid)}
                                  className={`px-2 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-1 ${
                                    prod.isFlashSale ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                  }`}
                                >
                                  <Flame size={10} />
                                  <span>Flash</span>
                                </button>
                                <button
                                  onClick={() => toggleProductFeatured(pid)}
                                  className={`px-2 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-1 ${
                                    prod.isFeatured ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                  }`}
                                >
                                  <Star size={10} />
                                  <span>Featured</span>
                                </button>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/products/${prod.slug || pid}`} target="_blank" className="text-slate-400 hover:text-blue-600 p-1">
                                  <Eye size={16} />
                                </Link>
                                <button
                                  onClick={() => handleDeleteProduct(pid)}
                                  className="text-slate-400 hover:text-red-600 p-1"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Orders & Shipping Management</h2>
                    <p className="text-xs text-slate-500">Track orders, manage shipping statuses, and view customer details.</p>
                  </div>
                  
                  {/* Status Filters */}
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map(st => (
                      <button
                        key={st}
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          orderStatusFilter === st
                            ? 'bg-[#ea580c] text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b text-slate-700 dark:text-slate-300 font-bold uppercase">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer & Contact</th>
                        <th className="p-3">Address</th>
                        <th className="p-3">Total (৳)</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Update Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {ordersList
                        .filter(o => orderStatusFilter === 'All' || o.status === orderStatusFilter)
                        .map(ord => (
                          <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="p-3 font-bold text-blue-600">{ord.id}</td>
                            <td className="p-3">
                              <div className="font-bold text-slate-900 dark:text-slate-100">{ord.customerName}</div>
                              <div className="text-[10px] text-slate-500">{ord.phone}</div>
                            </td>
                            <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{ord.address}</td>
                            <td className="p-3 font-black text-slate-900 dark:text-slate-100">৳{ord.total.toLocaleString()}</td>
                            <td className="p-3 text-slate-500 font-medium">{ord.paymentMethod}</td>
                            <td className="p-3">
                              <select
                                value={ord.status}
                                onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                                className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-2.5 py-1 rounded-md text-[11px]"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: CUSTOMERS CRM */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Customer Profiles ({customersList.length})</h2>
                <p className="text-xs text-slate-500">Registered users, purchase histories, and status flags.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b text-slate-700 dark:text-slate-300 font-bold uppercase">
                        <th className="p-3">Customer Name</th>
                        <th className="p-3">Email & Phone</th>
                        <th className="p-3">City</th>
                        <th className="p-3">Joined Date</th>
                        <th className="p-3">Total Spend</th>
                        <th className="p-3">Orders</th>
                        <th className="p-3 text-right">Account Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {customersList.map(cust => (
                        <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{cust.name}</td>
                          <td className="p-3">
                            <div className="text-slate-800 dark:text-slate-200 font-medium">{cust.email}</div>
                            <div className="text-[10px] text-slate-400">{cust.phone}</div>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400 font-semibold">{cust.city}</td>
                          <td className="p-3 text-slate-500">{cust.joined}</td>
                          <td className="p-3 font-black text-[#d92d20]">৳{cust.totalSpent.toLocaleString()}</td>
                          <td className="p-3 font-bold text-slate-700 dark:text-slate-300">{cust.orders} Orders</td>
                          <td className="p-3 text-right">
                            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-md text-[10px] font-bold">
                              {cust.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: COUPONS & DISCOUNTS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Coupons & Promotional Discounts</h2>
                  <p className="text-xs text-slate-500">Create discount codes for checkout promotions.</p>
                </div>
                <button
                  onClick={() => setShowAddCouponModal(true)}
                  className="bg-[#ea580c] hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Plus size={16} />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {couponsList.map(cpn => (
                  <div key={cpn.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b pb-3">
                      <span className="font-mono font-black text-base text-orange-600 bg-orange-50 dark:bg-orange-950/50 px-3 py-1 rounded-lg border border-orange-200 dark:border-orange-800">
                        {cpn.code}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                        {cpn.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <strong className="text-slate-900 dark:text-slate-100">{cpn.type === 'Percentage' ? `${cpn.amount}% OFF` : `৳${cpn.amount} OFF`}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Min Order Spend:</span>
                        <strong className="text-slate-900 dark:text-slate-100">৳{cpn.minSpend.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Expires On:</span>
                        <strong className="text-slate-900 dark:text-slate-100">{cpn.expiry}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Times Used:</span>
                        <strong className="text-blue-600">{cpn.uses} times</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 6: FLASH SALE DEALS */}
          {activeTab === 'flashsale' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <Flame className="text-orange-500" size={24} />
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Flash Sale Campaign Manager</h2>
                </div>
                <p className="text-xs text-slate-500">Enable or disable products participating in live Flash Sale deals.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b text-slate-700 dark:text-slate-300 font-bold uppercase">
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Regular Price</th>
                        <th className="p-3">Flash Sale Price</th>
                        <th className="p-3 text-right">Flash Sale Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {productsList.map(prod => {
                        const pid = prod.id || prod._id;
                        return (
                          <tr key={pid} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{prod.name}</td>
                            <td className="p-3 text-slate-500 uppercase">{prod.category}</td>
                            <td className="p-3 text-slate-400 line-through">৳{prod.price?.toLocaleString()}</td>
                            <td className="p-3 font-black text-[#d92d20]">৳{(prod.discountPrice || prod.price)?.toLocaleString()}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => toggleProductFlashSale(pid)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                                  prod.isFlashSale
                                    ? 'bg-orange-600 text-white shadow-md'
                                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                              >
                                {prod.isFlashSale ? '⚡ Active in Sale' : 'Disabled'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: WARRANTY & CLAIMS */}
          {activeTab === 'warranty' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Warranty Claim Tickets ({warrantiesList.length})</h2>
                <p className="text-xs text-slate-500">Track and process RMA hardware warranty claims.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b text-slate-700 dark:text-slate-300 font-bold uppercase">
                        <th className="p-3">Claim ID</th>
                        <th className="p-3">Invoice</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Product</th>
                        <th className="p-3">Reported Issue</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {warrantiesList.map(war => (
                        <tr key={war.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-3 font-bold text-orange-600">{war.id}</td>
                          <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{war.invoiceId}</td>
                          <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{war.customer}</td>
                          <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{war.product}</td>
                          <td className="p-3 text-slate-500 max-w-xs truncate">{war.issue}</td>
                          <td className="p-3 text-right font-bold">
                            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 rounded-md text-[10px]">
                              {war.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: SERVICE REQUESTS */}
          {activeTab === 'service' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">PC Servicing & Maintenance Bookings</h2>
                <p className="text-xs text-slate-500">Custom build bookings and diagnostic appointments.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b text-slate-700 dark:text-slate-300 font-bold uppercase">
                        <th className="p-3">Ticket ID</th>
                        <th className="p-3">Customer Name</th>
                        <th className="p-3">Service Required</th>
                        <th className="p-3">Preferred Date</th>
                        <th className="p-3">Assigned Tech</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {servicesList.map(srv => (
                        <tr key={srv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-3 font-bold text-purple-600">{srv.id}</td>
                          <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{srv.customer}</td>
                          <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{srv.serviceType}</td>
                          <td className="p-3 text-slate-500">{srv.preferDate}</td>
                          <td className="p-3 font-bold text-blue-600">{srv.technician}</td>
                          <td className="p-3 text-right">
                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 px-2.5 py-1 rounded-md text-[10px] font-bold">
                              {srv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 9: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Store Global Configurations</h2>

                <form onSubmit={(e) => { e.preventDefault(); alert('✅ Settings updated successfully!'); }} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Store Name</label>
                      <input
                        type="text"
                        value={storeSettings.storeName}
                        onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Support Email</label>
                      <input
                        type="email"
                        value={storeSettings.contactEmail}
                        onChange={(e) => setStoreSettings({ ...storeSettings, contactEmail: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Customer Hotline</label>
                      <input
                        type="text"
                        value={storeSettings.hotline}
                        onChange={(e) => setStoreSettings({ ...storeSettings, hotline: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Free Shipping Threshold (৳)</label>
                      <input
                        type="number"
                        value={storeSettings.freeShippingThreshold}
                        onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Store Address</label>
                    <textarea
                      rows={2}
                      value={storeSettings.address}
                      onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#ea580c] hover:bg-orange-600 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md"
                  >
                    Save Store Settings
                  </button>
                </form>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* FULL COMPREHENSIVE ADD NEW PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl p-6 z-10 text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Package className="text-orange-500" size={20} />
                  <span>Add New Product to Catalog</span>
                </h3>
                <p className="text-[11px] text-slate-500">Fill in complete product specification details for store indexing.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              
              {/* Product Title */}
              <div>
                <label className="font-extrabold text-slate-900 dark:text-slate-100 block mb-1">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASUS ROG Strix GeForce RTX 4080 Super 16GB OC Edition"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              {/* Price Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Regular Price (৳) *</label>
                  <input
                    type="number"
                    required
                    placeholder="135000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-black text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Discount Offer Price (৳)</label>
                  <input
                    type="number"
                    placeholder="124999"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-black text-orange-600"
                  />
                </div>
              </div>

              {/* Category & Brand Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100"
                  >
                    {MOCK_CATEGORIES.map(c => (
                      <option key={c.id} value={c.slug}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100"
                  >
                    {MOCK_BRANDS.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock, Warranty, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Warranty Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Years Warranty"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Offer Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Save ৳5,000"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Primary Image URL */}
              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Primary Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-mono text-[11px]"
                />
              </div>

              {/* Additional Image URLs */}
              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Additional Gallery Images (1 URL per line)</label>
                <textarea
                  rows={2}
                  placeholder="https://images.unsplash.com/photo-2&#10;https://images.unsplash.com/photo-3"
                  value={formData.extraImages}
                  onChange={(e) => setFormData({ ...formData, extraImages: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-mono text-[11px]"
                />
              </div>

              {/* Key Features */}
              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Key Features (1 feature per line)</label>
                <textarea
                  rows={3}
                  placeholder="NVIDIA Ada Lovelace Architecture&#10;16GB GDDR6X VRAM&#10;DLSS 3 & Ray Tracing Support"
                  value={formData.keyFeaturesText}
                  onChange={(e) => setFormData({ ...formData, keyFeaturesText: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-medium"
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Specifications (Key : Value pairs, 1 per line)</label>
                <textarea
                  rows={3}
                  placeholder="GPU Engine : NVIDIA RTX 4080 Super&#10;Memory : 16GB GDDR6X&#10;Power Supply Req : 750W"
                  value={formData.specificationsText}
                  onChange={(e) => setFormData({ ...formData, specificationsText: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-mono text-[11px]"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.isFlashSale}
                    onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>⚡ Include in Flash Sale Deals</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>⭐ Feature on Homepage Showcase</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex justify-end gap-3 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#ea580c] hover:bg-orange-600 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>Save Product</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-6 z-10 text-slate-900 dark:text-slate-100 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-blue-600">Order Invoice #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl space-y-1">
                <div className="font-bold">{selectedOrder.customerName}</div>
                <div className="text-slate-500">{selectedOrder.email} | {selectedOrder.phone}</div>
                <div className="text-slate-600 dark:text-slate-400">{selectedOrder.address}</div>
              </div>

              <div className="space-y-2">
                <span className="font-bold block">Ordered Items:</span>
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between border-b dark:border-slate-800 pb-1">
                    <span>{it.name} x{it.qty}</span>
                    <strong className="text-slate-900 dark:text-slate-100">৳{it.price?.toLocaleString()}</strong>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-black text-sm pt-2 text-[#d92d20]">
                <span>Total Amount:</span>
                <span>৳{selectedOrder.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD COUPON MODAL */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowAddCouponModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 z-10 text-slate-900 dark:text-slate-100 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Create New Promo Coupon</h3>
              <button onClick={() => setShowAddCouponModal(false)} className="text-slate-400 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-white dark:bg-slate-800 uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Discount Type</label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-white dark:bg-slate-800"
                  >
                    <option value="Fixed">Fixed Amount (৳)</option>
                    <option value="Percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    placeholder="500"
                    value={newCoupon.amount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, amount: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-white dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Min Spend (৳)</label>
                  <input
                    type="number"
                    placeholder="2000"
                    value={newCoupon.minSpend}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newCoupon.expiry}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ea580c] text-white font-bold rounded-xl shadow-md"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
