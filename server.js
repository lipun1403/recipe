import express from "express";
import cors from "cors";
import "./config/db.js";
import morgan from "morgan";

import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import preferenceRoutes from "./routes/preference.routes.js";
import reviewRoutes from "./routes/review.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
