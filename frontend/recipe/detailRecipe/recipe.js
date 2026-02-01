// js/recipe/recipe-details.js

import { getCache, setCache } from "../utils/cache.js";

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

console.log("URL:", window.location.href);
console.log("ID:", recipeId);

// 🔑 Cache key per recipe
const RECIPE_DETAIL_KEY = `recipe_detail_${recipeId}`;

const titleEl = document.getElementById("recipeTitle");
const imageEl = document.getElementById("recipeImage");
const metaEl = document.getElementById("recipeMeta");
const ingredientsList = document.getElementById("ingredientsList");
const stepsList = document.getElementById("stepsList");

function renderRecipe(recipe) {
  // Clear old content (important when using cache)
  ingredientsList.innerHTML = "";
  stepsList.innerHTML = "";

  // Title & image
  titleEl.textContent = recipe.strMeal;
  imageEl.src = recipe.strMealThumb;

  // Meta info
  metaEl.textContent = `${recipe.strCategory} | ${recipe.strArea}`;

  // Ingredients
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      const li = document.createElement("li");
      li.textContent = `${ingredient} - ${measure}`;
      ingredientsList.appendChild(li);
    }
  }

  // Instructions (steps)
  recipe.strInstructions
    .split(".")
    .filter((step) => step.trim())
    .forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step.trim();
      stepsList.appendChild(li);
    });
}

async function loadRecipeDetails() {
  if (!recipeId) {
    titleEl.textContent = "Recipe not found";
    return;
  }

  /* ===============================
     1️⃣ TRY CACHE FIRST
     =============================== */
  const cachedRecipe = getCache(RECIPE_DETAIL_KEY);
  if (cachedRecipe) {
    console.log("✅ Recipe details loaded from cache");
    renderRecipe(cachedRecipe);
    return;
  }

  /* ===============================
     2️⃣ FETCH FROM API (ONLY IF NEEDED)
     =============================== */
  try {
    console.log("🌐 Fetching recipe details from API");
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
    );
    const data = await res.json();

    if (!data.meals) {
      titleEl.textContent = "Recipe not found";
      return;
    }

    const recipe = data.meals[0];

    // Save to cache
    setCache(RECIPE_DETAIL_KEY, recipe);

    renderRecipe(recipe);
  } catch (err) {
    console.error(err);
    titleEl.textContent = "Failed to load recipe";
  }
}

loadRecipeDetails();

/* ===============================
   🔗 NAVIGATION
   =============================== */
window.goToReview = function () {
  if (!recipeId) {
    alert("Recipe not found");
    return;
  }

  window.location.href = `../../review/review.html?id=${recipeId}`;
};

window.goHome = function () {
  window.location.href = "../../index.html";
};
