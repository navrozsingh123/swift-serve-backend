const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const fetchUser = require("../middleware/fetchUser");

router.post("/orderData", fetchUser, async (req, res) => {
    const items = req.body.order_data;

    if (!Array.isArray(items) || items.length === 0) {
        return res
            .status(400)
            .json({ success: false, error: "order_data must be a non-empty array" });
    }

    // Each stored order is one array: the date entry followed by its items.
    // Build a new array instead of splicing the request body in place.
    const orderGroup = [{ Order_date: req.body.order_date || new Date().toDateString() }, ...items];

    try {
        // upsert removes the find-then-create race the previous two-branch version had.
        await Order.updateOne(
            { email: req.user.email },
            { $push: { order_data: orderGroup } },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        console.error("Failed to save order:", error);
        res.status(500).json({ success: false, error: "Could not save your order" });
    }
});

router.post("/myOrderData", fetchUser, async (req, res) => {
    try {
        const myData = await Order.findOne({ email: req.user.email });
        res.json({ success: true, orderData: myData });
    } catch (error) {
        console.error("Failed to load orders:", error);
        res.status(500).json({ success: false, error: "Could not load your orders" });
    }
});

module.exports = router;
