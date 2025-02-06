import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Example of checking user session from localStorage (or sessionStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // or use your own logic here
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Assuming the user data is stored in localStorage
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear user data
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
