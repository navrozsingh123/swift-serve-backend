require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
    }
};

module.exports = mongoDB;
// require("dotenv").config();
// const mongoose = require("mongoose");
// const mongoURI = process.env.MONGO_URI;

// const mongoDB = async () => {
//     try {
//         await mongoose.connect(mongoURI);
//         console.log("Connected to MongoDB");

//         // Get the DB via the native client — more reliable than mongoose.connection.db
//         const client = mongoose.connection.getClient();
//         const db = client.db(); // uses the database from your URI; pass a name explicitly if needed, e.g. client.db("yourDbName")

//         const menuCollection = db.collection("menu");
//         const foodCategoryCollection = db.collection("foodCategory");

//         const foodItems = await menuCollection.find({}).toArray();
//         const foodCategory = await foodCategoryCollection.find({}).toArray();

//         global.menu = { foodCategory, foodItems };

//     } catch (err) {
//         console.error("MongoDB connection error:", err.message);
//     }
// };

// module.exports = mongoDB;