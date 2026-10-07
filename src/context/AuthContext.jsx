import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../api/authApi.js';
import { setAuthToken, setUnauthorizedHandler } from '../api/axiosClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  const authenticate = useCallback((username, password) => loginRequest(username, password), []);

  const commit = useCallback((data) => {
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async (username, password) => commit(await authenticate(username, password)), [authenticate, commit]);

  const value = useMemo(() => ({ user, login, authenticate, commit, logout }), [user, login, authenticate, commit, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export const homeFor = (role) => ({ customer: '/customer', agent: '/agent', admin: '/admin' }[role] || '/login');
