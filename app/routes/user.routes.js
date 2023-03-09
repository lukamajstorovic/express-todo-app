const { check } = require("express-validator");

module.exports = (app) => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post(
    "/register",
    [
      check("email", "Your email is not valid")
        .not()
        .isEmpty()
        .isEmail()
        .normalizeEmail(),
      check("password", "Your password must be at least 4 characters")
        .not()
        .isEmpty()
        .isLength({ min: 4 }),
    ],
    user.register
  );

  router.post("/login", user.login);

  app.use("/api/user", router);
};
