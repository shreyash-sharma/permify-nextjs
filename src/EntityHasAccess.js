"use client";
import { usePermissions } from "./PermissionsContext";
import React from "react";

export default function EntityHasAccess({ component_id, children, fallback = null }) {
  const { user } = usePermissions();
  const permissions = user?.permissions || [];

  if (user === undefined) {
    return <div className="flex justify-center items-center p-2"><span className="animate-spin mr-2">🔄</span>Loading...</div>;
  }

  const hasNormal = permissions.includes(component_id);
  const hasDisabled = permissions.includes(`${component_id}.disabled`) || permissions.includes(`${component_id}.disable`);

  if (!hasNormal && !hasDisabled) {
    return fallback;
  }

  if (hasDisabled) {
    if (typeof children === "function") {
      return children({ disabled: true });
    } else if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        disabled: true,
        className: `${children.props.className || ""} opacity-60 pointer-events-none`
      });
    } else {
      return <div aria-disabled="true" className="opacity-60 pointer-events-none">{children}</div>;
    }
  }

  if (typeof children === "function") {
    return children({ disabled: false });
  }
  return children;
} 