import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRecipes } from "../context/RecipeContext";
import RecipeCard from "../components/RecipeCard";

const CATEGORIES = ["Chicken", "Seafood", "Vegetarian", "Dessert"];

const Home = () => {
  const { user } = useAuth();
  const { fetchByCategory } = useRecipes();
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const load = async () => {
      const meals = await fetchByCategory("Chicken");
      setFeatured((meals || []).slice(0, 8));
      setLoadingFeatured(false);
    };
    load();
  }, []);

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>
            Discover <span className="accent">delicious</span> recipes
          </h1>
          <p>
            Explore thousands of recipes from around the world. Save your
            favorites and build your personal cookbook.
          </p>
          <div className="hero-actions">
            <Link to="/search" className="btn-primary">
              Explore Recipes
            </Link>
            {!user && (
              <Link to="/register" className="btn-outline">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2>Browse by Category</h2>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/search?category=${cat}`} className="category-pill">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <h2>Featured Recipes</h2>
        {loadingFeatured ? (
          <div className="skeleton-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : (
          <div className="recipes-grid">
            {featured.map((r) => (
              <RecipeCard key={r.idMeal} recipe={r} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
