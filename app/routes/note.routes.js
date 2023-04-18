module.exports = (app) => {
  const note = require("../controllers/note.controller.js");

  const verifyToken = require("../middlewares/verifyToken");

  var router = require("express").Router();

  router.post("/create", verifyToken, note.create);

  router.get("/find-one", verifyToken, note.findOne);

  router.get("/find-all", verifyToken, note.findAll);

  app.use("/api/note", router);
};
