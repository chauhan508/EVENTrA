import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Shield, LogOut, LayoutDashboard, Search, PlusCircle, ChevronRight } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavScroll = (sectionId) => {
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
    `text-xs uppercase tracking-wider font-mono font-medium transition-colors px-3 py-1.5 rounded ${
      isActive
        ? 'text-[#C8FF00] bg-white/5 font-semibold'
        : 'text-[#8F9B94] hover:text-[#F5F7F4] hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#06110D]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Left: Logo */}
          <div className="flex items-center gap-6">
            <Logo />
            
            {/* Center/Left Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-white/10">
              <NavLink to="/events" className={navLinkClass}>
                Events
              </NavLink>
              <button
                onClick={() => handleNavScroll('categories')}
                className="text-xs uppercase tracking-wider font-mono font-medium text-[#8F9B94] hover:text-[#F5F7F4] hover:bg-white/5 transition-colors px-3 py-1.5 rounded"
              >
                Categories
              </button>
              <button
                onClick={() => handleNavScroll('about')}
                className="text-xs uppercase tracking-wider font-mono font-medium text-[#8F9B94] hover:text-[#F5F7F4] hover:bg-white/5 transition-colors px-3 py-1.5 rounded"
              >
                About
              </button>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs text-[#8F9B94] hover:text-[#F5F7F4] px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors"
              title="Search Directory"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px] uppercase tracking-wider">Search</span>
            </Link>

            <Link
              to={isAuthenticated ? "/admin/events" : "/admin/login"}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#F5F7F4] hover:text-[#C8FF00] bg-[#0B1712] hover:bg-[#101D17] border border-white/10 hover:border-[#C8FF00]/40 px-3 py-1.5 rounded transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#C8FF00]" />
              <span>Submit Event</span>
            </Link>

            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#06110D] bg-[#C8FF00] hover:bg-[#B5E600] px-3 py-1.5 rounded transition-all shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center p-1.5 rounded text-[#8F9B94] hover:text-red-400 hover:bg-white/5 transition-colors"
                  title="Logout Admin"
                  aria-label="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8F9B94] hover:text-[#F5F7F4] px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-[#8F9B94] hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0B1712] px-4 pt-3 pb-5 space-y-2 animate-fade-in">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded text-sm text-[#F5F7F4] hover:bg-white/5 font-mono"
          >
            <span>HOME</span>
            <ChevronRight className="w-4 h-4 text-[#8F9B94]" />
          </NavLink>
          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded text-sm text-[#F5F7F4] hover:bg-white/5 font-mono"
          >
            <span>ALL EVENTS</span>
            <ChevronRight className="w-4 h-4 text-[#8F9B94]" />
          </NavLink>
          <button
            onClick={() => handleNavScroll('categories')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded text-sm text-[#F5F7F4] hover:bg-white/5 font-mono text-left"
          >
            <span>CATEGORIES</span>
            <ChevronRight className="w-4 h-4 text-[#8F9B94]" />
          </button>
          <button
            onClick={() => handleNavScroll('about')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded text-sm text-[#F5F7F4] hover:bg-white/5 font-mono text-left"
          >
            <span>ABOUT</span>
            <ChevronRight className="w-4 h-4 text-[#8F9B94]" />
          </button>

          <div className="pt-2 border-t border-white/10 mt-2 space-y-2">
            <Link
              to={isAuthenticated ? "/admin/events" : "/admin/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded text-sm font-mono text-[#06110D] bg-[#C8FF00]"
            >
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                SUBMIT EVENT
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            {isAuthenticated ? (
              <div className="flex flex-col gap-1 pt-1">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded text-sm font-mono text-[#F5F7F4] hover:bg-white/5"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-[#C8FF00]" />
                    Dashboard ({admin?.email})
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded text-xs font-mono text-[#8F9B94] hover:text-[#F5F7F4] bg-[#06110D] border border-white/10"
              >
                <Shield className="w-3.5 h-3.5 text-[#C8FF00]" />
                ADMIN PORTAL
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
