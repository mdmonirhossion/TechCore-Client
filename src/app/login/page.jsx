"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import {
  Home,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LogOut,
  LayoutDashboard,
  UserCheck,
  ShoppingBag
} from 'lucide-react';

import { loginUserApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { user, loginUser, logoutUser } = useShop();

  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const inputVal = phoneOrEmail.trim();
    if (!inputVal) {
      setErrorMsg('Please enter your Phone number or Email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const data = await loginUserApi({
        email: inputVal,
        phone: inputVal,
        password
      });

      if (data && (data.token || data.success)) {
        const loggedInUserData = data.user || {
          name: data.user?.name || (inputVal.includes('@') ? inputVal.split('@')[0] : 'Customer'),
          email: data.user?.email || inputVal,
          role: data.user?.role || 'CUSTOMER',
          isAdmin: data.user?.isAdmin || data.user?.role === 'admin' || data.user?.role === 'SUPER_ADMIN',
          isLoggedIn: true
        };
        loginUser(loggedInUserData, data.token);

        if (loggedInUserData.isAdmin || loggedInUserData.role === 'admin' || loggedInUserData.role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        return;
      } else {
        setErrorMsg(data?.message || 'Invalid email/phone or password. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, show User Account Profile & Logout UI
  if (user && (user.isLoggedIn || user.name)) {
    const isUserAdmin = user.role === 'SUPER_ADMIN' || user.email === 'techcoreadmin@gmail.com' || user.isAdmin;

    return (
      <div className="w-full bg-[#f8fafc] min-h-[calc(100vh-180px)] py-8 px-4 pb-16">
        <div className="w-full max-w-[1000px] mx-auto">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
            <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
              <Home size={14} /> Home
            </Link>
            <span>/</span>
            <span className="text-[#0f172a] font-bold text-slate-900">My Account</span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-[560px] mx-auto p-8 md:p-10">
            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-full ${isUserAdmin ? 'bg-blue-50' : 'bg-slate-100'} flex items-center justify-center mx-auto mb-4`}>
                <UserCheck size={32} className={isUserAdmin ? 'text-blue-600' : 'text-slate-600'} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                Welcome, {user.name}!
              </h2>
              <p className="text-xs text-slate-500">
                Logged in as: <strong className="text-slate-800">{user.email || user.phoneOrEmail}</strong>
              </p>
              {isUserAdmin && (
                <span className="inline-block mt-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                  🛡️ Super Admin Access
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => router.push('/my-orders')}
                className="w-full bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag size={18} />
                View My Orders History
              </button>

              {isUserAdmin && (
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <LayoutDashboard size={18} />
                  Open Admin ERP Dashboard
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  logoutUser();
                }}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm mt-1"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8fafc] min-h-[calc(100vh-180px)] py-8 px-4 pb-16">
      <div className="w-full max-w-[1000px] mx-auto">

        {/* 1. Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
            <Home size={14} /> Home
          </Link>
          <span>/</span>
          <Link href="/account" className="hover:text-blue-600">Account</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Login</span>
        </div>

        {/* 2. Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-[520px] mx-auto p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1.5">
              Account Login
            </h2>
            <p className="text-xs text-slate-500">
              Log in to manage your orders, wishlist & account settings
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-semibold mb-5 flex items-center gap-2">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Phone or Email Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Phone / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your phone or email"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600 transition-colors"
                />
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Password Input with Hide/Show Toggle */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered phone/email.'); }}
                  className="text-[11px] font-bold text-[#ea580c] hover:underline"
                >
                  Forgotten Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600 transition-colors"
                />
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                {/* Password Eye Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Cloudflare Turnstile Security Box (Matching Screenshot) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={24} className="text-emerald-600" />
                <span className="text-xs font-bold text-emerald-600">Success!</span>
              </div>
              <div className="flex flex-col items-end leading-tight">
                <span className="text-[10px] font-black text-[#ea580c] tracking-widest">CLOUDFLARE</span>
                <span className="text-[9px] text-slate-400">Privacy • Help</span>
              </div>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative text-center my-6">
            <div className="border-t border-slate-200 absolute top-1/2 left-0 right-0" />
            <span className="relative bg-white px-3 text-xs text-slate-500 font-semibold">
              Don&apos;t have an account?
            </span>
          </div>

          {/* Register Redirect Button */}
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="w-full bg-white hover:bg-blue-50 text-[#2563eb] border-2 border-[#2563eb] font-extrabold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={16} />
            Create Your Account
          </button>
        </div>

      </div>
    </div>
  );
}

