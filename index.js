// Import routes
const express = require("express");
const db = require("./app/config/database");


const PORT = 3000;

const app = express();

app.use('/', (req, res) => {
  res.send('Hola Alfonsete');
});

// Up server
db.connectDB().then(() => {
  app.listen(3000, () => {
    console.log(`Listening on http://localhost:3000/`)
  });
});
