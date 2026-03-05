import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import RecipeCard from "../components/RecipeCard";

const Search = () => {
  const [searchParams] = useSearchParams();
  const { searchRecipes, fetchByCategory, searchResults, searchQuery, loading, error } = useRecipes();
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      fetchByCategory(cat).then(setResults);
      setInput(cat);
    }
  }, []);

  useEffect(() => {
    setResults(searchResults);
  }, [searchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) searchRecipes(input);
  };

  return (
    <main className="search-page">
      <h1>Search Recipes</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search by name (e.g. pasta, curry, soup…)"
          aria-label="Search recipes"
          className="search-input"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <div className="error-msg" role="alert">{error}</div>}

      {searchQuery && !loading && (
        <p className="results-count">
          {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
        </p>
      )}

      {results.length > 0 && (
        <div className="recipes-grid">
          {results.map((r) => (
            <RecipeCard key={r.idMeal} recipe={r} />
          ))}
        </div>
      )}

      {searchQuery && !loading && results.length === 0 && (
        <div className="empty-state">
          <p>No recipes found. Try a different search term.</p>
        </div>
      )}
    </main>
  );
};

export default Search;
