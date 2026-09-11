const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post(
  "/creatuser",
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

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    try {
      const newUser = await User.create({
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        password: secPassword
      });
      res.json({ success: true, user: newUser });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: err.message });
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
    let email = req.body.email;
    try {
      let userData = await User.findOne({ email });
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
        user:{
            id: userData.id
        }
      }

      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ success: true, authToken});
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

module.exports = router;
