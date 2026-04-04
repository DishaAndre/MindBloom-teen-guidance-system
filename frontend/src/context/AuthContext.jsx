import React, { createContext, useContext, useState } from 'react'
const Ctx = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('mb') || 'null') } catch { return null } })
  const login  = (u, token) => { 
    setUser(u); 
    localStorage.setItem('mb', JSON.stringify(u)); 
    if(token) localStorage.setItem('mb_token', token); 
  }
  const logout = () => { 
    setUser(null); 
    localStorage.removeItem('mb'); 
    localStorage.removeItem('mb_token'); 
  }
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}
export const useAuth = () => useContext(Ctx)
