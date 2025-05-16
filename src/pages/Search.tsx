import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Meal } from '../services/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');

  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categoriesData, areasData, ingredientsData] = await Promise.all([
          api.getCategories(),
          api.getAreas(),
          api.getIngredients()
        ]);
        console.log('Ingredients loaded:', ingredientsData); 
        setCategories(categoriesData.map((cat: any) => cat.strCategory));
        setAreas(areasData);
        setIngredients(ingredientsData.filter(Boolean).sort()); 
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        let results;
        if (selectedCategory || selectedArea || selectedIngredient) {
          results = await api.searchWithFilters({
            category: selectedCategory,
            area: selectedArea,
            ingredient: selectedIngredient
          });
        } else if (query) {
          results = await api.searchMeals(query);
        } else {
          results = await api.getRandomMeals();
        } 
        setMeals(results);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [query, selectedCategory, selectedArea, selectedIngredient]);

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedArea('');
    setSelectedIngredient('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="search-page">
      <div className="filters">
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category"
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="area">Origin</label>
            <select
              id="area"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="">All origins</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="ingredient">Main Ingredient</label>
            <select
              id="ingredient"
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
            >
              <option value="">All ingredients</option>
              {ingredients.map((ingredient) => (
                <option key={ingredient} value={ingredient}>
                  {ingredient}
                </option>
              ))}
            </select>
          </div>

          <button className="reset-button" onClick={handleReset}>
            Reset filters
          </button>
        </div>
      </div>

      <div className="active-filters">
        {(selectedCategory || selectedArea || selectedIngredient) && (
          <div className="filters-summary">
            Active filters:
            {selectedCategory && <span className="filter-tag">Category: {selectedCategory}</span>}
            {selectedArea && <span className="filter-tag">Origin: {selectedArea}</span>}
            {selectedIngredient && <span className="filter-tag">Ingredient: {selectedIngredient}</span>}
          </div>
        )}
      </div>

      <div className="search-results">
        <h2>
          {meals.length > 0 ? `${meals.length} results found` : 'No results'}
          {query && ` for "${query}"`}
        </h2>
        <div className="meals-grid">
          {meals.map((meal) => (
            <div key={meal.idMeal} className="meal-card">
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <div className="meal-card-content">
                <h3>{meal.strMeal}</h3>
                <div className="meal-card-info">
                  <p>Category: {meal.strCategory}</p>
                  <p>Origin: {meal.strArea}</p>
                </div>
                <Link to={`/recipe/${meal.idMeal}`}>View Recipe</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search; 