const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

var corsOptions = {
  origin: "http://localhost:8000",
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));


const pool = new Pool({
  user: "root",
  host: "localhost",
  database: "todo_app",
  password: "pass",
  port: 5432,
});

app.get("/ping", (req, res) => {
  res.json("pong");
});

app.listen(PORT, () => {
  console.log(`App running on port ${port}.`);
});
