# permify-nextjs

Hybrid client-side permission context for robust and flexible integration of [Permify](https://github.com/Permify/permify) in **Next.js App Directory** projects.

## Why this library?

* React context from `@permify/react-role` can break in Next.js App Router due to server/client boundaries and nested layouts.
* This package avoids those issues with a custom client-only context implementation.
* It supports additional logic like `.disabled` permissions out of the box.

## Features

* Works in Next.js App Directory with reliable context propagation.
* Supports `.disabled` and `.disable` permission suffixes.
* Fast: fetches permissions once and reads from memory.
* Simple integration into any existing auth setup.

---

## Installation

```
npm install permify-nextjs
# or link locally in a monorepo
```

---

## Usage

### 1. Wrap your App with the Provider

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

### 2. Sync permissions using `PermifyUserSync`

```jsx
import { PermifyUserSync } from 'permify-nextjs';
import { useAuth } from '@/hooks/useAuth';
import { initializePermissions } from '@/lib/permifyClient';

// Place inside the tree once auth context is available
<PermifyUserSync useAuth={useAuth} initializePermissions={initializePermissions} />
```

Your `initializePermissions(userId)` function should return:

```js
{
  user: {
    id: "user@example.com",
    roles: ["admin"],
    allowedEntities: {
      access: [
        { id: "sidebar.logout" },
        { id: "dashboard" },
        { id: "admin-panel.disabled" }
      ]
    }
  }
}
```

### 3. Render conditionally with `EntityHasAccess`

```jsx
import { EntityHasAccess } from 'permify-nextjs';

<EntityHasAccess component_id="sidebar.logout">
  <Button>Logout</Button>
</EntityHasAccess>
```

### Behavior:

* `sidebar.logout` → renders as normal
* `sidebar.logout.disabled` or `.disable` → renders as disabled (with visual opacity)
* neither → hides or renders fallback

### 4. Access context directly

```jsx
import { usePermissions } from 'permify-nextjs';

const { user } = usePermissions();
```

---

## API Reference

| Component / Hook      | Description                                            |
| --------------------- | ------------------------------------------------------ |
| `PermissionsProvider` | Global context wrapper for user and permissions        |
| `usePermissions()`    | React hook to access `{ user, setUser, clearPermissions }` |
| `PermifyUserSync`     | Component to fetch and inject permissions into context |
| `EntityHasAccess`     | Conditional renderer that supports `.disabled` logic   |

---

## Clearing Permissions

You can clear the permissions from both context and localStorage using the `clearPermissions` function:

```jsx
import { usePermissions } from 'permify-nextjs';

function LogoutButton() {
  const { clearPermissions } = usePermissions();
  
  const handleLogout = () => {
    clearPermissions(); // Clears both context and localStorage
    // ... your logout logic
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

---

## Example Permission Array

```json
[
  "dashboard",
  "sidebar.logout",
  "sidebar.logout.disabled",
  "admin-panel"
]
```
NOTE: Any ID not avaailable in the array will be hidden by default.
---

## License

MIT

---
