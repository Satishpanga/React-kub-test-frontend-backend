// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Static credentials
const validCredentials = {
  email: 'admin@example.com',
  password: 'admin123'
};

app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email === validCredentials.email && password === validCredentials.password) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});