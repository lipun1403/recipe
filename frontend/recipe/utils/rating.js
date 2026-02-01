import { getCache } from "./cache.js";

export async function fetchRecipeRating(recipeId) {
  const cache = getCache();

  // 1️⃣ Return cached rating if exists
  if (cache?.ratings?.[recipeId]) {
    return cache.ratings[recipeId];
  }

  // 2️⃣ Fetch from backend
  try {
    const res = await fetch(`http://localhost:5000/api/reviews/${recipeId}`);
    const data = await res.json();

    const rating = {
      avg: data.averageRating || 0,
      total: data.totalReviews || 0,
    };

    return rating;
  } catch {
    return { avg: 0, total: 0 };
  }
}
