import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRecipes } from "../context/RecipeContext";

const RecipeCard = ({ recipe }) => {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useRecipes();
  const fav = isFavorite(recipe.idMeal);

  const toggleFav = (e) => {
    e.preventDefault();
    if (!user) return;
    fav ? removeFavorite(recipe.idMeal) : addFavorite(recipe);
  };

  return (
    <Link to={`/recipe/${recipe.idMeal}`} className="recipe-card">
      <div className="recipe-card-img">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          loading="lazy"
        />
        {user && (
          <button
            className={`fav-btn ${fav ? "fav-active" : ""}`}
            onClick={toggleFav}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            {fav ? "♥" : "♡"}
          </button>
        )}
      </div>
      <div className="recipe-card-body">
        <h3>{recipe.strMeal}</h3>
        {recipe.strCategory && (
          <span className="recipe-tag">{recipe.strCategory}</span>
        )}
        {recipe.strArea && (
          <span className="recipe-tag recipe-tag-area">{recipe.strArea}</span>
        )}
      </div>
    </Link>
  );
};

export default RecipeCard;
