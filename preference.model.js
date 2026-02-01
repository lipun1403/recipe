import { db } from "../config/db.js";

/**
 * Insert or update user preferences (UPSERT)
 * Requires UNIQUE(user_id) in DB
 */
export const savePreference = async ({
  user_id,
  diet_type,
  allergies,
  cooking_level,
  disliked_ingredients,
}) => {
  const query = `
    INSERT INTO preferences 
      (user_id, diet_type, allergies, cooking_level, disliked_ingredients)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      diet_type = VALUES(diet_type),
      allergies = VALUES(allergies),
      cooking_level = VALUES(cooking_level),
      disliked_ingredients = VALUES(disliked_ingredients)
  `;

  await db.execute(query, [
    user_id,
    diet_type,
    allergies,
    cooking_level,
    disliked_ingredients,
  ]);

  return true;
};

/**
 * Get preferences by user
 */
export const getPreferenceByUser = async (userId) => {
  const query = `
    SELECT *
    FROM preferences
    WHERE user_id = ?
  `;

  const [rows] = await db.execute(query, [userId]);
  return rows[0] || null;
};
