const express = require("express");
const bcrypt = require ("bcryptjs");
const jwt = require ("jsonwebtoken");
const pool = require("../db.js");

const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// LOGIN USER
router.post("/Login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
});

module.exports = router;
