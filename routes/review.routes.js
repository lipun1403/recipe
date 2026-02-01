import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createReview,
  getRecipeReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/:recipeId", getRecipeReviews);

export default router;
