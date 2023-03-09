const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const db = require("../models");
const User = db.user;

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
    const hash = await bcrypt.hash(password, saltRounds);
    user.password = hash;
    User.create(user)
      .then((data) => {
        res.send(data);
        // res.status(200).json("Register suc");
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the user.",
        });
      });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = {
    email,
    password,
  };

  User.findOne({ where: { email: email } }).then(async (data) => {
    const isValid = await bcrypt.compare(user.password, data.password);
    res.send(isValid);
  });
};

// // Find a single Tutorial with an id
// exports.logout = (req, res) => {};

// // Update a Tutorial by the id in the request
// exports.refresh = (req, res) => {};

// // Delete a Tutorial with the specified id in the request
// exports.deleteUser = (req, res) => {};
