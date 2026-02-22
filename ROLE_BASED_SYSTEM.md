# Role-Based Dashboard System

## Overview

This is a fully role-based dashboard system with completely separate User Panel and Admin Panel built with React, Vite, Tailwind CSS, and React Router DOM.

## Technology Stack

- **React 18** (Vite)
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Lucide Icons** - Icon library
- **Framer Motion** - Animations
- **Mock Authentication** - UI-only auth system

## System Architecture

### Roles
1. **User** - Limited access, can only access user panel
2. **Admin** - Full access, can access both admin and user panels

### Route Structure

```
/login          → Login page with role selection
/user/*         → User Panel (Protected)
/admin/*        → Admin Panel (Protected, Admin only)
/               → Redirects based on authentication & role
```

## Key Features

### 1. Role-Based Authentication
- Mock login system with role selection
- Persistent authentication via localStorage
- Automatic redirect based on role

### 2. Protected Routes
- Not logged in → Redirect to `/login`
- User role trying `/admin` → Redirect to `/user`
- Admin role → Can access both `/admin` and `/user`

### 3. Switch View Button (Admin Only)
- Visible only when logged in as Admin
- Located in the Admin Topbar
- Toggles between `/admin` ↔ `/user`
- Users do NOT see this button

### 4. Completely Separate Panels
- Different layouts
- Different sidebar menus
- Different styling
- No mixing of components

## Folder Structure

```
src/
├── context/
│   └── AuthContext.jsx              # Auth state management
│
├── components/
│   ├── user/
│   │   ├── UserLayout.jsx           # User panel layout wrapper
│   │   ├── UserSidebar.jsx          # User navigation menu
│   │   └── UserTopbar.jsx           # User top navigation
│   │
│   └── admin/
│       ├── AdminLayout.jsx          # Admin panel layout wrapper
│       ├── AdminSidebar.jsx         # Admin navigation menu (with sections)
│       └── AdminTopbar.jsx          # Admin topbar with Switch View button
│
├── pages/
│   ├── Login.jsx                    # Login with role selection
│   ├── user/
│   │   ├── Dashboard.jsx           # User dashboard home
│   │   ├── Transactions.jsx        # User transactions page
│   │   ├── Settlements.jsx         # User settlements page
│   │   ├── Reports.jsx             # User reports page
│   │   ├── PaymentLinks.jsx        # User payment links page
│   │   └── QRCodes.jsx             # User QR codes page
│   │
│   └── admin/
│       ├── Overview.jsx            # Admin overview dashboard
│       ├── Users.jsx               # User management
│       ├── Transactions.jsx        # Transaction management
│       ├── Settlements.jsx         # Settlement management
│       ├── Products.jsx            # Product management
│       ├── Reports.jsx             # Admin reports
│       └── Settings.jsx            # System settings
│
├── routes/
│   └── AppRoutes.jsx               # Main routing configuration
│
├── App.jsx                         # App entry with AuthProvider
└── main.jsx                        # React root mount
```

## User Panel

### Route: `/user`

**Sidebar Menu:**
- Dashboard
- Transactions
- Settlements
- Reports
- Payment Links
- QR Codes

**Layout:**
- Clean, modern UI
- Sidebar with limited options
- Top navbar with notifications & profile
- No switch view button

**Pages:**
- Dashboard with stats & recent transactions
- Transaction listing with filters
- Settlement history
- Report generation
- Payment link management
- QR code management

## Admin Panel

### Route: `/admin`

**Sidebar Sections:**

1. **DASHBOARD**
   - Overview

2. **USER MANAGEMENT**
   - All Users
   - Create User
   - Roles

3. **TRANSACTION MANAGEMENT**
   - All Transactions
   - Failed Transactions
   - Disputes

4. **SETTLEMENTS**
   - All Settlements
   - Reports

5. **PAYMENT PRODUCTS**
   - Digital Billing
   - Payment Links
   - QR Codes
   - Subscriptions
   - Smart Collect

6. **SYSTEM**
   - Settings
   - Logs
   - API Keys

**Layout:**
- Dark sidebar with collapsible sections
- Switch View button in topbar
- Search functionality
- Profile dropdown with logout

## Login System

### Features
- Role selection (User/Admin)
- Visual role cards
- Role-specific demo credentials
- Form validation
- Animated transitions

### Demo Credentials

**User Login:**
- Email: `user@razorpay.com`
- Password: `demo123`

**Admin Login:**
- Email: `admin@razorpay.com`
- Password: `demo123`

## Authentication Flow

```
┌─────────────┐
│   /login    │
└──────┬──────┘
       │
       ├──── Select Role (User/Admin)
       │
       ├──── Enter Credentials
       │
       └──── Submit
              │
              ├──── Valid → Set Auth State
              │             │
              │             ├──── Admin → /admin
              │             └──── User → /user
              │
              └──── Invalid → Show Errors
```

## Protected Route Logic

```javascript
if (!isAuthenticated) {
  redirect to /login
}

if (requiredRole === 'admin' && role !== 'admin') {
  redirect to /user
}

// Allow access
```

## Context API

### AuthContext

**State:**
- `user` - Current user object
- `role` - Current role ('user' | 'admin')
- `isAuthenticated` - Auth status
- `loading` - Loading state

**Methods:**
- `login(email, password, selectedRole)` - Authenticate user
- `logout()` - Clear auth and redirect to login
- `switchView()` - Toggle between admin and user panels (Admin only)

**Storage:**
- Uses localStorage for persistence
- Keys: `user`, `role`

## Running the Application

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production
```bash
npm run preview
```

## Testing the System

### Test as User
1. Go to http://localhost:5173/login
2. Select "User" role
3. Login with `user@razorpay.com` / `demo123`
4. Verify: You're at `/user`
5. Verify: No "Switch View" button visible
6. Try accessing `/admin` → Should redirect to `/user`

### Test as Admin
1. Go to http://localhost:5173/login
2. Select "Admin" role
3. Login with `admin@razorpay.com` / `demo123`
4. Verify: You're at `/admin`
5. Verify: "Switch View" button is visible in topbar
6. Click "Switch View" → Should navigate to `/user`
7. Click "Switch View" again → Should navigate back to `/admin`
8. Manually visit `/user` → Should work (admin can access user panel)

## Security Notes

⚠️ **Important:** This is a UI-only mock authentication system.

- No real backend validation
- No JWT tokens
- No secure password handling
- localStorage is not encrypted
- Suitable for prototyping and demos only

For production, implement:
- Real backend authentication
- JWT tokens
- Secure password hashing
- HTTPS
- CSRF protection
- Rate limiting

## Customization

### Adding New User Pages
1. Create page in `src/pages/user/`
2. Add route in `AppRoutes.jsx` under `/user` routes
3. Add menu item in `UserSidebar.jsx`

### Adding New Admin Pages
1. Create page in `src/pages/admin/`
2. Add route in `AppRoutes.jsx` under `/admin` routes
3. Add menu item in `AdminSidebar.jsx`

### Adding New Roles
1. Update `AuthContext.jsx` login logic
2. Update `ProtectedRoute` component
3. Add role selection option in `Login.jsx`
4. Create new layout and routes

## UI/UX Highlights

✅ Completely separate User and Admin panels  
✅ Role-based route protection  
✅ Clean, professional SaaS design  
✅ Responsive layouts (mobile-friendly)  
✅ Smooth animations and transitions  
✅ Active route highlighting  
✅ Loading states  
✅ Form validation  
✅ Collapsible sidebar sections (Admin)  
✅ Search functionality  
✅ Notification badges  
✅ Profile dropdowns  

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please refer to the code comments and this documentation.
