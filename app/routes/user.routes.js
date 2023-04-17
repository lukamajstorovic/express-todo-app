const { check } = require("express-validator");

module.exports = (app) => {
  const user = require("../controllers/user.controller.js");

  const verifyToken = require("../middlewares/verifyToken");

  var router = require("express").Router();

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

  router.get("/verify-token", verifyToken, user.getUserInfo);

  router.get("/logout", user.logout);

  router.get("/delete-user", verifyToken, user.deleteUser);

  app.use("/api/user", router);
};
