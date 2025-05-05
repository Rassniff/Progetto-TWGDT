// === Inizializzazione ===
const map = initMap();
const markers = L.markerClusterGroup();
let tempMarker = null;

// Inizializzazione 
loadAutoveloxData();
enableClickToAddMarker();

// Inizializza la mappa centrata sull’Italia
function initMap() {
  const map = L.map('map').setView([42.5, 12.5], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  return map;
}

// Carica i dati degli autovelox dal backend e li aggiunge alla mappa
function loadAutoveloxData() {
    
  markers.clearLayers();

  fetch('/api/autovelox')
    .then(res => res.json())
    .then(data => {
      data.forEach(v => {
        const marker = createAutoveloxMarker(v);
        markers.addLayer(marker);
      });
      map.addLayer(markers);
    })
    .catch(err => console.error('Errore nel caricamento dei dati:', err));
}

// Crea un marker con popup per un autovelox
function createAutoveloxMarker(v) {
  return L.marker([v.lat, v.lon])
    .bindPopup(`
      <b>Velocità max: ${v.maxspeed} km/h</b><br>
      ID: ${v.id}
    `);
}

// Abilita il click sulla mappa per aggiungere un autovelox temporaneo
function enableClickToAddMarker() {
  map.on('click', e => {
    const form = document.getElementById('autoveloxForm');
    if (!form || form.style.display !== 'block') return;

    const { lat, lng } = e.latlng;

    // Aggiorna i campi input
    updateFormCoordinates(lat, lng);

    // Gestisce il marker temporaneo
    if (tempMarker) map.removeLayer(tempMarker);
    tempMarker = L.marker([lat, lng]).addTo(map);
  });
}

// Aggiorna i campi del form con le coordinate cliccate
function updateFormCoordinates(lat, lng) {
  document.getElementById('latInput').value = lat.toFixed(6);
  document.getElementById('lonInput').value = lng.toFixed(6);
}
