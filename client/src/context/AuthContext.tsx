import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../utils/api';

const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('daa_admin')!); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('daa_token');
    if (token) {
      getMe().then((r: any) => { setAdmin(r.data); setLoading(false); }).catch(() => {
        localStorage.removeItem('daa_token'); localStorage.removeItem('daa_admin');
        setAdmin(null); setLoading(false);
      });
    } else { setLoading(false); }
  }, []);

  const loginAdmin = (token: any, adminData: any) => {
    localStorage.setItem('daa_token', token);
    localStorage.setItem('daa_admin', JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('daa_token'); localStorage.removeItem('daa_admin');
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin, setAdmin }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
