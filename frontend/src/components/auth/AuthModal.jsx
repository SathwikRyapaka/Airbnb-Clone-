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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-neutral-900">
            {isLoginTab ? 'Log in to Airbnb' : 'Sign up for Airbnb'}
          </h2>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Demo Access Bar */}
          <div className="mb-6 p-3 bg-rose-50 border border-rose-100 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Instant Evaluator Demo Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemo('guest')}
                className="py-1.5 px-3 text-xs font-medium rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-100/50 transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <User className="w-3.5 h-3.5" /> Demo Guest
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('host')}
                className="py-1.5 px-3 text-xs font-medium rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <Building2 className="w-3.5 h-3.5" /> Demo Host
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginTab && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
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
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 border-neutral-300"
                />
                <span className="text-xs text-neutral-700">
                  I plan to host travelers by listing my property
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLoginTab ? 'Continue' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Tab */}
          <div className="mt-6 text-center text-xs text-neutral-500">
            {isLoginTab ? "Don't have an account yet?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(!isLoginTab);
                setError('');
              }}
              className="ml-1 text-rose-600 font-semibold hover:underline"
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
