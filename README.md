# 🥘 RecipeVault

A full-featured recipe discovery app built with React, featuring user authentication, favorites management, and live recipe data from TheMealDB API.

**[Live Demo →](https://your-app.vercel.app)** &nbsp;|&nbsp; **[GitHub →](https://github.com/your-username/recipevault)**

---

## 📸 Screenshots

| Home | Search | Recipe Detail | Profile |
|------|--------|---------------|---------|
| Hero + featured recipes | Search any meal | Ingredients + instructions | Saved favorites |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| State | React Context API |
| Styling | Custom CSS (mobile-first) |
| API | [TheMealDB](https://www.themealdb.com/api.php) (free, no key required) |
| Auth | JWT-based (client-side mock) |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel |

---

## ✨ Features

### Core
- 🔍 Search 1,000+ recipes by name or ingredient
- 🗂 Browse by category (Chicken, Vegetarian, Seafood, Dessert, and more)
- 📋 Full recipe detail with ingredients and step-by-step instructions
- 📱 Mobile-first responsive design

### Authentication
- ✅ User registration with form validation
- ✅ JWT-based login / logout
- ✅ Protected routes (Favorites, Profile) redirect to login
- ✅ Session persisted in `sessionStorage` (cleared on tab close)
- ✅ Per-user favorites stored in `localStorage`

### Security
- 🔒 **XSS protection** — all user inputs sanitized via `sanitizeInput()` before processing
- 🔒 **CSRF protection** — cryptographic token generated on mount, validated on every form submission
- 🔒 **Secure token storage** — JWT stored in `sessionStorage`, not `localStorage`, to reduce XSS persistence risk
- 🔒 **Token expiry** — JWTs expire after 1 hour; expired tokens are rejected on page load

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/recipevault.git
cd recipevault

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

This project uses TheMealDB's free public API — **no API key required**. If you add a paid API in the future, create a `.env` file:

```env
VITE_MEAL_DB_BASE_URL=https://www.themealdb.com/api/json/v1/1
# Add other keys here — NEVER commit this file
```

All `VITE_` prefixed variables are injected at build time by Vite. On Vercel, add them under **Project Settings → Environment Variables**.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run with coverage report
npm run coverage
```

### What's Tested

| Area | Coverage |
|------|----------|
| `sanitizeInput` — XSS prevention | ✅ 7 cases |
| `AuthContext` — register / login / logout | ✅ 6 cases |
| CSRF token generation & validation | ✅ 2 cases |
| `ProtectedRoute` — redirect when unauthenticated | ✅ 1 case |
| `Login` form — rendering, validation, errors | ✅ 3 cases |
| `Register` form — validation, password rules | ✅ 3 cases |
| `RecipeCard` — rendering, auth-gated favorites | ✅ 4 cases |
| API URL construction | ✅ 3 cases |

---

## 📁 Project Structure

```
src/
├── __tests__/
│   └── auth.test.jsx        # All test suites
├── context/
│   ├── AuthContext.jsx       # JWT auth + CSRF + XSS protection
│   └── RecipeContext.jsx     # Recipe state, API calls, favorites
├── components/
│   ├── Navbar.jsx            # Navigation with auth-aware links
│   ├── RecipeCard.jsx        # Recipe card with favorite toggle
│   └── ProtectedRoute.jsx    # Auth guard for private pages
├── pages/
│   ├── Home.jsx              # Landing page with featured recipes
│   ├── Search.jsx            # Search by name or category
│   ├── RecipeDetail.jsx      # Full recipe with ingredients + steps
│   ├── Favorites.jsx         # 🔒 Protected — saved recipes
│   ├── Profile.jsx           # 🔒 Protected — user info
│   ├── Login.jsx             # Login form
│   └── Register.jsx          # Registration form
├── App.jsx                   # Router + provider composition
├── App.css                   # Global styles
└── setupTests.js             # Vitest + jsdom setup
```

---

## 🛣 Routes

| Path | Page | Protected |
|------|------|-----------|
| `/` | Home | No |
| `/search` | Search | No |
| `/recipe/:id` | Recipe Detail | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/favorites` | Favorites | ✅ Yes |
| `/profile` | Profile | ✅ Yes |

---

## 🔐 Authentication Details

Authentication uses a **client-side JWT simulation**. In a production app, token signing would happen on a secure server. Here's how it works:

1. **Register** — user data saved to `localStorage` (mock DB); JWT created and stored in `sessionStorage`
2. **Login** — credentials validated against stored users; JWT issued
3. **Protected Routes** — `ProtectedRoute` component checks auth state; redirects to `/login` if not authenticated
4. **Logout** — JWT removed from `sessionStorage`; CSRF token rotated
5. **Token Expiry** — tokens include `exp` claim (1 hour); checked on page load

**Why `sessionStorage` instead of `localStorage` for the JWT?**
Storing tokens in `sessionStorage` means they are cleared when the tab is closed, limiting the window of vulnerability if XSS does occur. See [OWASP Token Storage](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html).

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Vite — no build config needed
4. Add any environment variables under **Project Settings → Environment Variables**
5. Every push to `main` triggers a new deployment

---

## 🔮 Future Enhancements

- [ ] Real backend (Node/Express) with bcrypt password hashing
- [ ] HTTP-only cookie token storage (eliminates client-side XSS risk)
- [ ] Recipe ratings and personal notes
- [ ] Meal planning / weekly calendar
- [ ] Ingredient-based shopping list export

---

## 📄 License

MIT — free to use for portfolio and educational purposes.
# Final-Project-Part-3-Submission
