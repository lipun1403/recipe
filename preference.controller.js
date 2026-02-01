import {
  savePreference,
  getPreferenceByUser,
} from "../models/preference.model.js";

/**
 * Save or Update user preferences
 * POST /api/preferences
 * Protected
 */
export const createPreference = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { diet_type, allergies, cooking_level, disliked_ingredients } =
      req.body;

    // Basic validation
    if (!diet_type) {
      return res.status(400).json({
        message: "Diet type is required",
      });
    }

    // UPSERT (insert or update handled by DB)
    await savePreference({
      user_id,
      diet_type,
      allergies,
      cooking_level,
      disliked_ingredients,
    });

    res.status(200).json({
      message: "Preferences saved successfully",
    });
  } catch (err) {
    console.error("Preference error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * Get preferences of logged-in user
 * GET /api/preferences
 * Protected
 */
export const getPreference = async (req, res) => {
  try {
    const user_id = req.user.id;

    const preference = await getPreferenceByUser(user_id);

    if (!preference) {
      return res.status(404).json({
        message: "Preferences not found",
      });
    }

    res.status(200).json(preference);
  } catch (err) {
    console.error("Get preference error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};
