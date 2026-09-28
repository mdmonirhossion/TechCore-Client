"use client";

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { X, Lock, User, Mail, KeyRound, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { loginUser } = useShop();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const mockUserData = {
        name: name || email.split('@')[0] || 'Md Monir',
        email,
        role: 'customer'
      };
      loginUser(mockUserData, 'mock_jwt_token_popup');
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 z-10 text-slate-900 border border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-orange-50 text-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-1">
            <Lock size={22} />
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {isRegister ? 'Create Account' : 'Sign In to TechCore'}
          </h3>
          <p className="text-xs text-slate-500">Access order tracking, wishlist, and warranty tickets</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegister && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Tanvir Hasan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold py-3 rounded-xl shadow-md uppercase transition-all disabled:opacity-50 mt-1"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-1">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegister(false)} className="text-blue-600 font-bold hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{' '}
              <button onClick={() => setIsRegister(true)} className="text-blue-600 font-bold hover:underline">
                Create Account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
