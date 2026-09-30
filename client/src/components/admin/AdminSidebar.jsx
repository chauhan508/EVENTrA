import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, ExternalLink, LogOut, Shield } from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ mobileOpen, onClose }) => {
  const { admin, logout } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
      isActive
        ? 'bg-[#C8FF00]/15 text-[#C8FF00] border border-[#C8FF00]/30 font-bold'
        : 'text-[#8F9B94] hover:text-[#F5F7F4] hover:bg-white/5 border border-transparent'
    }`;

  const content = (
    <div className="flex flex-col h-full bg-[#0B1712] border-r border-white/10 p-4">
      {/* Brand Header */}
      <div className="pb-5 pt-2 border-b border-white/10">
        <Logo showText={true} />
        <div className="mt-3 flex items-center gap-2 px-2.5 py-1 rounded bg-[#06110D] border border-white/10 text-[11px] font-mono text-[#8F9B94]">
          <Shield className="w-3.5 h-3.5 text-[#C8FF00]" />
          <span>Console Overview</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 py-6">
        <NavLink to="/admin" end className={navItemClass} onClick={onClose}>
          <LayoutDashboard className="w-4 h-4 text-[#8F9B94]" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/events" className={navItemClass} onClick={onClose}>
          <Calendar className="w-4 h-4 text-[#8F9B94]" />
          <span>Manage Events</span>
        </NavLink>
        <NavLink to="/admin/registrations" className={navItemClass} onClick={onClose}>
          <Users className="w-4 h-4 text-[#8F9B94]" />
          <span>Registrations</span>
        </NavLink>
      </nav>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-mono text-[#8F9B94] hover:text-[#C8FF00] rounded hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Live Directory
          </span>
        </Link>

        <div className="p-3 rounded-lg bg-[#06110D] border border-white/10">
          <p className="text-xs font-bold text-[#F5F7F4] truncate font-sans">{admin?.name || 'Administrator'}</p>
          <p className="text-[11px] font-mono text-[#8F9B94] truncate">{admin?.email}</p>
          <button
            onClick={logout}
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs font-mono text-red-400 hover:text-red-300 py-1.5 rounded bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">{content}</aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-72 max-w-[85%] h-full z-10">{content}</div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
