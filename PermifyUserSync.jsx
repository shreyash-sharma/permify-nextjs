"use client";
import { useEffect } from "react";
import { usePermissions } from "./PermissionsContext";

export default function PermifyUserSync({ useAuth, initializePermissions }) {
  const { setUser } = usePermissions();
  const { userInfo } = useAuth();

  useEffect(() => {
    const userid = userInfo?.userPrincipalName || userInfo?.mail;
    if (userid) {
      initializePermissions(userid)
        .then((data) => {
          setUser({ ...userInfo, permissions: data.user?.allowedEntities?.access || [] });
        })
        .catch((error) => {
          setUser({ ...userInfo, permissions: [] });
        });
    }
  }, [userInfo, setUser, initializePermissions]);

  return null;
} 