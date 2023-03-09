const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8000",
};

app.use(cors(corsOptions));

app.use(express.json());

const db = require("./models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.get("/ping", (req, res) => {
  console.log("PONG REQ");
  res.json("pong");
});

require("./routes/user.routes")(app);
require("./routes/note.routes")(app);

const PORT = process.env.port || 8080;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
