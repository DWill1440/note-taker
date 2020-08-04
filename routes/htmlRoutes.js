const router = require("express").Router();
const store = require("../db/store");

// GET "/api/notes" responds with all notes from the database
router.get("/notes", function(req, res) {
  store
    .getNotes()
    .then(notes => {
      // const notesJson = res.json(notes)
      // console.log({ notes, notesJson })
        res.sendFile(path.join(__dirname + "../public/notes.html"));
    //return '<h1>test</h1>'

        //TODO: insert the content of "notes" into notes.html
        // TODO: return notes.html
    })
    .catch(err => res.status(500).json(err));
});

router.post("/notes", (req, res) => {
  store
    .addNote(req.body)
    .then((note) => res.json(note))
    .catch(err => res.status(500).json(err));
});

// BONUS DELETE "/api/notes" deletes the note with an id equal to req.params.id
router.delete("/notes/:id", function(req, res) {
  store
    .removeNote(req.params.id)
    .then(() => res.json({ ok: true }))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
