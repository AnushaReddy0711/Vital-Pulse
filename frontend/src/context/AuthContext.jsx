import { createContext, useContext, useState } from 'react';
import { login as loginAPI, register as registerAPI } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('bloodUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const res = await loginAPI({ email, password });
    const user = res.data;
    setCurrentUser(user);
    localStorage.setItem('bloodUser', JSON.stringify(user));
    return user;
  };

  const register = async (data) => {
    const res = await registerAPI(data);
    const user = res.data;
    setCurrentUser(user);
    localStorage.setItem('bloodUser', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bloodUser');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
