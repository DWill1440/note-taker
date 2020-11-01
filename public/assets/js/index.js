var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
var activeNote = {};

// A function for getting all notes from the db
var getNotes = function () {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};

// A function for saving a note to the db
var saveNote = function (note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

// BONUS A function for deleting a note from the db
var deleteNote = function (id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};

// If there is an activeNote, display it, otherwise render empty inputs
var renderActiveNote = function () {
  $saveNoteBtn.hide();

  // if activeNote has an id prop (ie...it's not empty...ie there is an extant note to display)
  if (activeNote.id) {
    // set input and textarea to read only so the note can't be overwritten
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    // populate input and textarea with data from object
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    // user is adding a new note. allow input and textarea to be written to
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    // empty out value so place holders will display until user inputs something
    $noteTitle.val("");
    $noteText.val("");
  }
};

// Get the note data from the inputs, save it to the db and update the view
var handleNoteSave = function () {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  saveNote(newNote).then(function (data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// BONUS Delete the clicked note
var handleNoteDelete = function (event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this).parent(".list-group-item").data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function () {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
var handleNoteView = function () {
  // update the global object with the stored data of the li that was clicked
  activeNote = $(this).data();
  renderActiveNote();
};

// Sets the activeNote to an empty object and allows the user to enter a new note
var handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
var handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
var renderNoteList = function (notes) {
  // clear out container div
  $noteList.empty();
  // initialize new empty array
  var noteListItems = [];
  // loop over array of notes returned from db
  for (var i = 0; i < notes.length; i++) {
    // cache note object at each iteration
    var note = notes[i];

    // create li and store the json object on the element so it can be available to render when clicked on
    var $li = $("<li class='list-group-item'>").data(note);
    // create span and set text
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function () {
  return getNotes().then(function (data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();
