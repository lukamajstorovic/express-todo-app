const db = require("../models");
const User = db.user;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // if (!req.body.username) {
  //   res.status(400).send({
  //     message: "Content can not be empty!",
  //   });
  //   return;
  // }

  console.log("BODYYYYY: ", req.body);
  // Create a Tutorial
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  // Save Tutorial in the database
  User.create(user)
    .then((data) => {
      console.log("USER CREATE");
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user.",
      });
    });
};

// // Retrieve all Tutorials from the database.
// exports.login = (req, res) => {};

// // Find a single Tutorial with an id
// exports.logout = (req, res) => {};

// // Update a Tutorial by the id in the request
// exports.refresh = (req, res) => {};

// // Delete a Tutorial with the specified id in the request
// exports.deleteUser = (req, res) => {};
