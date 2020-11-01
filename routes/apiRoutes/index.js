const router = require("express").Router();

const { saveNote, deleteNote } = require("../../lib/notes");
let notes = require("../../db/db.json");

// API routes
router.get("/notes", (req, res) => {
  res.json(notes);
});

router.post("/notes", (req, res) => {
  // call function to save note to db
  const newNote = req.body;
  saveNote(newNote);
  res.json(notes);
});

router.delete("/notes/:id", (req, res) => {
  // call function to delete note from db
  notes = deleteNote(req.params.id);
  res.json(notes);
});

module.exports = router;
