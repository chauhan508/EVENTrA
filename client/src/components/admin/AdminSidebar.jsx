import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, ExternalLink, LogOut, Shield } from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ mobileOpen, onClose }) => {
  const { admin, logout } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#FF4D2E]/15 text-white border border-[#FF4D2E]/30 font-semibold'
        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
    }`;

  const content = (
    <div className="flex flex-col h-full bg-[#0D0D11] border-r border-zinc-800 p-4">
      {/* Brand Header */}
      <div className="pb-6 pt-2 border-b border-zinc-800/80">
        <Logo showText={true} />
        <div className="mt-3 flex items-center gap-2 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <Shield className="w-3.5 h-3.5 text-[#FF4D2E]" />
          <span>Admin Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 py-6">
        <NavLink to="/admin" end className={navItemClass} onClick={onClose}>
          <LayoutDashboard className="w-4 h-4 text-zinc-400" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/events" className={navItemClass} onClick={onClose}>
          <Calendar className="w-4 h-4 text-zinc-400" />
          <span>Manage Events</span>
        </NavLink>
        <NavLink to="/admin/registrations" className={navItemClass} onClick={onClose}>
          <Users className="w-4 h-4 text-zinc-400" />
          <span>Registrations</span>
        </NavLink>
      </nav>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-zinc-800/80 space-y-3">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            View Public Website
          </span>
        </Link>

        <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
          <p className="text-xs font-semibold text-white truncate">{admin?.name || 'Administrator'}</p>
          <p className="text-[11px] font-mono text-zinc-400 truncate">{admin?.email}</p>
          <button
            onClick={logout}
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 py-1.5 rounded bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 transition-colors"
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
