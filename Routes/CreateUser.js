const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

router.post(
  "/createuser",
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("location", "Enter a valid location").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be atleast 5 characters").isLength({
    min: 5,
  }),

  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const email = normalizeEmail(req.body.email);

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(409)
          .json({ success: false, error: "An account with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = await User.create({
        name: req.body.name,
        location: req.body.location,
        email,
        password: secPassword
      });

      // Never send the password hash back to the client.
      res.json({
        success: true,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    } catch (err) {
      // Duplicate key: the unique index caught a race the findOne above missed.
      if (err.code === 11000) {
        return res
          .status(409)
          .json({ success: false, error: "An account with this email already exists" });
      }
      console.error("Failed to create user:", err);
      res.status(500).json({ success: false, error: "Could not create your account" });
    }
  },
);

router.post(
  "/loginuser",
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be atleast 5 characters").isLength({
    min: 5,
  }),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const email = normalizeEmail(req.body.email);

    try {
      const userData = await User.findOne({ email });
      if (!userData) {
        return res
          .status(400)
          .json({ success: false, error: "Enter valid credentials" });
      }

      const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
      if (!pwdCompare) {
        return res.status(400).json({ success: false, error: "Enter valid credentials" });
      }

      const data = {
        user: {
          id: userData.id
        }
      };

      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ success: true, authToken, email: userData.email });
    } catch (err) {
      console.error("Failed to log in user:", err);
      res.status(500).json({ success: false, error: "Could not log you in" });
    }
  },
);

module.exports = router;
