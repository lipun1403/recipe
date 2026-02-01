// models/user.model.js
import { db } from "../config/db.js";

/**
 * Create a new user
 */
export const createUser = async (user) => {
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  const [result] = await db.execute(query, [
    user.name,
    user.email,
    user.password,
  ]);

  return result.insertId;
};

/**
 * Find user by email
 */
export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = ?";

  const [rows] = await db.execute(query, [email]);
  return rows[0] || null;
};
