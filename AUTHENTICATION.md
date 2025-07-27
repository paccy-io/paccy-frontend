# Authentication Configuration

## Dashboard Protection

The dashboard pages are protected by authentication. Here's how the system works:

### Current Setup:
- ✅ **All dashboard routes** (`/dashboard/*`) are protected
- ✅ **Public pages** remain accessible (home, about, pricing, contact, how-it-works)
- ✅ **Authentication required** to access dashboard features
- ✅ **Automatic redirect** to login page when accessing protected routes
- ✅ **Remember intended destination** after successful login

### How to Access Dashboard:
1. Go to `/auth` page
2. Sign in with any email and password (demo authentication)
3. Get redirected to dashboard or intended page

### Development Configuration:

**To disable authentication temporarily** (for development):
1. Open `middleware.ts`
2. Change `REQUIRE_AUTH = true` to `REQUIRE_AUTH = false`
3. Restart the dev server

**To re-enable authentication**:
1. Change `REQUIRE_AUTH = false` back to `REQUIRE_AUTH = true`
2. Restart the dev server

### Authentication Features:
- **Mock Authentication**: Currently uses demo auth (any credentials work)
- **Session Persistence**: Uses localStorage + cookies
- **Automatic Logout**: Available in navbar when authenticated
- **Protected Routes**: All `/dashboard/*` paths require authentication
- **Public Access**: All other pages remain publicly accessible

### For Production:
- Replace mock authentication in `AuthProvider.tsx` with real auth service
- Update `checkAuthentication()` in `middleware.ts` for real token validation
- Configure proper JWT/session validation
- Set up user management system

### Directory Structure:
```
app/
├── dashboard/           # 🔒 Protected (requires auth)
│   ├── layout.tsx      # Wraps with ProtectedRoute
│   ├── page.tsx        # Main dashboard
│   ├── essays/         # Essay manager
│   ├── colleges/       # College tracker
│   └── ...            # Other dashboard features
├── auth/               # 🌐 Public (login/signup)
├── page.tsx            # 🌐 Public (homepage)
├── about/              # 🌐 Public
├── pricing/            # 🌐 Public
├── contact/            # 🌐 Public
└── how-it-works/       # 🌐 Public
```

**Legend:**
- 🔒 = Protected (requires authentication)
- 🌐 = Public (accessible to everyone)
