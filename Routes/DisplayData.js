const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const mongoDB = require("../db");

router.get("/displayData", async (req, res) => {
    try {
        // Awaiting the cached connection means a cold start waits for the
        // database instead of reporting it as unavailable.
        await mongoDB();

        const db = mongoose.connection.getClient().db();

        const [foodItems, foodCategory] = await Promise.all([
            db.collection("menu").find({}).toArray(),
            db.collection("foodCategory").find({}).toArray(),
        ]);

        res.json({ foodCategory, foodItems });
    } catch (err) {
        console.error("Error fetching menu data:", err.message);
        res.status(503).json({ success: false, error: "Database is not available" });
    }
});

module.exports = router;
