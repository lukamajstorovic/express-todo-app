const db = require("../models");
const Sequelize = require("sequelize");
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

exports.update = async (req, res) => {
  try {
    const { id: noteId } = req.body;
    const { id: userId } = req.user;
    const [num, [updatedNote]] = await Note.update(
      { title: req.body.title, body: req.body.body },
      {
        returning: true,
        where: {
          [Op.and]: [
            { id: noteId },
            Sequelize.literal(`CAST("author" AS TEXT) = '${userId}'`),
          ],
        },
      }
    );
    if (num == 1) {
      res.status(200).json(updatedNote);
    } else {
      res.status(404).send({
        message: `Note was not found!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Could not update Note",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id: noteId } = req.body;
    const { id: userId } = req.user;
    const num = await Note.destroy({
      where: {
        [Op.and]: [
          { id: { [Op.eq]: noteId } },
          Sequelize.literal(`CAST("author" AS TEXT) = '${userId}'`),
        ],
      },
    });
    if (num == 1) {
      res.status(200).send({
        message: "Note was deleted successfully!",
      });
    } else {
      res.status(404).send({
        message: `Note was not found!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Could not delete Note",
    });
  }
};

exports.updateNoteStatus = async (req, res) => {
  try {
    const { id: noteId } = req.body;
    const { id: userId } = req.user;
    const num = await Note.update(
      { status: req.body.status },
      {
        where: {
          [Op.and]: [
            { id: noteId },
            Sequelize.literal(`CAST("author" AS TEXT) = '${userId}'`),
          ],
        },
      }
    );
    if (num == 1) {
      res.status(200).send({
        message: `Status updated.`,
      });
    } else {
      res.status(404).send({
        message: `Note was not found!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Could not update Note status",
    });
  }
};
