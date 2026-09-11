require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");

        const menuCollection = mongoose.connection.db.collection("menu");
        const foodCategoryCollection = mongoose.connection.db.collection("foodCategory");

        const foodItems = await menuCollection.find({}).toArray();
        const foodCategory = await foodCategoryCollection.find({}).toArray();

        global.menu = { foodCategory, foodItems };
        // console.log("Menu loaded:", global.menu);

    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = mongoDB;