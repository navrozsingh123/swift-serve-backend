require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const express = require('express');
const app = express();
const port = 5001;
const mongoDB = require('./db');
const cors = require('cors');

app.use(cors());
mongoDB();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use("/api", require("./Routes/createuser"));
app.use("/api", require("./Routes/displayData"));
app.use("/api", require("./Routes/orderData"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});