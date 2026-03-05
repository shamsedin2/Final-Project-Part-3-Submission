import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import { useAuth } from "../context/AuthContext";

const RecipeDetail = () => {
  const { id } = useParams();
  const { fetchRecipeById, isFavorite, addFavorite, removeFavorite } = useRecipes();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipeById(id)
      .then(setRecipe)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (error || !recipe) return (
    <main className="detail-page">
      <div className="error-msg">{error || "Recipe not found."}</div>
      <Link to="/">← Back to Home</Link>
    </main>
  );

  // Parse ingredients from TheMealDB's format
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push({ ingredient: ing.trim(), measure: measure?.trim() || "" });
    }
  }

  const fav = isFavorite(recipe.idMeal);

  return (
    <main className="detail-page">
      <div className="detail-hero">
        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="detail-img" />
        <div className="detail-info">
          <div className="detail-tags">
            {recipe.strCategory && <span className="recipe-tag">{recipe.strCategory}</span>}
            {recipe.strArea && <span className="recipe-tag recipe-tag-area">{recipe.strArea}</span>}
          </div>
          <h1>{recipe.strMeal}</h1>

          {user && (
            <button
              className={`fav-btn-large ${fav ? "fav-active" : ""}`}
              onClick={() => fav ? removeFavorite(recipe.idMeal) : addFavorite(recipe)}
            >
              {fav ? "♥ Saved to Favorites" : "♡ Save to Favorites"}
            </button>
          )}

          {recipe.strYoutube && (
            <a
              href={recipe.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              ▶ Watch on YouTube
            </a>
          )}
        </div>
      </div>

      <div className="detail-body">
        <section className="ingredients-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {ingredients.map(({ ingredient, measure }, i) => (
              <li key={i}>
                <span className="measure">{measure}</span>
                <span className="ingredient">{ingredient}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="instructions-section">
          <h2>Instructions</h2>
          <div className="instructions">
            {recipe.strInstructions?.split("\n").filter(Boolean).map((step, i) => (
              <p key={i}>{step}</p>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default RecipeDetail;
