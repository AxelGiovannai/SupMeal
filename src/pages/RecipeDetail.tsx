import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Meal } from '../services/api';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getMealById(id);
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return (
      <div className="recipe-not-found">
        <h1>Recipe not found</h1>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Meal];
    const measure = recipe[`strMeasure${i}` as keyof Meal];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure });
    }
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-header">
        <h1>{recipe.strMeal}</h1>
        <div className="recipe-meta">
          <span>Category: {recipe.strCategory}</span>
          <span>Origin: {recipe.strArea}</span>
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-image">
          <img src={recipe.strMealThumb} alt={recipe.strMeal} />
        </div>

        <div className="recipe-ingredients">
          <h2>Ingredients</h2>
          <ul>
            {ingredients.map(({ ingredient, measure }, index) => (
              <li key={index}>
                {ingredient} - {measure}
              </li>
            ))}
          </ul>
        </div>

        <div className="recipe-instructions">
          <h2>Instructions</h2>
          {recipe.strInstructions.split('\n').map((step, index) => (
            <p key={index}>{step}</p>
          ))}
        </div>

        {recipe.strYoutube && (
          <div className="recipe-video">
            <h2>Video</h2>
            <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer">
              Watch video on YouTube
            </a>
          </div>
        )}
      </div>

      <div className="recipe-navigation">
        <Link to="/recipes">Back to Recipes</Link>
      </div>
    </div>
  );
};

export default RecipeDetail; 