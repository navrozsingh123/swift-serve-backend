require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoDB = require("./db");

const app = express();
const port = process.env.PORT || 5001;

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:4173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) =>
  allowedOrigins.includes(origin) ||
  /^https:\/\/swift-serve-frontend.*\.vercel\.app$/.test(origin);

app.use(cors({
  // Returning false denies the request cleanly; throwing here surfaced as an
  // opaque 500 instead of a CORS error.
  origin: (origin, callback) => {
    // Tools without an Origin header (curl, health checks) are not browsers.
    callback(null, !origin || isAllowedOrigin(origin));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "SwiftServe backend is working!"
  });
});

app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));

// Answer unknown routes with JSON. Express' default HTML 404 page made the
// client's response.json() throw, which hid the real problem behind a
// generic "could not reach the server" message.
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Cannot ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

// On Vercel the platform boots this module; exiting the process there would
// take down an API that is otherwise healthy, so missing config is loud but
// fatal only when running as a normal local server.
const isServerless = Boolean(process.env.VERCEL);

const fail = (message) => {
  console.error(message);
  if (!isServerless) process.exit(1);
};

if (!process.env.JWT_SECRET) {
  fail("JWT_SECRET is not set. Login and the order routes will fail until it is configured.");
}

// Connect in the background rather than before listening: a slow or failed
// database must not stop the app from coming up. Handlers await the same
// cached promise, so the first request simply waits for the connection.
mongoDB().catch((err) => fail(`MongoDB connection error: ${err.message}`));

app.listen(port, () => {
  console.log(`SwiftServe backend listening on port ${port}`);
});

module.exports = app;
