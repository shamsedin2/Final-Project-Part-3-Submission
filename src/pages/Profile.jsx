import { useAuth } from "../context/AuthContext";
import { useRecipes } from "../context/RecipeContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const { favorites } = useRecipes();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h1>{user?.name}</h1>
        <p className="profile-email">{user?.email}</p>

        <div className="profile-stats">
          <div className="stat">
            <span className="stat-number">{favorites.length}</span>
            <span className="stat-label">Saved Recipes</span>
          </div>
        </div>

        <button className="btn-danger" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </main>
  );
};

export default Profile;
