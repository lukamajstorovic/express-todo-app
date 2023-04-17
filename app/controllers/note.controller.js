const db = require("../models");
const Note = db.note;

exports.create = async (req, res) => {
  try {
    const {
      user: { id: author },
    } = req;
    const { title, body } = req.body;
    const status = "active";

    if (!title) {
      return res.status(400).send({
        message: "Title can not be empty!",
      });
    }
    if (!body) {
      return res.status(400).send({
        message: "Body can not be empty!",
      });
    }

    const note = {
      title,
      body,
      status,
      author,
    };

    const createdNote = await Note.create(note);
    console.log("Note created successfully");
    return res.send(createdNote);
  } catch (err) {
    return res.status(500).send({
      message: err.message || "An error occurred while creating the note.",
    });
  }
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
