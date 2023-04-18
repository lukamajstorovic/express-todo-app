const db = require("../models");
const { Op } = require("sequelize");
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

exports.findAll = async (req, res) => {
  try {
    const { id: author } = req.user;
    const condition = author && { author: { [Op.iLike]: `%${author}%` } };
    const notes = await Note.findAll({ where: condition });
    if (notes.length === 0) {
      return res.status(200).json({ message: "No notes made yet." });
    }
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).send({
      message: error.message || "An error occurred while retrieving notes 2.",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id: noteId } = req.body;
    const note = await Note.findByPk(noteId);
    if (!note) {
      return res.status(404).send({ error: "Note not found" });
    }
    if (req.user.id != note.author) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Unable to retrieve note" });
  }
};

// // Update a Tutorial by the id in the request
// exports.update = (req, res) => {};

// // Delete a Tutorial with the specified id in the request
// exports.delete = (req, res) => {};

// exports.updateNoteStatus = (req, res) => {};
