const path = require("path");
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");

let notes = require("../db/db.json");

const saveNote = (note) => {
  const newNote = {
    title: note.title,
    text: note.text,
    id: uuidv4(),
  };
  notes.push(newNote);
  // write to .json file (add to database)
  fs.writeFileSync(
    path.join(__dirname, "../db/db.json"),
    JSON.stringify(notes, null, 2)
  );
};

const deleteNote = (noteId) => {
  // unlike .push(), .filter() does not mutate the original array, it returns a new array, so you must update the value of notes to be the new filtered array, before you send it back to the client via the calling function in the DELETE route
  notes = notes.filter((note) => note.id !== noteId);

  fs.writeFileSync(
    path.join(__dirname, "../db/db.json"),
    JSON.stringify(notes, null, 2)
  );
  return notes;
};

module.exports = {
  saveNote,
  deleteNote,
};
