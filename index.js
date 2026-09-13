require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const express = require('express');
const app = express();
const port = 5001;
const mongoDB = require('./db');
const cors = require('cors');

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin === "http://localhost:5173" ||
      /^https:\/\/swift-serve-frontend.*\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
mongoDB();

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.use(express.json());
app.get('/', (req, res) => {
  res.json({
    message: "SwiftServe backend is working!"
  });
});
app.use("/api", require('./Routes/CreateUser'));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});