import {
  addReview,
  getReviewsByRecipe,
  getAverageRating,
} from "../models/review.model.js";

/**
 * Create or update review
 * POST /api/reviews
 */
export const createReview = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { recipe_id, rating, comment } = req.body;

    if (!recipe_id || !rating) {
      return res.status(400).json({
        message: "Recipe ID and rating required",
      });
    }

    await addReview({ user_id, recipe_id, rating, comment });

    res.status(201).json({
      message: "Review submitted successfully",
    });
  } catch (err) {
    // Only needed if you DID NOT use UPSERT
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "You have already reviewed this recipe",
      });
    }

    console.error("Create review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get reviews + average rating for recipe
 * GET /api/reviews/:recipeId
 */
export const getRecipeReviews = async (req, res) => {
  try {
    const { recipeId } = req.params;

    // ✅ NO destructuring here
    const reviews = await getReviewsByRecipe(recipeId);
    const ratingStats = await getAverageRating(recipeId);

    res.json({
      averageRating: ratingStats?.avgRating || 0,
      totalReviews: ratingStats?.totalReviews || 0,
      reviews,
    });
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
