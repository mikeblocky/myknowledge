// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/note_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: String, default: () => new Date().toISOString() },
  tagIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  isPinned: Boolean,
  isJournal: Boolean,
});

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: '#999' },
});

const Note = mongoose.model('Note', noteSchema);
const Tag = mongoose.model('Tag', tagSchema);

// Get all notes
app.get('/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Add note
app.post('/notes', async (req, res) => {
  const { title, content, tagIds, date, isPinned, isJournal } = req.body;
  const note = new Note({
    title,
    content,
    tagIds,
    date: date ? new Date(date).toISOString() : undefined,
    isPinned,
    isJournal,
  });
  await note.save();
  res.json(note);
});

// Update note
app.put('/notes/:id', async (req, res) => {
  const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete note
app.delete('/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Get tags
app.get('/tags', async (req, res) => {
  const tags = await Tag.find();
  res.json(tags);
});

// Add tag
app.post('/tags', async (req, res) => {
  const tag = new Tag(req.body);
  await tag.save();
  res.json(tag);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
