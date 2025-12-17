// src/context/UserContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getCurrentUser as getStoredUser, setCurrentUser as setStoredUser } from '../components/utils/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser() || null);

  useEffect(() => {
    console.log('UserContext - Updating user in localStorage:', user);
    setStoredUser(user);
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};