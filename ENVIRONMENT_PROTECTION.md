# Environment-Based Route Protection

This document explains how to completely block access to dashboard and other protected routes in production while allowing them in development.

## 🛡️ Protection Methods Implemented

### 1. **Middleware Protection (Primary Defense)**

- **File**: `middleware.ts`
- **What it does**: Intercepts requests to `/dashboard/*` routes at the Edge Runtime level
- **Production behavior**: Redirects to custom 403 page (`/403`)
- **Development behavior**: Allows access with authentication check

### 2. **Server Component Protection**

- **File**: `components/EnvironmentGuard.tsx`
- **What it does**: Server-side component wrapper that enforces environment requirements
- **Usage**: Wrap pages or layouts that should be environment-restricted

### 3. **Layout-Level Protection**

- **File**: `app/dashboard/layout.tsx`
- **What it does**: Uses EnvironmentGuard to protect all dashboard routes at the layout level
- **Benefits**: Single point of protection for entire dashboard section

### 4. **Custom 403 Error Page**

- **File**: `app/403/page.tsx`
- **What it does**: Provides user-friendly error page explaining why access is blocked
- **Features**: Links to home page and alpha program

### 5. **Utility Functions**

- **File**: `lib/environment.ts`
- **What it does**: Provides helper functions for environment checks in components

## 🚀 How to Use

### Method 1: Automatic Protection (Recommended)

The middleware and dashboard layout already protect all `/dashboard/*` routes automatically.

### Method 2: Protect Individual Pages

For pages outside the dashboard, use the EnvironmentGuard:

\`\`\`tsx
import EnvironmentGuard from "../../components/EnvironmentGuard";

export default function AdminPage() {
return (
<EnvironmentGuard requiredEnv="development">
<div>Your admin content here</div>
</EnvironmentGuard>
);
}
\`\`\`

### Method 3: Use Utility Functions

For custom logic in server components:

\`\`\`tsx
import { enforceEnvironment, isEnvironmentAllowed } from "../../lib/environment";

export default function ProtectedPage() {
// This will throw 404 in production
enforceEnvironment("development");

return <div>Development-only content</div>;
}
\`\`\`

### Method 4: Conditional Rendering

For client components:

\`\`\`tsx
"use client";
import { useEffect, useState } from "react";

export default function ClientProtectedPage() {
const [isDev, setIsDev] = useState(false);

useEffect(() => {
// Note: This is not secure but useful for UI
setIsDev(process.env.NODE_ENV === 'development');
}, []);

if (!isDev) {
return <div>This feature is not available</div>;
}

return <div>Development content</div>;
}
\`\`\`

## 🔒 Security Levels

1. **Middleware** (Most Secure): Blocks at request level, cannot be bypassed
2. **Server Components** (Very Secure): Enforced during SSR, cannot be manipulated by client
3. **Client Components** (UI Only): For display purposes, can be bypassed by skilled users

## 📋 Adding New Protected Routes

### Option 1: Add to Middleware Matcher

Edit `middleware.ts` config:

\`\`\`typescript
export const config = {
matcher: [
"/dashboard/:path*",
"/admin/:path*", // Add new protected routes
"/settings/:path*", // Add new protected routes
],
};
\`\`\`

### Option 2: Use EnvironmentGuard in Layout

Create a layout for your protected section:

\`\`\`tsx
// app/admin/layout.tsx
import EnvironmentGuard from "../../components/EnvironmentGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
return (
<EnvironmentGuard requiredEnv="development">
{children}
</EnvironmentGuard>
);
}
\`\`\`

## 🧪 Testing

### Test Production Blocking:

1. Set `NODE_ENV=production`
2. Try accessing `/dashboard`
3. Should redirect to `/403` page

### Test Development Access:

1. Set `NODE_ENV=development`
2. Ensure authentication works
3. Should allow dashboard access

## 🚨 Important Notes

- **Double Protection**: Both middleware and server components provide redundant security
- **Environment Variables**: Ensure `NODE_ENV` is properly set in your deployment
- **Edge Runtime**: Middleware runs at the edge, providing fastest blocking
- **SEO Safe**: Protected routes return 404/403, not indexed by search engines

## 🛠️ Current Configuration

- ✅ Middleware protection active
- ✅ Dashboard layout protection active
- ✅ Custom 403 error page
- ✅ Utility functions available
- ✅ Development access with auth
- ✅ Production completely blocked
