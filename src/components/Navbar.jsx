import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        🥘 RecipeVault
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        {user ? (
          <>
            <Link to="/favorites">Favorites</Link>
            <Link to="/profile">Profile</Link>
            <button className="nav-logout" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/register" className="nav-register">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
