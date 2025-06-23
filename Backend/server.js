// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let donors = [];

// Register a new donor
app.post('/register', (req, res) => {
  const donor = req.body;
  donors.push(donor);
  console.log("Donor Registered:", donor);
  res.json({ message: "Donor registered successfully" });
});

// Search donors by blood group
app.post('/search', (req, res) => {
  const { bloodGroup } = req.body;
  const results = donors.filter(d => d.bloodGroup === bloodGroup);
  console.log(`Search for blood group ${bloodGroup}: ${results.length} found`);
  res.json(results);
});

app.listen(port, () => {
  console.log(`Blood Bank Server running at http://localhost:${port}`);
});
