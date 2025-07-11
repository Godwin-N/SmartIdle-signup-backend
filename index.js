const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const SIGNUPS_FILE = path.join(__dirname, 'signups.json');

// Ensure the file exists
if (!fs.existsSync(SIGNUPS_FILE)) {
  fs.writeFileSync(SIGNUPS_FILE, '[]');
}

// Route: POST /signup
app.post('/render-api/signup', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  const newSignup = { name, email, timestamp: new Date().toISOString() };
  const existing = JSON.parse(fs.readFileSync(SIGNUPS_FILE));
  existing.push(newSignup);

  fs.writeFileSync(SIGNUPS_FILE, JSON.stringify(existing, null, 2));
  res.status(200).json({ message: 'Signup saved successfully.' });
});

// Route: GET /render-api/signups (Optional for admin view)
app.get('/render-api/signups', (req, res) => {
  const data = fs.readFileSync(SIGNUPS_FILE);
  res.status(200).json(JSON.parse(data));
});

app.listen(PORT, () => {
  console.log(`Signup backend running on port ${PORT}`);
});
