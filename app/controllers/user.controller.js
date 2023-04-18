const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const secretKey = require("../config/db.config.js").secretKey;

exports.register = async (req, res) => {
  const saltRounds = 12;

  const { username, email, password } = req.body;

  const user = {
    username,
    email,
    password,
  };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  }

  try {
    const existingUserEmail = await User.findOne({ where: { email } });
    if (existingUserEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const existingUserName = await User.findOne({ where: { username } });
    if (existingUserName) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    user.password = hash;

    const createdUser = await User.create(user);
    res
      .status(200)
      .json({ message: "Registration successful", user: createdUser });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something went wrong while creating the user.",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = {
    email,
    password,
  };

  try {
    const data = await User.findOne({ where: { email: email } });
    if (!data) {
      res.status(404).send("User not found");
      return;
    }

    const isValid = await bcrypt.compare(user.password, data.password);
    if (!isValid) {
      res.status(401).send("Invalid password");
      return;
    }

    const token = jwt.sign({ id: data.id }, secretKey, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        // httpOnly: true,
        // secure: true,
        // sameSite: "none",
        maxAge: 3600000, // 1 hour
      })
      .status(200)
      .json({ token: token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .send({ error: "User with the provided ID not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "Unable to retrieve user information from the database" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "You have been logged out." });
};

// exports.refresh = (req, res) => {};

exports.deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const result = await User.destroy({
      where: { id: userId },
    });

    if (result == 1) {
      res.clearCookie("token");
      res.status(200).send({
        message: "User was deleted successfully!",
      });
    } else {
      res.status(404).send({
        message: `Cannot delete User with id=${userId}. Maybe User was not found!`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Could not delete User with id=" + userId,
    });
  }
};
