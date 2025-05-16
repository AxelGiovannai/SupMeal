import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Meal } from '../services/api';

const Home = () => {
  const [randomMeals, setRandomMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRandomMeals = async () => {
      try {
        const meals = await api.getRandomMeals();
        setRandomMeals(meals);
      } catch (error) {
        console.error('Error fetching random meals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRandomMeals();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <section className="featured-meals">
        <h2>Random Recipes</h2>
        <div className="meals-grid">
          {randomMeals.map((meal) => (
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
      </section>
    </div>
  );
};

export default Home; 