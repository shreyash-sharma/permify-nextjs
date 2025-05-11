"use client";
import { useEffect } from "react";
import { usePermissions } from "./PermissionsContext";

const STORAGE_KEY = 'permify_user_data';

export default function PermifyUserSync({ useAuth, initializePermissions }) {
  const { setUser } = usePermissions();
  const { userInfo } = useAuth();

  useEffect(() => {
    const userid = userInfo?.userPrincipalName || userInfo?.mail;
    
    if (userid) {
      // Check if we have cached permissions
      const cachedData = localStorage.getItem(STORAGE_KEY);
      const cachedUser = cachedData ? JSON.parse(cachedData) : null;
      
      // If we have cached data and it's for the same user, use it temporarily
      if (cachedUser && cachedUser.userPrincipalName === userid) {
        setUser(cachedUser);
      }

      // Always fetch fresh permissions
      initializePermissions(userid)
        .then((data) => {
          const newUserData = { 
            ...userInfo, 
            permissions: data.user?.allowedEntities?.access || [] 
          };
          setUser(newUserData);
        })
        .catch((error) => {
          console.error('Failed to fetch permissions:', error);
          setUser({ ...userInfo, permissions: [] });
        });
    } else {
      // Clear user data if no user ID is available
      setUser(undefined);
    }
  }, [userInfo, setUser, initializePermissions]);

  return null;
} 