import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu, Shield, Loader2 } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06110D] flex flex-col items-center justify-center text-[#8F9B94]">
        <Loader2 className="w-7 h-7 animate-spin text-[#C8FF00] mb-3" />
        <p className="text-xs font-mono">Verifying administrative access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#06110D] text-[#F5F7F4] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0B1712] border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#C8FF00]" />
          <span className="font-bold text-sm text-[#F5F7F4] font-sans">EVENTrA Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 rounded text-[#8F9B94] hover:text-white hover:bg-white/5"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
