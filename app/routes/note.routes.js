module.exports = (app) => {
  const note = require("../controllers/note.controller.js");

  const verifyToken = require("../middlewares/verifyToken");

  var router = require("express").Router();

  router.post("/create", verifyToken, note.create);

  app.use("/api/note", router);
};
