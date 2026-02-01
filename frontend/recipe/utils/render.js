import { fetchRecipeRating } from "./rating.js";

export function displayRecipes(recipeList) {
  const container = document.getElementById("recipesContainer");
  container.innerHTML = "";

  recipeList.forEach(async (recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">

      <div class="recipe-info">
        <h3>${recipe.strMeal}</h3>
        <p>🍽 ${recipe.strCategory}</p>
        <span class="tag">${recipe.strArea || "Global"}</span>

        <div class="rating" id="rating-${recipe.idMeal}">
          ⭐ Loading...
        </div>

        <button class="view-btn"
          onclick="window.location.href='recipe/detailRecipe/recipe.html?id=${recipe.idMeal}'">
          View Recipe
        </button>
      </div>
    `;

    container.appendChild(card);

    // Fetch rating asynchronously
    const ratingDiv = document.getElementById(`rating-${recipe.idMeal}`);
    const { avg, total } = await fetchRecipeRating(recipe.idMeal);

    ratingDiv.innerHTML =
      total > 0
        ? `⭐ ${avg} <span class="count">(${total})</span>`
        : `⭐ No ratings`;
  });
}
