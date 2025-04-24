const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dataPath = './data/dati.json'; // dopo lo creiamo

// API base: lista risorse
app.get('/api/risorse', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Errore nella lettura dei dati' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
