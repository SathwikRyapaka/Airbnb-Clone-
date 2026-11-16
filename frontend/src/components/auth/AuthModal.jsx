import React, { useState } from 'react';
import { X, User, Lock, Mail, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AuthModal = () => {
  const { authModal, closeAuthModal, login, register, loginAsDemo } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(authModal.tab === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isHost: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModal.isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLoginTab) {
        await login(formData.email, formData.password);
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          isHost: formData.isHost,
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please verify your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-float overflow-hidden border border-lavender">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-lavender bg-lavender/30 flex items-center justify-between">
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-lavender transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900">
            {isLoginTab ? 'Log in to Airbnb' : 'Sign up for Airbnb'}
          </h2>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Demo Access Bar */}
          <div className="mb-6 p-3.5 bg-gradient-to-r from-lavender via-white to-peach-light border border-lavender rounded-2xl shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2.5">
              <Sparkles className="w-4 h-4 text-peach-dark" />
              <span>Instant Evaluator Demo Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemo('guest')}
                className="py-2 px-3 text-xs font-bold rounded-xl bg-white border border-powder text-powder-deep hover:bg-powder/10 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-powder" /> Demo Guest
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('host')}
                className="py-2 px-3 text-xs font-bold rounded-xl bg-gradient-to-r from-peach to-peach-dark text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Building2 className="w-3.5 h-3.5" /> Demo Host
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginTab && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-powder" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-lavender focus:outline-none focus:ring-2 focus:ring-powder focus:border-powder transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-powder" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-lavender focus:outline-none focus:ring-2 focus:ring-powder focus:border-powder transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-powder" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-lavender focus:outline-none focus:ring-2 focus:ring-powder focus:border-powder transition-all font-medium"
                />
              </div>
            </div>

            {!isLoginTab && (
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  name="isHost"
                  checked={formData.isHost}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-powder focus:ring-powder border-lavender"
                />
                <span className="text-xs text-slate-700 font-medium">
                  I plan to host travelers by listing properties on Airbnb
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-powder to-peach text-white font-extrabold rounded-2xl text-sm transition-all shadow-soft hover:shadow-card hover:opacity-95 disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLoginTab ? 'Continue' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Tab */}
          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            {isLoginTab ? "Don't have an account yet?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(!isLoginTab);
                setError('');
              }}
              className="ml-1 text-powder-deep font-bold hover:underline"
            >
              {isLoginTab ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
