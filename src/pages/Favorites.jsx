import { useRecipes } from "../context/RecipeContext";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { favorites } = useRecipes();
  const { user } = useAuth();

  return (
    <main className="favorites-page">
      <h1>Your Favorites</h1>
      <p className="page-subtitle">Saved recipes for {user?.name}</p>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>You haven't saved any recipes yet.</p>
          <Link to="/search" className="btn-primary">
            Discover Recipes
          </Link>
        </div>
      ) : (
        <div className="recipes-grid">
          {favorites.map((r) => (
            <RecipeCard key={r.idMeal} recipe={r} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Favorites;
