"use client"

import { useEffect, useState } from 'react';
import { getComponentAccessStatus } from '@/lib/permifyClient';
import React from 'react';
import { HasAccess } from '@permify/react-role';
import { usePermissions } from "./PermissionsContext";

/**
 * Entity-based access control component that handles access permissions
 * @param {Object} props - Component props
 * @param {string} props.component_id - ID of the entity/component to check access for
 * @param {React.ReactNode} props.children - Content to show if access is granted
 * @param {React.ReactNode} props.fallback - Content to show if access is denied (default: null)
 * @param {function} props.renderDisabled - Optional function to render a disabled version of children
 */
export default function EntityHasAccess({ 
  component_id, 
  children, 
  fallback = null,
  renderDisabled
}) {
  const { user } = usePermissions();
  const permissions = user?.permissions || [];

  console.log(`[EntityHasAccess] user in context:`, user, 'for', component_id);
  console.log(`[EntityHasAccess] permissions in context:`, permissions, 'for', component_id);

  if (user === undefined) {
    console.log(`[EntityHasAccess] Waiting for user/permissions for`, component_id);
    return <div className="flex justify-center items-center p-2"><span className="animate-spin mr-2">🔄</span>Loading...</div>;
  }

  const hasNormal = permissions.some(p => p.id === component_id);
  const hasDisabled = permissions.some(p => p.id === `${component_id}.disabled` || p.id === `${component_id}.disable`);

  if (!hasNormal && !hasDisabled) {
    return fallback;
  }

  if (hasDisabled) {
    if (typeof children === "function") {
      console.log(`[EntityHasAccess] Passing disabled=true to child function for ${component_id}`);
      return children({ disabled: true });
    } else if (React.isValidElement(children)) {
      console.log(`[EntityHasAccess] Cloning child element with disabled=true for ${component_id}`);
      return React.cloneElement(children, {
        disabled: true,
        className: `${children.props.className || ""} opacity-60 pointer-events-none`
      });
    } else {
      console.log(`[EntityHasAccess] Wrapping child in div with aria-disabled=true for ${component_id}`);
      return <div aria-disabled="true" className="opacity-60 pointer-events-none">{children}</div>;
    }
  }

  if (typeof children === "function") {
    console.log(`[EntityHasAccess] Passing disabled=false to child function for ${component_id}`);
    return children({ disabled: false });
  }
  console.log(`[EntityHasAccess] Rendering child as-is for ${component_id}`);
  return children;
} 