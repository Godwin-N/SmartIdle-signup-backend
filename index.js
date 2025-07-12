// signup-backend/index.js (updated)
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SIGNUPS_FILE = path.join(__dirname, 'signups.json');

app.use(cors());
app.use(express.json());

// Ensure signups.json exists
if (!fs.existsSync(SIGNUPS_FILE)) fs.writeFileSync(SIGNUPS_FILE, '[]');

app.post('/render-api/signup', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'Name and email required' });

  const signups = JSON.parse(fs.readFileSync(SIGNUPS_FILE));
  signups.push({ name, email, timestamp: Date.now() });
  fs.writeFileSync(SIGNUPS_FILE, JSON.stringify(signups, null, 2));
  res.json({ message: 'Signup successful' });
});

app.get('/render-api/signups', (req, res) => {
  const signups = JSON.parse(fs.readFileSync(SIGNUPS_FILE));
  res.json(signups);
});

app.post('/render-api/delete-signup', (req, res) => {
  const { index } = req.body;
  if (typeof index !== 'number') return res.status(400).json({ message: 'Invalid index' });

  let signups = JSON.parse(fs.readFileSync(SIGNUPS_FILE));
  if (index < 0 || index >= signups.length) return res.status(404).json({ message: 'Entry not found' });

  signups.splice(index, 1);
  fs.writeFileSync(SIGNUPS_FILE, JSON.stringify(signups, null, 2));
  res.json({ message: 'Signup deleted' });
});

app.listen(PORT, () => console.log(`Signup backend running on port ${PORT}`));
