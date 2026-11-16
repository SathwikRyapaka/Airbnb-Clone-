import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Globe, Menu, User, PlusCircle, Compass, Calendar, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onOpenSearch, onOpenFilters }) => {
  const { user, isAuthenticated, isHost, logout, openAuthModal, loginAsDemo } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHostAction = () => {
    if (!isAuthenticated) {
      openAuthModal('signup');
    } else {
      navigate('/host/dashboard?action=new');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <svg
              className="w-8 h-8 text-rose-500 group-hover:scale-105 transition-transform"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 4.114 8.358 4.716 11.233.376 1.796.345 3.32-.178 4.708-.68 1.805-2.035 3.272-3.815 4.13-1.638.791-3.565 1.026-5.467.662l-.54-.108-.54.108c-1.902.364-3.829.129-5.467-.662-1.78-.858-3.135-2.325-3.815-4.13-.523-1.388-.554-2.912-.178-4.708.602-2.875 2.762-7.403 4.716-11.233l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.328 0-2.399.645-3.55 2.753l-.538 1.034C10.024 10.49 7.933 14.869 7.37 17.556c-.287 1.371-.247 2.478.147 3.525.495 1.314 1.503 2.398 2.825 3.036 1.396.674 3.045.82 4.708.431l.95-.224.95.224c1.663.389 3.312.243 4.708-.431 1.322-.638 2.33-1.722 2.825-3.036.394-1.047.434-2.154.147-3.525-.563-2.687-2.654-7.066-4.542-10.769l-.538-1.034C18.399 3.645 17.328 3 16 3zm0 13c1.657 0 3 1.343 3 3 0 1.512-1.12 2.763-2.58 2.975l-.21.015L16 22l-.21-.01c-1.46-.212-2.58-1.463-2.58-2.975 0-1.657 1.343-3 3-3zm0 2c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-rose-500 hidden sm:inline">
              airbnb
            </span>
          </Link>

          {/* Search Trigger Capsule */}
          <div
            onClick={onOpenSearch}
            className="flex items-center border border-neutral-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-xs md:text-sm font-semibold text-neutral-800 divide-x divide-neutral-200"
          >
            <span className="px-3 hover:text-neutral-500 transition-colors">Anywhere</span>
            <span className="px-3 hover:text-neutral-500 transition-colors hidden sm:inline">Any week</span>
            <div className="pl-3 flex items-center gap-3 text-neutral-500 font-normal">
              <span className="hidden md:inline">Add guests</span>
              <div className="p-2 bg-rose-500 text-white rounded-full">
                <Search className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* User Menu Actions */}
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            <button
              onClick={handleHostAction}
              className="hidden md:block py-2 px-4 text-xs font-semibold rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors"
            >
              Airbnb your home
            </button>

            <button
              type="button"
              className="hidden md:flex p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
              title="Language & Currency"
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Profile Dropdown Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 p-1.5 pl-3 border border-neutral-300 rounded-full hover:shadow-md transition-shadow bg-white"
            >
              <Menu className="w-4 h-4 text-neutral-600" />
              {isAuthenticated && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                />
              ) : (
                <div className="w-7 h-7 bg-neutral-600 text-white rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-fadeIn">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-xs text-neutral-400 font-medium">Logged in as</p>
                      <p className="text-sm font-bold text-neutral-900 truncate">{user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                      {isHost && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" /> Host Account
                        </span>
                      )}
                    </div>

                    <Link
                      to="/my-trips"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                    >
                      <Calendar className="w-4 h-4 text-neutral-500" /> My Trips
                    </Link>

                    <Link
                      to="/host/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                    >
                      <Compass className="w-4 h-4 text-neutral-500" /> Host Dashboard
                    </Link>

                    <Link
                      to="/host/dashboard?action=new"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                    >
                      <PlusCircle className="w-4 h-4 text-neutral-500" /> Create New Listing
                    </Link>

                    <div className="border-t border-neutral-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" /> Log out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        openAuthModal('signup');
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-neutral-900 hover:bg-neutral-50"
                    >
                      Sign up
                    </button>

                    <button
                      onClick={() => {
                        openAuthModal('login');
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Log in
                    </button>

                    <div className="border-t border-neutral-100 my-1.5" />

                    <button
                      onClick={() => {
                        loginAsDemo('host');
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center justify-between"
                    >
                      <span>Host Demo Login</span>
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">Superhost</span>
                    </button>

                    <button
                      onClick={() => {
                        loginAsDemo('guest');
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
                    >
                      <span>Guest Demo Login</span>
                      <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">Traveler</span>
                    </button>

                    <div className="border-t border-neutral-100 my-1" />

                    <button
                      onClick={() => {
                        openAuthModal('signup');
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50"
                    >
                      Airbnb your home
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
