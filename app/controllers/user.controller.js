const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const secretKey = require("../config/db.config.js").secretKey;

// Create and Save a new Tutorial
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
  } else {
    var user2;
    user2 = User.findOne({ where: { email: email } }).then(async (data) => {
      res.send("A user with this Email already exists\n" + data);
    });
    user2 = User.findOne({ where: { username: username } }).then(
      async (data) => {
        res.send("A user with this username already exists\n" + data);
      }
    );
    if (!user2) {
      const hash = await bcrypt.hash(password, saltRounds);
      user.password = hash;
      User.create(user)
        .then((data) => {
          //res.send(data);
          res.status(200).json("Register successful");
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Something went wrong while creating the user.",
          });
        });
    }
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

    const token = jwt.sign(
      { username: data.username, email: data.email },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000, // 1 hour
      })
      .status(200)
      .json({ token: token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }

  // User.findOne({ where: { email: email } }).then(async (data) => {
  //   const isValid = await bcrypt.compare(user.password, data.password);
  //   res.send(data);
  // });
};

exports.getUserInfo = (req, res) => {
  // User information can be retrieved from the req.user object
  const { username } = req.user;
  const userInfo = {
    username,
    email: "example@gmail.com",
    // Add any other relevant user information here
  };
  res.json(userInfo);
};

// // Find a single Tutorial with an id
// exports.logout = (req, res) => {};

// // Update a Tutorial by the id in the request
// exports.refresh = (req, res) => {};

// // Delete a Tutorial with the specified id in the request
// exports.deleteUser = (req, res) => {};
