module.exports = (app) => {
  const note = require("../controllers/note.controller.js");

  const verifyToken = require("../middlewares/verifyToken");

  var router = require("express").Router();

  router.post("/create", verifyToken, note.create);

  router.get("/find-one", verifyToken, note.findOne);

  router.get("/find-all", verifyToken, note.findAll);

  router.delete("/delete", verifyToken, note.delete);

  router.patch("/update", verifyToken, note.update);

  router.patch("/update-status", verifyToken, note.updateNoteStatus);

  app.use("/api/note", router);
};
