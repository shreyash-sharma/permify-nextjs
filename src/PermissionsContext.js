"use client";
import React, { createContext, useContext, useState } from "react";

const PermissionsContext = createContext();

export function PermissionsProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = no user
  return (
    <PermissionsContext.Provider value={{ user, setUser }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionsContext);
} 