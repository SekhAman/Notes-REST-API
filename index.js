const express = require('express');
const fs = require("fs");

const app = express();
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Notes API is running')

})
app.get('/notes', (req, res) => {
  //   get notes from server
  const data = fs.readFileSync("notes.json", "utf8");
  const notes = JSON.parse(data);

  res.json(notes);
})
app.post('/notes', (req, res) => {
  // get the note from the request body

  const note = req.body;
  const data = fs.readFileSync("notes.json", "utf8");
  const notes = JSON.parse(data);

  note.id = Date.now();

  notes.push(note);

  fs.writeFileSync("notes.json", JSON.stringify(notes));

  res.status(201).json(note);
})
app.get("/notes/:id", (req, res) => {

  const id = Number(req.params.id);

  const data = fs.readFileSync("notes.json", "utf8");
  const notes = JSON.parse(data);
  const note = notes.find(n => n.id === id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json(note);
});

app.put("/notes/:id", (req, res) => {

  const id = Number(req.params.id);

  const data = fs.readFileSync("notes.json", "utf8");
  const notes = JSON.parse(data);
  const note = notes.find(n => n.id === id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  // Update the note with the new data
  Object.assign(note, req.body);

  // Save the updated notes back to the file
  fs.writeFileSync("notes.json", JSON.stringify(notes));

  res.json(note);
});

app.delete("/notes/:id", (req, res) => {

  const id = Number(req.params.id);

  const data = fs.readFileSync("notes.json", "utf8");
  let notes = JSON.parse(data);
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  // Remove the note from the array
  notes.splice(noteIndex, 1);

  // Save the updated notes back to the file
  fs.writeFileSync("notes.json", JSON.stringify(notes));

  res.json({ message: "Note deleted" });
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})