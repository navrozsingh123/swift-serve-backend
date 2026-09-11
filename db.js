require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

const mongoDB = async () => {
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");

        // Use conn.connection.db (from the resolved connection object)
        const db = conn.connection.db;

        const menuCollection = db.collection("menu");
        const foodCategoryCollection = db.collection("foodCategory");


        const foodItems = await menuCollection.find({}).toArray();
        const foodCategory = await foodCategoryCollection.find({}).toArray();

        global.menu = { foodCategory, foodItems };

    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = mongoDB;