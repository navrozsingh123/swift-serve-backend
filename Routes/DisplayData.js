const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/displayData", async (req, res) => {
    try {
        const db = mongoose.connection.getClient().db();
        const menuCollection = db.collection("menu");
        const foodCategoryCollection = db.collection("foodCategory");

        const foodItems = await menuCollection.find({}).toArray();
        const foodCategory = await foodCategoryCollection.find({}).toArray();

        res.json({ foodCategory, foodItems });
    } catch (err) {
        console.error("Error fetching menu data:", err.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;
// const express = require("express");
// const router = express.Router();

// router.get("/displayData", async (req, res) => {
//     try {
//         res.send(global.menu);
//     } catch (err) {
//         console.error("Error fetching menu data:", err.message);
//         res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
// });

// module.exports = router;
