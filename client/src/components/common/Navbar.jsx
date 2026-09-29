import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Shield, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
      isActive
        ? 'text-white bg-zinc-800/60 font-semibold'
        : 'text-zinc-300 hover:text-white hover:bg-zinc-800/30'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#08090A]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-1 flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/events" className={navLinkClass}>
              Events
            </NavLink>
            <button
              onClick={() => handleNavClick('about')}
              className="text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/30 transition-colors px-3 py-1.5 rounded-md"
            >
              About
            </button>

            <div className="w-[1px] h-5 bg-zinc-800 mx-2" />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-md border border-zinc-700 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#FF4D2E]" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white px-2 py-1.5 rounded-md transition-colors"
                  title="Logout Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-[#111214] hover:bg-[#1A1B1D] border border-zinc-800 hover:border-zinc-700 px-3.5 py-1.5 rounded-md transition-colors shadow-sm"
              >
                <Shield className="w-3.5 h-3.5 text-[#FF4D2E]" />
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#0D0E10] px-4 pt-3 pb-5 space-y-2 animate-fade-in">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-zinc-200 hover:bg-zinc-800/50"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </NavLink>
          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-zinc-200 hover:bg-zinc-800/50"
          >
            <span>Events</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </NavLink>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-zinc-200 hover:bg-zinc-800/50 text-left"
          >
            <span>About</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <div className="pt-2 border-t border-zinc-800 mt-2">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-zinc-200 bg-zinc-800/70"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-[#FF4D2E]" />
                    Admin Dashboard
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logout ({admin?.email})
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full mt-1 px-4 py-2.5 text-sm font-medium rounded-md bg-[#111214] hover:bg-zinc-800 border border-zinc-700 text-zinc-200"
              >
                <Shield className="w-4 h-4 text-[#FF4D2E]" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
