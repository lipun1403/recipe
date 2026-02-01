// js/recipe/filter.js

function getIngredients(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    if (ing && ing.trim() !== "") {
      ingredients.push(ing.toLowerCase());
    }
  }

  return ingredients;
}

export function filterMeals(meals, prefs, searchValue = "") {
  const allergies = prefs.allergies
    ? prefs.allergies.toLowerCase().split(",")
    : [];

  const disliked = prefs.disliked_ingredients
    ? prefs.disliked_ingredients.toLowerCase().split(",")
    : [];

  return meals.filter((meal) => {
    // 🔍 Search filter
    if (
      searchValue &&
      !meal.strMeal.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      return false;
    }

    // 🥗 Diet filter
    if (prefs.diet_type === "Vegetarian" && meal.strCategory !== "Vegetarian") {
      return false;
    }

    const ingredients = getIngredients(meal);

    // 🚫 Allergy filter
    if (allergies.some((a) => ingredients.includes(a))) {
      return false;
    }

    // ❌ Disliked ingredient filter
    if (disliked.some((d) => ingredients.includes(d))) {
      return false;
    }

    return true;
  });
}
