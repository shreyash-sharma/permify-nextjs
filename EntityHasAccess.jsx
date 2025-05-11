"use client";

import React from 'react';
import { usePermissions } from "./PermissionsContext";

/**
 * Entity-based access control component that handles access permissions
 * @param {Object} props - Component props
 * @param {string} props.component_id - ID of the entity/component to check access for
 * @param {React.ReactNode} props.children - Content to show if access is granted
 * @param {React.ReactNode} props.fallback - Content to show if access is denied (default: null)
 * @param {function} props.renderDisabled - Optional function to render a disabled version of children
 * @param {function} [props.getComponentAccessStatus] - (Optional) Function to check access, provided by the consumer app
 */
export default function EntityHasAccess({ 
  component_id, 
  children, 
  fallback = null,
  renderDisabled,
  getComponentAccessStatus // <-- Accept as prop
}) {
  const { user } = usePermissions();
  const permissions = user?.permissions || [];

  // If the consumer provides a custom access check function, use it
  let hasNormal, hasDisabled;
  if (typeof getComponentAccessStatus === "function") {
    const status = getComponentAccessStatus(component_id, permissions);
    hasNormal = status === "normal" || status === true;
    hasDisabled = status === "disabled";
  } else {
    // Default logic: check permissions array for id matches
    hasNormal = permissions.some(p => p.id === component_id);
    hasDisabled = permissions.some(
      p => p.id === `${component_id}.disabled` || p.id === `${component_id}.disable`
    );
  }

  if (user === undefined) {
    return (
      <div className="flex justify-center items-center p-2">
        <span className="animate-spin mr-2">🔄</span>Loading...
      </div>
    );
  }

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