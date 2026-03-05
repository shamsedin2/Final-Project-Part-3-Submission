import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

// SECURITY: Generate CSRF token for form protection
const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
};

// SECURITY: Sanitize user input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// SECURITY: Decode JWT payload without verification (frontend only)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// SECURITY: Create a mock JWT (in production this comes from your backend)
const createMockJWT = (user) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    })
  );
  const signature = btoa("mock-signature"); // Real apps: server signs this
  return `${header}.${payload}.${signature}`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Generate CSRF token on mount
    const token = generateCSRFToken();
    setCsrfToken(token);
    // SECURITY: Store CSRF token in sessionStorage (not localStorage)
    sessionStorage.setItem("csrf_token", token);

    // Restore session from sessionStorage (not localStorage — mitigates XSS persistence)
    const storedToken = sessionStorage.getItem("auth_token");
    if (storedToken) {
      const decoded = decodeJWT(storedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({ id: decoded.sub, email: decoded.email, name: decoded.name });
      } else {
        sessionStorage.removeItem("auth_token");
      }
    }
    setLoading(false);
  }, []);

  // Mock user store (in production, this is your database)
  const getUserStore = () => {
    const stored = localStorage.getItem("recipe_users");
    return stored ? JSON.parse(stored) : [];
  };

  const saveUserStore = (users) => {
    localStorage.setItem("recipe_users", JSON.stringify(users));
  };

  const register = useCallback(async ({ name, email, password, formCsrf }) => {
    // SECURITY: Validate CSRF token
    if (formCsrf !== sessionStorage.getItem("csrf_token")) {
      throw new Error("Invalid request. Please refresh and try again.");
    }

    // Sanitize inputs
    const safeName = sanitizeInput(name.trim());
    const safeEmail = sanitizeInput(email.trim().toLowerCase());

    if (!safeName || !safeEmail || !password) {
      throw new Error("All fields are required.");
    }
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const users = getUserStore();
    if (users.find((u) => u.email === safeEmail)) {
      throw new Error("An account with this email already exists.");
    }

    // SECURITY: In production, hash password server-side. Here we simulate it.
    const newUser = {
      id: crypto.randomUUID(),
      name: safeName,
      email: safeEmail,
      passwordHash: btoa(password), // NOT secure — use bcrypt on a real backend
    };

    saveUserStore([...users, newUser]);

    const token = createMockJWT(newUser);
    // SECURITY: Store in sessionStorage (cleared on tab close)
    sessionStorage.setItem("auth_token", token);
    setUser({ id: newUser.id, email: newUser.email, name: newUser.name });
    return newUser;
  }, []);

  const login = useCallback(async ({ email, password, formCsrf }) => {
    // SECURITY: Validate CSRF token
    if (formCsrf !== sessionStorage.getItem("csrf_token")) {
      throw new Error("Invalid request. Please refresh and try again.");
    }

    const safeEmail = sanitizeInput(email.trim().toLowerCase());
    const users = getUserStore();
    const found = users.find(
      (u) => u.email === safeEmail && u.passwordHash === btoa(password)
    );

    if (!found) {
      throw new Error("Invalid email or password.");
    }

    const token = createMockJWT(found);
    sessionStorage.setItem("auth_token", token);
    setUser({ id: found.id, email: found.email, name: found.name });
    return found;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("auth_token");
    // Rotate CSRF token on logout
    const newToken = generateCSRFToken();
    setCsrfToken(newToken);
    sessionStorage.setItem("csrf_token", newToken);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, csrfToken, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
