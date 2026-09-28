"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  Edit, 
  Package, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  Search,
  DollarSign
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token } = useShop();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    stock: '10',
    category: 'Component',
    brand: 'ASUS',
    badge: 'New Arrival',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop',
    keyFeatures: '8GB GDDR6 128-bit\nPCIe 4.0 Support\nDual Axial-tech Fans'
  });

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('techcore_token') || token || '';
    }
    return token || '';
  };

  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    const authToken = getAuthToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://techcore-server.vercel.app';

    if (!authToken) {
      setError('No admin authentication token found. Please sign in as admin first.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/admin/inventory`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        // Fallback to public products endpoint if admin inventory endpoint fails
        const fallbackRes = await fetch(`${apiUrl}/api/products`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        if (!fallbackRes.ok) {
          throw new Error(`Failed to fetch inventory (${res.status} ${res.statusText})`);
        }
        const fallbackData = await fallbackRes.json();
        setProducts(Array.isArray(fallbackData) ? fallbackData : (fallbackData.products || []));
      } else {
        const data = await res.json();
        const rawList = Array.isArray(data) ? data : (data.inventory || data.products || []);
        
        // Map products ensuring price, discountPrice, stock, and image are cleanly parsed
        const normalizedList = rawList.map(item => ({
          ...item,
          id: item.id || item._id,
          name: item.name || 'Unnamed Product',
          price: Number(item.price || item.discountPrice || 0),
          discountPrice: Number(item.discountPrice || item.price || 0),
          stock: Number(item.stock ?? item.currentStock ?? 0),
          image: (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : (item.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'))
        }));

        setProducts(normalizedList);
      }
    } catch (err) {
      console.error('Fetch inventory error:', err);
      setError(err.message || 'Error loading inventory data from MongoDB backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authorization token missing. Please sign in again.');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://techcore-server.vercel.app';

    // Aligned Mongoose Schema payload (stock & images array)
    const productPayload = {
      name: formData.name,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice || formData.price),
      stock: Number(formData.stock),
      images: [formData.imageUrl],
      category: formData.category,
      brand: formData.brand,
      badge: formData.badge,
      keyFeatures: formData.keyFeatures.split('\n').filter(Boolean)
    };

    try {
      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(productPayload)
      });

      const serverData = await res.json();

      if (!res.ok) {
        throw new Error(serverData.message || serverData.error || `Server responded with ${res.status}`);
      }

      // Check returned server object
      const savedProduct = serverData.product || serverData || productPayload;
      const normalizedSaved = {
        ...savedProduct,
        id: savedProduct.id || savedProduct._id || `p-${Date.now()}`,
        name: savedProduct.name || formData.name,
        price: Number(savedProduct.price || formData.price),
        discountPrice: Number(savedProduct.discountPrice || formData.discountPrice),
        stock: Number(savedProduct.stock ?? formData.stock),
        image: (Array.isArray(savedProduct.images) && savedProduct.images.length > 0 ? savedProduct.images[0] : formData.imageUrl)
      };

      // Real state update with backend MongoDB response (No localstorage caching)
      setProducts(prev => [normalizedSaved, ...prev]);
      setSuccessMsg(`Product "${formData.name}" successfully added to MongoDB database!`);
      setShowAddModal(false);
      setFormData({
        name: '',
        price: '',
        discountPrice: '',
        stock: '10',
        category: 'Component',
        brand: 'ASUS',
        badge: 'New Arrival',
        imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop',
        keyFeatures: '8GB GDDR6 128-bit\nPCIe 4.0 Support'
      });
    } catch (err) {
      console.error('Add product failed:', err);
      setError(`Failed to save product to database: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}" from MongoDB?`)) return;

    const authToken = getAuthToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://techcore-server.vercel.app';

    try {
      const res = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        const adminRes = await fetch(`${apiUrl}/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        if (!adminRes.ok) {
          throw new Error('Delete failed on server.');
        }
      }

      setProducts(prev => prev.filter(p => (p.id || p._id) !== productId));
      setSuccessMsg(`Product "${productName}" deleted from database.`);
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Error deleting product: ${err.message}`);
    }
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#081621] text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-[#ea580c] text-white rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black">ERP Admin Dashboard</h1>
            <p className="text-xs text-gray-300">Live Inventory & Product Persistence Management (MongoDB)</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchInventory}
            className="flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-[#ea580c] hover:bg-[#d97706] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <Link href="/login" className="bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
            Sign In Again
          </Link>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="font-extrabold text-base text-[#081621] flex items-center">
            <Package className="w-5 h-5 mr-2 text-[#3749bb]" /> Inventory List ({products.length} Products)
          </h2>
          <span className="text-xs text-gray-500">
            Real Backend MongoDB Data
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 space-y-3">
            <RefreshCw className="w-8 h-8 text-[#ea580c] animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-semibold">Fetching MongoDB inventory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-700 font-bold uppercase text-[11px]">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Price (৳)</th>
                  <th className="p-3">Discount Price (৳)</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const pId = product.id || product._id;
                  return (
                    <tr key={pId} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-lg bg-gray-50 border overflow-hidden flex-shrink-0">
                            <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                          </div>
                          <span className="font-bold text-[#081621] line-clamp-1 max-w-xs">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-gray-600">{product.category || 'Component'}</td>
                      <td className="p-3 font-semibold text-gray-600">{product.brand || 'ASUS'}</td>
                      <td className="p-3 font-extrabold text-[#081621]">
                        ৳{Number(product.price || 0).toLocaleString()}
                      </td>
                      <td className="p-3 font-extrabold text-[#ea580c]">
                        ৳{Number(product.discountPrice || product.price || 0).toLocaleString()}
                      </td>
                      <td className="p-3 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          product.stock > 0 ? 'bg-green-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} Units
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(pId, product.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-xl">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-extrabold text-base text-[#081621]">Add Product to MongoDB</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASUS Dual GeForce RTX 4060 OC 8GB"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Regular Price (৳) *</label>
                  <input
                    type="number"
                    required
                    placeholder="43500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount Price (৳) *</label>
                  <input
                    type="number"
                    required
                    placeholder="39999"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Stock Units *</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control bg-white"
                  >
                    <option value="Component">Component</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop PC</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="form-control bg-white"
                  >
                    <option value="ASUS">ASUS</option>
                    <option value="MSI">MSI</option>
                    <option value="Intel">Intel</option>
                    <option value="AMD">AMD</option>
                    <option value="Gigabyte">Gigabyte</option>
                    <option value="Corsair">Corsair</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Key Features (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="8GB GDDR6&#10;PCIe 4.0 Support&#10;Dual Axial Fans"
                  value={formData.keyFeatures}
                  onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ea580c] hover:bg-[#d97706] text-white text-xs font-extrabold rounded-lg shadow-md"
                >
                  Save to MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
