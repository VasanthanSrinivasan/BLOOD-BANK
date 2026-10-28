import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({children}) {
  const [user,setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('bb_user')); } catch { return null; } });
  const login = async credentials => { const {data}=await api.post('/auth/login',credentials); localStorage.setItem('bb_token',data.token); localStorage.setItem('bb_user',JSON.stringify(data.user)); setUser(data.user); return data.user; };
  const register = async values => { const {data}=await api.post('/auth/register',values); localStorage.setItem('bb_token',data.token); localStorage.setItem('bb_user',JSON.stringify(data.user)); setUser(data.user); return data.user; };
  const logout = () => { localStorage.removeItem('bb_token'); localStorage.removeItem('bb_user'); setUser(null); window.location.href='/login'; };
  const value=useMemo(()=>({user,login,register,logout}),[user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
