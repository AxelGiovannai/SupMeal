import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Meal } from '../services/api';

const ITEMS_PER_PAGE = 10;
const CURRENT_PAGE_KEY = 'recipes-current-page';

const Recipes = () => {
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem(CURRENT_PAGE_KEY);
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAllMeals = async () => {
      setLoading(true);
      try {
        const meals = await api.getAllMeals();
        setAllMeals(meals);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMeals();
  }, []);

  useEffect(() => {
    localStorage.setItem(CURRENT_PAGE_KEY, currentPage.toString());
  }, [currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil(allMeals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMeals = allMeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPreviousPage = () => {
    setCurrentPage(page => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(page => Math.min(totalPages, page + 1));
  };

  return (
    <div className="recipes-page">
      <div className="meals-grid">
        {currentMeals.map((meal) => (
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

      <div className="recipes-navigation">
        <button 
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="nav-button"
        >
          Previous
        </button>

        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>

        <button 
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="nav-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Recipes; 