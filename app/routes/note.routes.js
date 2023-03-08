module.exports = (app) => {
  const note = require("../controllers/note.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", note.create);

  app.use("/api/note", router);
};
