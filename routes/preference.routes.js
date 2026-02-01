import express from "express";
import {
  createPreference,
  getPreference,
} from "../controllers/preference.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createPreference);
router.get("/", protect, getPreference);

export default router;
