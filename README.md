# permify-nextjs

Hybrid Permify context for robust permissions in Next.js app directory projects

## Why?
- Ensures reliable context propagation for permissions in Next.js app directory (where some libraries may fail)
- Supports `.disabled` logic for entity/component permissions
- Easy to integrate and extend

## Installation

```
# Local package (in a monorepo or local project)
# Or publish to npm and use: npm install permify-nextjs
```

## Usage

### 1. Wrap your app in the provider

```jsx
import { PermissionsProvider } from 'permify-nextjs';

export default function RootLayout({ children }) {
  return (
    <PermissionsProvider>
      {children}
    </PermissionsProvider>
  );
}
```

### 2. Use PermifyUserSync to fetch and set permissions

```jsx
import { PermifyUserSync } from 'permify-nextjs';
import { useAuth } from '@/hooks/useAuth';
import { initializePermissions } from '@/lib/permifyClient';

// Place this inside your provider tree after auth/graph context is available
<PermifyUserSync useAuth={useAuth} initializePermissions={initializePermissions} />
```

### 3. Use EntityHasAccess for permission checks

```jsx
import { EntityHasAccess } from 'permify-nextjs';

<EntityHasAccess component_id="sidebar.logout">
  <Button>Logout</Button>
</EntityHasAccess>
```

- If the permissions array contains `sidebar.logout.disabled`, the button will be visually disabled.
- If only `sidebar.logout` is present, the button is enabled.
- If neither, the button is hidden.

### 4. Custom Hooks

You can use `usePermissions()` to access the current user/permissions anywhere in your app:

```js
import { usePermissions } from 'permify-nextjs';
const { user } = usePermissions();
```

## .disabled Support
- If the permissions array contains `component_id.disabled` or `component_id.disable`, the child will be rendered with `disabled={true}` and visually disabled styling.
- Works for both function and element children.

## API
- `PermissionsProvider`: Context provider for permissions
- `usePermissions`: Hook to access user/permissions
- `PermifyUserSync`: Fetches and sets permissions (inject your own `useAuth` and `initializePermissions`)
- `EntityHasAccess`: Checks permissions and renders/disabled/hides children

## Example Permissions Array
```js
["sidebar.logout", "sidebar.userinfo.disabled", ...]
```

## License
MIT 