import { db } from "../config/db.js";

/**
 * Add or update review
 * One review per user per recipe
 */
export const addReview = async ({ user_id, recipe_id, rating, comment }) => {
  const query = `
    INSERT INTO reviews (user_id, recipe_id, rating, comment)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      rating = VALUES(rating),
      comment = VALUES(comment),
      created_at = CURRENT_TIMESTAMP
  `;

  await db.execute(query, [user_id, recipe_id, rating, comment]);

  return true;
};

/**
 * Get all reviews for a recipe
 */
export const getReviewsByRecipe = async (recipe_id) => {
  const query = `
    SELECT 
      r.rating,
      r.comment,
      r.created_at,
      u.name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.recipe_id = ?
    ORDER BY r.created_at DESC
  `;

  const [rows] = await db.execute(query, [recipe_id]);
  return rows;
};

/**
 * Get average rating and total reviews for a recipe
 */
export const getAverageRating = async (recipe_id) => {
  const query = `
    SELECT 
      ROUND(AVG(rating), 1) AS avgRating,
      COUNT(*) AS totalReviews
    FROM reviews
    WHERE recipe_id = ?
  `;

  const [rows] = await db.execute(query, [recipe_id]);
  return rows[0];
};