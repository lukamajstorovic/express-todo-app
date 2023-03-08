const db = require("../models");
const Note = db.note;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: "Content can not be empty!",
  //   });
  //   return;
  // }

  // Create a Tutorial
  const note = {
    title: req.body.title,
    body: req.body.body,
  };

  // Save Tutorial in the database
  Note.create(note)
    .then((data) => {
      console.log("NOTE CREATE");
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the note.",
      });
    });
};

// // Retrieve all Tutorials from the database.
// exports.findAll = (req, res) => {};

// // Find a single Tutorial with an id
// exports.findOne = (req, res) => {};

// // Update a Tutorial by the id in the request
// exports.update = (req, res) => {};

// // Delete a Tutorial with the specified id in the request
// exports.delete = (req, res) => {};

// exports.updateNoteStatus = (req, res) => {};
