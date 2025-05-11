"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = 'permify_user_data';

const PermissionsContext = createContext();

export function PermissionsProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : undefined;
    }
    return undefined;
  });

  // Update localStorage when user changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user === undefined) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
    }
  }, [user]);

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const clearPermissions = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setUser(undefined);
  };

  return (
    <PermissionsContext.Provider value={{ user, setUser: updateUser, clearPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
} 