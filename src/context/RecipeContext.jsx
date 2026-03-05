import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const RecipeContext = createContext(null);

export const RecipeProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load favorites per user
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`favorites_${user.id}`);
      setFavorites(stored ? JSON.parse(stored) : []);
    } else {
      setFavorites([]);
    }
  }, [user]);

  const saveFavorites = (updated) => {
    if (user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updated));
    }
    setFavorites(updated);
  };

  const addFavorite = (recipe) => {
    if (!favorites.find((f) => f.idMeal === recipe.idMeal)) {
      saveFavorites([...favorites, recipe]);
    }
  };

  const removeFavorite = (id) => {
    saveFavorites(favorites.filter((f) => f.idMeal !== id));
  };

  const isFavorite = (id) => favorites.some((f) => f.idMeal === id);

  const searchRecipes = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearchQuery(query);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch recipes");
      const data = await res.json();
      setSearchResults(data.meals || []);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCategory = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`
      );
      if (!res.ok) throw new Error("Failed to fetch category");
      const data = await res.json();
      return data.meals || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeById = async (id) => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      if (!res.ok) throw new Error("Recipe not found");
      const data = await res.json();
      return data.meals?.[0] || null;
    } catch (err) {
      throw err;
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        favorites,
        searchResults,
        searchQuery,
        loading,
        error,
        addFavorite,
        removeFavorite,
        isFavorite,
        searchRecipes,
        fetchByCategory,
        fetchRecipeById,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipes must be used within RecipeProvider");
  return ctx;
};
