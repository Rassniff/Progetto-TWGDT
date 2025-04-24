const fs = require('fs');

// Carica il file GeoJSON originale
const geojson = JSON.parse(fs.readFileSync('./data/export.geojson', 'utf8'));

// Estrai i dati in forma semplificata
const autovelox = geojson.features.map((feature, index) => {
  const [lon, lat] = feature.geometry.coordinates;
  const props = feature.properties || {};

  return {
    id: props.id || index + 1,                // fallback in caso manchi id
    lat: lat,
    lon: lon,
    direction: props.direction || null,
    maxspeed: props.maxspeed || null
  };
});

// Salva il nuovo file JSON semplificato
fs.writeFileSync('./data/autovelox.json', JSON.stringify(autovelox, null, 2));
console.log(`✅ File autovelox_con_maxspeed.json creato con ${autovelox.length} elementi.`);
