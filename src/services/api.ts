import axios from 'axios';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
}

export const api = {

  searchMeals: async (query: string) => {
    const response = await axios.get(`${BASE_URL}/search.php?s=${query}`);
    return response.data.meals || [];
  },

  getMealById: async (id: string) => {
    const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
    return response.data.meals?.[0];
  },

  getRandomMeals: async () => {
    const meals = [];
    for (let i = 0; i < 10; i++) {
      const response = await axios.get(`${BASE_URL}/random.php`);
      if (response.data.meals?.[0]) {
        meals.push(response.data.meals[0]);
      }
    }
    return meals;
  },

  getCategories: async () => {
    const response = await axios.get(`${BASE_URL}/categories.php`);
    return response.data.categories || [];
  },

  filterByCategory: async (category: string) => {
    const response = await axios.get(`${BASE_URL}/filter.php?c=${category}`);
    return response.data.meals || [];
  },

  getAreas: async () => {
    const response = await axios.get(`${BASE_URL}/list.php?a=list`);
    return response.data.meals?.map((area: { strArea: string }) => area.strArea) || [];
  },

  filterByArea: async (area: string) => {
    const response = await axios.get(`${BASE_URL}/filter.php?a=${area}`);
    return response.data.meals || [];
  },

  getIngredients: async () => {
    const response = await axios.get(`${BASE_URL}/list.php?i=list`);
    return response.data.meals?.map((ingredient: { strIngredient: string }) => ingredient.strIngredient) || [];
  },

  filterByIngredient: async (ingredient: string) => {
    const response = await axios.get(`${BASE_URL}/filter.php?i=${ingredient}`);
    return response.data.meals || [];
  },

  searchWithFilters: async (filters: { category?: string; area?: string; ingredient?: string }) => {
    let results: Meal[] = [];
    if (filters.ingredient) {
      results = await api.filterByIngredient(filters.ingredient);
    } else if (filters.category) {
      results = await api.filterByCategory(filters.category);
    } else if (filters.area) {
      results = await api.filterByArea(filters.area);
    } else {
      return [];
    }

    if (results.length > 0) {
      const detailedMeals = await Promise.all(
        results.map(meal => api.getMealById(meal.idMeal))
      );
      return detailedMeals.filter(meal => {
        if (!meal) return false;
        const matchesCategory = !filters.category || meal.strCategory === filters.category;
        const matchesArea = !filters.area || meal.strArea === filters.area; 
        return matchesCategory && matchesArea;
      });
    }
    return results;
  },


  getAllMeals: async () => {
    try {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
      const promises = alphabet.map(letter =>
        axios.get(`${BASE_URL}/search.php?f=${letter}`)
      );
      const responses = await Promise.all(promises);
      const allMeals = responses
        .flatMap(response => response.data.meals || [])
        .filter(Boolean);
      return allMeals.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    } catch (error) {
      console.error('Error fetching all meals:', error);
      return [];
    }
  }
}; 