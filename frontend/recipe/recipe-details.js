// js/recipe-details.js

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

const titleEl = document.getElementById("recipeTitle");
const imageEl = document.getElementById("recipeImage");
const metaEl = document.getElementById("recipeMeta");
const ingredientsList = document.getElementById("ingredientsList");
const stepsList = document.getElementById("stepsList");

async function loadRecipeDetails() {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
    );
    const data = await res.json();

    if (!data.meals) {
      titleEl.textContent = "Recipe not found";
      return;
    }

    const recipe = data.meals[0];

    // Populate UI
    titleEl.textContent = recipe.strMeal;
    imageEl.src = recipe.strMealThumb;
    metaEl.textContent = `${recipe.strCategory} | ${recipe.strArea}`;

    // Ingredients (API gives 20 fields)
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        const li = document.createElement("li");
        li.textContent = `${ingredient} - ${measure}`;
        ingredientsList.appendChild(li);
      }
    }

    // Steps (instructions)
    recipe.strInstructions
      .split(".")
      .filter((step) => step.trim() !== "")
      .forEach((step) => {
        const li = document.createElement("li");
        li.textContent = step.trim();
        stepsList.appendChild(li);
      });
  } catch (error) {
    console.error(error);
    titleEl.textContent = "Error loading recipe";
  }
}

loadRecipeDetails();
