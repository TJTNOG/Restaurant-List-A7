const express = require('express')
const mongoose = require('mongoose')

const port = 3000

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express()

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  console.log("mongodb connected!");
});

app.get('/', (req, res) => {
  res.send('This is my Restaurant List.')
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
})