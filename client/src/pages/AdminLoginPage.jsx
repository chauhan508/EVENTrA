import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      success('Logged in to Eventra Admin');
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials. Please verify and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <div className="text-left">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Eventra</span>
          </button>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-[#111214] border border-zinc-800 shadow-2xl space-y-6 text-left">
          <div className="text-center space-y-2 pb-2">
            <div className="inline-flex p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[#FF4D2E] mb-1">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal</h1>
            <p className="text-xs text-zinc-400">
              Eventra — Event Management Console
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-950/40 border border-[#FF4D2E]/50 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-[#FF4D2E] shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@eventra.dev"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0D] border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D2E] focus:ring-1 focus:ring-[#FF4D2E] transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0D] border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D2E] focus:ring-1 focus:ring-[#FF4D2E] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#FF4D2E] hover:bg-[#E63D1E] text-white text-sm font-semibold transition-all disabled:opacity-50 shadow-md mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Demo credentials box for evaluation */}
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
            <span className="font-mono font-semibold text-zinc-300 block">Default Demo Credentials:</span>
            <div className="flex justify-between font-mono">
              <span>Email:</span>
              <span className="text-zinc-300 select-all">admin@eventra.dev</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Password:</span>
              <span className="text-zinc-300 select-all">Admin@Eventra2026!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
