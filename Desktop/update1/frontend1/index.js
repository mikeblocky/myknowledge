const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const entryRoutes = require('./routes/entryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/diaryApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.use('/users', userRoutes);
app.use('/entries', entryRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
