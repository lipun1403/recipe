import { displayRecipes } from "./utils/render.js";
import { filterMeals } from "./utils/filter.js";
import { getCache, setCache } from "./utils/cache.js";

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// 🔑 Cache keys
const RECIPE_CACHE_KEY = "recipes_list";
const PREF_CACHE_KEY = "user_preferences";

const searchInput = document.getElementById("searchInput");
const dietFilter = document.getElementById("dietFilter");

let baseMeals = []; // after preference filtering
let visibleMeals = []; // after UI filtering

async function init() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "./auth/auth.html";
    return;
  }

  /* ===============================
     1️⃣ GET USER PREFERENCES (CACHE)
     =============================== */
  let preferences = getCache(PREF_CACHE_KEY);

  if (!preferences) {
    console.log("🌐 Fetching preferences from API");
    const prefRes = await fetch("http://localhost:5000/api/preferences", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    preferences = await prefRes.json();
    setCache(PREF_CACHE_KEY, preferences);
  } else {
    console.log("✅ Preferences loaded from cache");
  }

  /* ===============================
     2️⃣ GET RECIPES (CACHE)
     =============================== */
  let meals = getCache(RECIPE_CACHE_KEY);

  if (!meals) {
    console.log("🌐 Fetching recipes from API");
    const res = await fetch(API_URL);
    const data = await res.json();
    meals = data.meals || [];
    setCache(RECIPE_CACHE_KEY, meals);
  } else {
    console.log("✅ Recipes loaded from cache");
  }

  /* ===============================
     3️⃣ APPLY PREFERENCE FILTER (ONCE)
     =============================== */
  baseMeals = filterMeals(meals, preferences);

  /* ===============================
     4️⃣ INITIAL RENDER
     =============================== */
  visibleMeals = baseMeals;
  displayRecipes(visibleMeals);
}

/* ===============================
   🔍 SEARCH FILTER (NO API CALL)
   =============================== */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  visibleMeals = baseMeals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(value)
  );

  displayRecipes(visibleMeals);
});

/* ===============================
   🍽 DIET FILTER (NO API CALL)
   =============================== */
dietFilter.addEventListener("change", () => {
  const category = dietFilter.value;

  visibleMeals =
    category === "all"
      ? baseMeals
      : baseMeals.filter((meal) => meal.strCategory === category);

  displayRecipes(visibleMeals);
});

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  // 🔥 Clear auth token
  localStorage.removeItem("token");

  // 🔥 Clear ALL cached data (session-based)
  sessionStorage.clear();

  // Redirect to login page
  window.location.href = "./auth/auth.html";
});

init();
