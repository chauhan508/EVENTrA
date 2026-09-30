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
      success('Logged in to EVENTrA Management Console');
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials. Please verify and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06110D] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Back Link */}
        <div className="text-left">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8F9B94] hover:text-[#C8FF00] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-xl bg-[#0B1712] border border-white/10 shadow-2xl space-y-6 text-left">
          <div className="text-center space-y-1.5 pb-2">
            <div className="inline-flex p-3 rounded-xl bg-[#06110D] border border-white/10 text-[#C8FF00] mb-1">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#F5F7F4] tracking-tight font-sans">
              Admin Portal
            </h1>
            <p className="text-xs font-mono text-[#8F9B94]">
              EVENTrA Management Console
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-950/30 border border-red-500/40 text-red-200 text-xs font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono uppercase tracking-wider text-[#8F9B94] mb-1.5"
              >
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8F9B94]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@eventra.dev"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#06110D] border border-white/10 focus:border-[#C8FF00]/50 rounded-lg text-sm text-[#F5F7F4] placeholder-[#8F9B94]/60 focus:outline-none focus:ring-1 focus:ring-[#C8FF00]/30 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono uppercase tracking-wider text-[#8F9B94] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8F9B94]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#06110D] border border-white/10 focus:border-[#C8FF00]/50 rounded-lg text-sm text-[#F5F7F4] placeholder-[#8F9B94]/60 focus:outline-none focus:ring-1 focus:ring-[#C8FF00]/30 transition-all font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#C8FF00] hover:bg-[#B5E600] text-[#06110D] text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying session...</span>
                  </>
                ) : (
                  <span>Authenticate Session</span>
                )}
              </button>
            </div>
          </form>

          <div className="pt-3 border-t border-white/5 text-center">
            <span className="text-[11px] font-mono text-[#8F9B94]">
              Default login: <code className="text-[#F5F7F4]">admin@eventra.dev</code>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;
