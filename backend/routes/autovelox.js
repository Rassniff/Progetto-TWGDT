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

// GET /api/autovelox/maxspeed/:value - Filtra per maxspeed
router.get('/maxspeed/:value', (req, res) => {
  const data = readData();
  const value = String(req.params.value);
  const result = data.filter(v => String(v.maxspeed) === value);
  
  if (result.length === 0) {
    return res.status(404).json({ message: `Nessun autovelox trovato con maxspeed ${value}` });
  }
  
  res.json(result);
});

// GET /api/autovelox/:minId/:maxId - Filtra per intervallo di ID
router.get('/:minId/:maxId', (req, res) => {
  const data = readData();
  const min = Number(req.params.minId);
  const max = Number(req.params.maxId);
  
  if (isNaN(min) || isNaN(max)) {
    return res.status(400).json({ error: 'ID non validi' });
  }

  const result = data.filter(v => Number(v.id) >= min && Number(v.id) <= max);
  res.json(result);
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

  const nuovoAutovelox = {
    id: maxId + 1,
    lat: Number(nuovo.lat),
    lon: Number(nuovo.lon),
    direction: nuovo.direction ?? null,
    maxspeed: nuovo.maxspeed ?? null
  };

  //nuovo.id = maxId + 1;
  
  data.push(nuovoAutovelox);
  writeData(data);
  res.status(201).json(nuovoAutovelox);
});

// PUT /api/autovelox/:id - Modifica autovelox
router.put('/:id', (req, res) => {
  const data = readData();
  const index = data.findIndex(v => String(v.id) === req.params.id);
  if (index !== -1) {
    //const aggiornato = { ...data[index], ...req.body, id: data[index].id };
    const vecchio = data[index];
    const aggiornato = {
      id: vecchio.id,
      lat: req.body.lat !== undefined ? Number(req.body.lat) : vecchio.lat,
      lon: req.body.lon !== undefined ? Number(req.body.lon) : vecchio.lon,
      direction: req.body.direction !== undefined ? req.body.direction : vecchio.direction,
      maxspeed: req.body.maxspeed !== undefined ? req.body.maxspeed : vecchio.maxspeed
    };
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
