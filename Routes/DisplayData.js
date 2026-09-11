const express = require("express");
const router = express.Router();

router.get("/displayData", async (req, res) => {
    try {
        res.send(global.menu);
    } catch (err) {
        console.error("Error fetching menu data:", err.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;
