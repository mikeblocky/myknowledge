// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const app = express();
app.use(cors());
app.use(express.json());
const client = jwksClient({
  jwksUri: 'https://content-hen-92.clerk.accounts.dev/.well-known/jwks.json',
});
app.use(ClerkExpressWithAuth());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Middleware to verify Clerk JWT (placeholder)
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = { id: decoded.sub }; // Clerk uses sub as user ID
    next();
  });
};

// Apply the verifyToken middleware to all routes
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: String, default: () => new Date().toISOString() },
  tagIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  isPinned: Boolean,
  isJournal: Boolean,
  userId: { type: String, required: true },
});

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: '#999' },
  userId: { type: String, required: true },
});

const Note = mongoose.model('Note', noteSchema);
const Tag = mongoose.model('Tag', tagSchema);

// Get all notes
app.get('/api/notes', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add note
app.post('/api/notes', verifyToken, async (req, res) => {
  try {
    const { title, content, tagIds, date, isPinned, isJournal } = req.body;
    const note = new Note({
      title,
      content,
      tagIds,
      date: date ? new Date(date).toISOString() : undefined,
      isPinned,
      isJournal,
      userId: req.user.id,
    });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update note
app.put('/api/notes/:id', verifyToken, async (req, res) => {
  const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete note
app.delete('/api/notes/:id', verifyToken, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Get tags
app.get('/api/tags', verifyToken, async (req, res) => {
  const tags = await Tag.find({ userId: req.user.id });
  res.json(tags);
});

// Add tag
app.post('/api/tags', verifyToken, async (req, res) => {
  const { name, color } = req.body;
  const tag = new Tag({ name, color, userId: req.user.id });
  await tag.save();
  res.json(tag);
});

// Delete tag
// Delete tag by ID
app.delete('/api/tags/:id', verifyToken, async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);

    // (Optional) Remove tag ID from all related notes
    await Note.updateMany(
      { tagIds: req.params.id },
      { $pull: { tagIds: req.params.id } }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update tag by ID
app.put('/api/tags/:id', verifyToken, async (req, res) => {
  try {
    const { name, color } = req.body;
    if (name === undefined && color === undefined) {
      return res.status(400).json({ success: false, message: 'Nothing to update' });
    }
    const updated = await Tag.findByIdAndUpdate(
      req.params.id,
      { ...(name !== undefined && { name }), ...(color !== undefined && { color }) },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/journals', verifyToken, async (req, res) => {
  try {
    const entries = await Note.find({
      isJournal: true,
      userId: req.user.id,
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Add journal entry
app.post('/api/journals', verifyToken, async (req, res) => {
  const { title, content, date } = req.body;
  const entry = new Note({
    title,
    content,
    date: date ? new Date(date).toISOString() : undefined,
    isJournal: true,
    userId: req.user.id, // Assuming user ID is available in req.user
  });
  await entry.save();
  res.json(entry);
});

// Update journal entry
app.put('/api/journals/:id', verifyToken, async (req, res) => {
  const { title, content, date } = req.body;
  const updated = await Note.findByIdAndUpdate(req.params.id, {
    title,
    content,
    date: date ? new Date(date).toISOString() : undefined,
  }, { new: true });
  res.json(updated);
});

// Delete journal entry
app.delete('/api/journals/:id', verifyToken, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
