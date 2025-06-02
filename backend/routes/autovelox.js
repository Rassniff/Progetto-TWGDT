const express = require('express');
const fs = require('fs');

// Inizializza il router Express
const router = express.Router();

// Percorso del file JSON che contiene i dati degli autovelox
const filePath = './data/autovelox.json';

// Leggi i dati dal file JSON
function readData() {
  return JSON.parse(fs.readFileSync(filePath));
}

// Scrivi i dati nel file JSON
function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET /api/autovelox - Tutti gli autovelox
router.get('/', (req, res) => {
  const data = readData();
  res.json(data);
});

// GET /api/autovelox/:id - Uno solo per ID
router.get('/:id', (req, res) => {
  const data = readData();
  const found = data.find(v => String(v.id) === req.params.id);
  if (found) res.json(found);
  else res.status(404).json({ error: "Autovelox non trovato" });
});

// POST /api/autovelox - Aggiungi nuovo autovelox
router.post('/', (req, res) => {
  const data = readData();
  const nuovo = req.body;
  
  // Trova l'ID massimo esistente
  let maxId = 0;
  if (data.length > 0) {
    maxId = Math.max(...data.map(v => Number(v.id) || 0));
  }
  nuovo.id = maxId + 1;
  
  data.push(nuovo);
  writeData(data);
  res.status(201).json(nuovo);
});

// PUT /api/autovelox/:id - Modifica autovelox
router.put('/:id', (req, res) => {
  const data = readData();
  const index = data.findIndex(v => String(v.id) === req.params.id);
  if (index !== -1) {
    const aggiornato = { ...data[index], ...req.body, id: data[index].id };
    data[index] = aggiornato;
    writeData(data);
    res.json(aggiornato);
  } else {
    res.status(404).json({ error: "Autovelox non trovato" });
  }
});

// DELETE /api/autovelox/:id - Elimina autovelox
router.delete('/:id', (req, res) => {
  let data = readData();
  const index = data.findIndex(v => String(v.id) === req.params.id);
  if (index !== -1) {
    const rimosso = data.splice(index, 1)[0];
    writeData(data);
    res.json(rimosso);
  } else {
    res.status(404).json({ error: "Autovelox non trovato" });
  }
});

// Esporta il router per l'uso in altri moduli
module.exports = router;
