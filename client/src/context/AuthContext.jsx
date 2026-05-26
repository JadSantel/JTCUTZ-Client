import { useState, useEffect } from 'react';
import api from '../api/axios';
import AuthContext from './authStore';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('jtcutz_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (data.success) {
          setUser(data.user);
        }
      } catch {
        localStorage.removeItem('jtcutz_token');
        localStorage.removeItem('jtcutz_user');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    if (data.success) {
      localStorage.setItem('jtcutz_token', data.token);
      localStorage.setItem('jtcutz_user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('jtcutz_token', data.token);
      localStorage.setItem('jtcutz_user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const { data } = await api.patch('/auth/password', { currentPassword, newPassword });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('jtcutz_token');
    localStorage.removeItem('jtcutz_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, register, login, changePassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
