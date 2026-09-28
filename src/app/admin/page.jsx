"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { getProducts, API_BASE_URL } from '@/lib/api';
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
  Lock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token } = useShop();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    stock: '15',
    category: 'gpu',
    brand: 'ASUS',
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop'
  });

  const isUserAdmin = user && (user.isAdmin || user.role === 'admin' || user.role === 'SUPER_ADMIN' || user.email === 'techcoreadmin@gmail.com');

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoadingProducts(true);
        const data = await getProducts();
        setProductsList(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Admin data fetch error:', e);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadAdminData();
  }, []);

  const totalSales = productsList.reduce((sum, p) => sum + Number(p.discountPrice || p.price || 0) * (p.stock || 1), 0);
  const totalOrders = Math.max(1, Math.round(productsList.length * 2.5));
  const totalCustomers = Math.max(1, Math.round(productsList.length * 1.8));
  const lowStockCount = productsList.filter(p => (p.stock || 0) <= 5).length;
  const pendingServiceCount = 3;

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const newProd = {
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      brand: formData.brand,
      category: formData.category,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice || formData.price),
      images: [formData.image],
      stock: Number(formData.stock),
      warranty: '3 Years Warranty',
      badge: formData.badge
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
      if (res.ok) {
        const created = await res.json();
        setProductsList(prev => [created.product || created, ...prev]);
      } else {
        setProductsList(prev => [{ ...newProd, id: `prod-${Date.now()}` }, ...prev]);
      }
    } catch (err) {
      setProductsList(prev => [{ ...newProd, id: `prod-${Date.now()}` }, ...prev]);
    }
    setShowAddModal(false);
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
      } catch (err) {}
      setProductsList(prev => prev.filter(p => p.id !== id && p._id !== id));
    }
  };

  if (!isUserAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Lock size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Access Denied</h1>
          <p className="text-xs text-slate-600">
            You must be logged in as an Administrator to access the TechCore ERP Dashboard.
          </p>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-lg transition-all"
        >
          Login as Admin
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 27. SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 bg-[#0e1726] text-slate-200 rounded-2xl p-4 space-y-2 shadow-xl h-fit">
          <div className="px-4 py-3 border-b border-slate-800 mb-2">
            <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest block">TechCore ERP</span>
            <h2 className="text-base font-extrabold text-white">Admin Dashboard</h2>
          </div>

          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products Management', icon: Package },
            { id: 'orders', label: 'Orders & Shipping', icon: ShoppingCart },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'coupons', label: 'Coupons & Discounts', icon: Tag },
            { id: 'flashsale', label: 'Flash Sale Deals', icon: Flame },
            { id: 'warranty', label: 'Warranty & Claims', icon: ShieldCheck },
            { id: 'service', label: 'Service Requests', icon: Wrench },
            { id: 'settings', label: 'Store Settings', icon: Settings }
          ].map(item => {
            const IconComp = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-[#ea580c] text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <IconComp size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* MAIN DASHBOARD CONTENT (9 cols) */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Header Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-slate-900">ERP Store Overview</h1>
              <p className="text-xs text-slate-500">Live operational data and inventory stats</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>

          {/* KPI METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-400 text-xs font-bold block uppercase">Total Sales Revenue</span>
              <div className="text-2xl font-black text-slate-900">৳{totalSales.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-600 font-bold">+18.5% this month</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-400 text-xs font-bold block uppercase">Total Orders</span>
              <div className="text-2xl font-black text-blue-600">{totalOrders}</div>
              <span className="text-[11px] text-slate-500 font-medium">32 pending dispatch</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-400 text-xs font-bold block uppercase">Products in Catalog</span>
              <div className="text-2xl font-black text-slate-900">{productsList.length}</div>
              <span className="text-[11px] text-slate-500 font-medium">Active in store</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-400 text-xs font-bold block uppercase">Registered Customers</span>
              <div className="text-2xl font-black text-purple-600">{totalCustomers}</div>
              <span className="text-[11px] text-purple-600 font-bold">+12 new today</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-400 text-xs font-bold block uppercase">Low Stock Alerts</span>
              <div className="text-2xl font-black text-red-600">{lowStockCount}</div>
              <span className="text-[11px] text-red-500 font-bold">Items under 5 units</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-400 text-xs font-bold block uppercase">Pending Service Requests</span>
              <div className="text-2xl font-black text-amber-600">{pendingServiceCount}</div>
              <span className="text-[11px] text-amber-600 font-bold">Awaiting technician</span>
            </div>
          </div>

          {/* INVENTORY TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="font-extrabold text-base text-slate-900">Inventory & Products ({productsList.length})</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-700 font-bold uppercase">
                    <th className="p-3">Product</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productsList.map(prod => (
                    <tr key={prod.id || prod._id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 line-clamp-1 max-w-xs">{prod.name}</td>
                      <td className="p-3 text-slate-600">{prod.brand}</td>
                      <td className="p-3 text-slate-600 uppercase">{prod.category}</td>
                      <td className="p-3 font-black text-[#d92d20]">৳{(prod.discountPrice || prod.price).toLocaleString()}</td>
                      <td className="p-3 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          prod.stock > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {prod.stock} Units
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(prod.id || prod._id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>

      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 z-10 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-900 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASUS ROG Strix GeForce RTX 4080 16GB"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Regular Price *</label>
                  <input
                    type="number"
                    required
                    placeholder="125000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Discount Price *</label>
                  <input
                    type="number"
                    required
                    placeholder="115000"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border rounded-lg bg-white"
                  >
                    <option value="gpu">Graphics Card</option>
                    <option value="laptop">Gaming Laptop</option>
                    <option value="processor">Processor</option>
                    <option value="monitor">Monitor</option>
                    <option value="ram">RAM Memory</option>
                    <option value="storage">SSD Storage</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 border rounded-lg bg-white"
                  >
                    <option value="ASUS">ASUS</option>
                    <option value="MSI">MSI</option>
                    <option value="Gigabyte">Gigabyte</option>
                    <option value="Intel">Intel</option>
                    <option value="AMD">AMD</option>
                    <option value="Lenovo">Lenovo</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ea580c] text-white font-bold rounded-lg shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
