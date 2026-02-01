import { clearCache } from "../recipe/utils/cache.js";

document.addEventListener("DOMContentLoaded", () => {
  // DOM references (SAFE)
  const backBtn = document.getElementById("backBtn");
  const ratingInput = document.getElementById("rating");
  const reviewInput = document.getElementById("review");
  const submitBtn = document.getElementById("submitBtn");
  const reviewForm = document.getElementById("reviewForm");

  // Get recipe ID
  const recipeId = new URLSearchParams(window.location.search).get("id");

  // 🔙 Back button
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (!recipeId) {
        window.location.href = "../index.html";
      } else {
        window.location.href = `../recipe/detailRecipe/recipe.html?id=${recipeId}`;
      }
    });
  }

  // Token
  const token = localStorage.getItem("token");

  /* initial state */
  submitBtn.disabled = true;

  function checkForm() {
    submitBtn.disabled = !(ratingInput.value && reviewInput.value.trim());
  }

  ratingInput.addEventListener("change", checkForm);
  reviewInput.addEventListener("input", checkForm);

  // Submit review
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!token || !recipeId) {
      alert("Invalid action");
      return;
    }

    const reviewData = {
      recipe_id: recipeId,
      rating: Number(ratingInput.value),
      comment: reviewInput.value.trim(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to submit review");
        return;
      }

      // 🔥 Cache invalidation
      clearCache("recipes_list");
      clearCache(`recipe_detail_${recipeId}`);
      clearCache(`reviews_${recipeId}`);

      // Redirect back
      window.location.href = `../recipe/detailRecipe/recipe.html?id=${recipeId}`;
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
});
