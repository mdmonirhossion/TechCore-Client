"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { Lock, Mail, User, KeyRound, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useShop();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://techcore-server.vercel.app';
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Authentication failed. Please check your credentials.');
      }

      // Save real JWT token and user object returned by server
      const token = data.token;
      const userData = data.user || { name: name || email.split('@')[0], email, role: 'customer' };

      if (!token) {
        throw new Error('No authentication token received from server.');
      }

      try {
        localStorage.setItem('techcore_token', token);
        localStorage.setItem('techcore_user', JSON.stringify(userData));
      } catch (e) {
        console.error('LocalStorage error:', e);
      }

      loginUser(userData, token);

      // Redirect to Admin Dashboard if admin role, else Account page
      const isAdmin = userData.role === 'SUPER_ADMIN' || userData.role === 'ADMIN' || userData.isAdmin || userData.email === 'techcoreadmin@gmail.com';
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch (err) {
      console.error('Auth submit error:', err);
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-orange-50 text-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#081621]">
            {isRegister ? 'Create Account' : 'Sign In'}
          </h1>
          <p className="text-xs text-gray-500">Access your admin dashboard, orders, and warranty tickets</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 text-red-600" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Admin User"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3 pl-10 border rounded-xl focus:outline-none focus:border-[#3749bb]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-3 pl-10 border rounded-xl focus:outline-none focus:border-[#3749bb]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-3 pl-10 border rounded-xl focus:outline-none focus:border-[#3749bb]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ea580c] hover:bg-[#d97706] text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50 text-xs uppercase"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-gray-500">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegister(false)} className="text-[#3749bb] font-bold hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{' '}
              <button onClick={() => setIsRegister(true)} className="text-[#3749bb] font-bold hover:underline">
                Create One
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
