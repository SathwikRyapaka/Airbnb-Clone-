import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('airbnb_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('airbnb_token') || null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ isOpen: false, tab: 'login' });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const openAuthModal = useCallback((tab = 'login') => {
    setAuthModal({ isOpen: true, tab });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal({ isOpen: false, tab: 'login' });
  }, []);

  // Validate session on initial load
  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('airbnb_token');
      if (savedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('airbnb_user', JSON.stringify(res.user));
          }
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('airbnb_token', res.token);
      localStorage.setItem('airbnb_user', JSON.stringify(res.user));
      closeAuthModal();
      showToast(`Welcome back, ${res.user.name}!`);
      return res.user;
    }
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('airbnb_token', res.token);
      localStorage.setItem('airbnb_user', JSON.stringify(res.user));
      closeAuthModal();
      showToast(`Welcome to Airbnb, ${res.user.name}!`);
      return res.user;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('airbnb_token');
    localStorage.removeItem('airbnb_user');
    showToast('You have been logged out.');
  };

  // Quick Demo Logins for instant evaluation
  const loginAsDemo = async (role = 'guest') => {
    try {
      const email = role === 'host' ? 'host@airbnb.com' : 'guest@airbnb.com';
      await login(email, 'password123');
    } catch (err) {
      showToast(err.response?.data?.message || 'Demo login failed. Make sure backend is running & seeded.', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isHost: user?.isHost || user?.role === 'host',
        loading,
        authModal,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        loginAsDemo,
        toast,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
