# Razorpay Frontend Clone

A complete **frontend-only** React clone of the Razorpay fintech payment platform. Built with modern web technologies for learning and portfolio purposes.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx                 # Sticky navigation with mega menu
│   ├── MegaMenu.jsx              # Dropdown menu for navigation
│   ├── Hero.jsx                   # Landing page hero section
│   ├── FeatureSection.jsx        # Features grid with icons
│   ├── Testimonials.jsx          # Customer testimonials slider
│   ├── Slider.jsx                # Reusable carousel component
│   ├── FloatingActionBar.jsx     # Floating chat widget (Ask RAY)
│   └── Footer.jsx                 # Footer with links and CTA
│
├── pages/
│   ├── Home.jsx                   # Landing page
│   ├── Pricing.jsx               # Pricing plans page
│   ├── Login.jsx                 # Login form (UI only)
│   ├── Signup.jsx                # Signup form (UI only)
│   └── Dashboard.jsx             # User dashboard (UI only)
│
├── routes/
│   └── AppRoutes.jsx             # Route definitions
│
├── assets/
│   ├── images/                   # Image placeholders
│   └── icons/                    # Icon assets
│
├── App.jsx                        # Main application component
├── main.jsx                       # Entry point
├── index.css                      # Tailwind CSS and global styles
└── App.css                        # Legacy styles

tailwind.config.js                 # Tailwind configuration
postcss.config.js                  # PostCSS configuration
vite.config.js                     # Vite configuration
package.json                       # Dependencies and scripts
```

## 🎨 Features

### ✅ Implemented

1. **Responsive Navbar**
   - Sticky navigation
   - Mega dropdown menus for main categories
   - Mobile hamburger menu
   - Support for logged-in/logged-out states

2. **Hero Section**
   - Animated heading with gradient text
   - Floating dashboard cards with animations
   - CTA buttons with hover effects
   - Key statistics

3. **Feature Cards Grid**
   - 8 key features with icons
   - Hover animations
   - Clean card design with rounded corners

4. **Testimonials Slider**
   - Auto-playing carousel
   - Manual navigation controls
   - Star ratings
   - Customer avatars

5. **Pricing Page**
   - 3 pricing tiers (Starter, Professional, Enterprise)
   - Monthly/Annual toggle with savings calculation
   - Feature comparison table
   - FAQ accordion

6. **Authentication Pages**
   - Login form with email/password validation
   - Signup form with password strength indicator
   - Show/hide password toggle
   - Error messages and validations
   - Demo credentials display

7. **Dashboard** (UI Only)
   - Statistics cards with trends
   - Revenue chart visualization
   - Recent transactions table
   - Filter and export options
   - Quick stats sidebar

8. **Animations**
   - Smooth page transitions
   - Hover effects on buttons and cards
   - Floating animations on hero section
   - Slide-in and fade-in effects
   - Scroll-triggered animations

9. **Floating Action Bar**
   - Ask RAY chat widget (mockup)
   - Chat interface mockup
   - Smooth open/close animations

10. **Footer**
    - Multi-column link layout
    - Newsletter signup form
    - Social media links
    - Contact information
    - Compliance badges

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Steps

1. **Clone/Navigate to the project:**
   ```bash
   cd c:\Projects\razorpay
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## 🔐 Authentication (Mock)

The authentication system is **UI-only** and does not connect to any backend:

### Login Page
- **Email:** demo@razorpay.com
- **Password:** demo123
- ✅ Works without real backend
- ✅ Navigates to dashboard
- ✅ Persists login state in localStorage

### Signup Page
- Create account with business name, email, and password
- Password strength indicator
- Password confirmation validation
- Redirects to dashboard on successful signup

### Dashboard
- Only accessible when logged in
- Shows mock data (transactions, revenue, statistics)
- Mock charts and analytics
- Displays after successful login

## 🎯 Usage

### Navigate Pages
- **Home** - Landing page with features and testimonials
- **Pricing** - Pricing plans with comparison table
- **Login** - Login form (mock authentication)
- **Signup** - Registration form (mock authentication)
- **Dashboard** - User dashboard (only when logged in)

### Interactions
- Click navigation items to explore
- Hover over cards for animations
- Use mobile menu on small screens
- Toggle pricing between monthly/annual
- Open floating chat widget (Ask RAY)
- Click login/signup to navigate to auth pages

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the theme:
```js
colors: {
  primary: { /* Blue shades */ },
  secondary: { /* Gray shades */ }
}
```

### Animations
Customize animations in `tailwind.config.js`:
- Modify keyframes for custom effects
- Adjust animation timings
- Add new easing functions

### Content
Update component content directly in JSX files:
- Edit text in components
- Replace placeholder images
- Modify navigation items

## ⚙️ Environment Variables

No environment variables required (frontend-only project).

## 📱 Responsive Design

- **Desktop** - Full layout with mega menus
- **Tablet** - Optimized layout with adjusted spacing
- **Mobile** - Hamburger menu, stacked layout, touch-friendly

## 🔄 Local Storage

- **Login state** - Persisted in localStorage
- **Session** - Remains until logout or browser clear

## ⚡ Performance

- **Optimized bundle** with Vite
- **Image lazy loading** ready
- **CSS-in-JS** via Tailwind (no runtime overhead)
- **Code splitting** via React Router

## 🎓 Learning Points

This project demonstrates:
- React hooks (useState, useEffect)
- React Router for SPA navigation
- Tailwind CSS utility-first approach
- Framer Motion for complex animations
- Component composition and reusability
- Responsive design patterns
- Form validation
- State management with localStorage

## 📝 Notes

- This is a **frontend-only** project
- No backend/database integration
- No real authentication or payment processing
- Perfect for **portfolio**, **learning**, or **UI reference**
- All data is mock/placeholder data
- No external APIs are called

## 🤝 Contributing

Feel free to:
- Fork the project
- Modify components
- Add new features
- Improve animations
- Submit improvements

## 📄 License

This is an educational project for learning purposes. Razorpay is a trademark of its respective owners.

---

**Built with ❤️ using React + Tailwind CSS**

For questions or suggestions, feel free to explore the codebase!
