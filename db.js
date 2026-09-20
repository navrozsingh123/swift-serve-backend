require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;

// Serverless instances re-run this module, so the connection is cached and
// shared rather than re-dialled per request. A failed attempt clears the cache
// so the next request can retry instead of reusing a rejected promise.
let connectionPromise = null;

const mongoDB = () => {
    if (!mongoURI) {
        return Promise.reject(
            new Error("MONGO_URI is not set. Add it to server/.env before starting the server.")
        );
    }

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(mongoURI)
            .then((conn) => {
                console.log("Connected to MongoDB");
                return conn;
            })
            .catch((err) => {
                connectionPromise = null;
                throw err;
            });
    }

    return connectionPromise;
};

module.exports = mongoDB;
