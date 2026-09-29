import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as apiAdminLogin, fetchAdminProfile } from '../api/admin';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('eventra_admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchAdminProfile();
        if (response.success && response.admin) {
          setAdmin(response.admin);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const response = await apiAdminLogin({ email, password });
    if (response.success && response.token) {
      localStorage.setItem('eventra_admin_token', response.token);
      setToken(response.token);
      setAdmin(response.admin);
      return response;
    }
    throw new Error(response.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('eventra_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        isLoading,
        login,
        logout
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
