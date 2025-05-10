"use client";
import { useEffect } from "react";
import { usePermissions } from "./PermissionsContext";

/**
 * PermifyUserSync
 * @param {function} useAuth - Hook to get userInfo (should return { userInfo })
 * @param {function} initializePermissions - Function to fetch permissions (userId) => Promise
 */
export default function PermifyUserSync({ useAuth, initializePermissions }) {
  const { userInfo } = useAuth();
  const { setUser } = usePermissions();

  useEffect(() => {
    async function syncPermify() {
      if (userInfo) {
        const userId = userInfo.userPrincipalName || userInfo.mail || userInfo.id;
        const data = await initializePermissions(userId);
        const allowedEntities = data?.user?.allowedEntities?.access || [];
        const roles = data?.user?.roles || [];
        const permissions = allowedEntities.map(e => e.id);
        setUser({ id: userId, roles, permissions });
      } else {
        setUser(null);
      }
    }
    syncPermify();
  }, [userInfo, setUser, initializePermissions]);
  return null;
} 