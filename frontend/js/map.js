const map = L.map('map').setView([42.5, 12.5], 6); // Centro Italia

// Aggiunta del layer di OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Creazione di un nuovo cluster group
const markers = L.markerClusterGroup();

// Caricamento dei dati degli autovelox dal backend
fetch('/api/autovelox')
    .then(res => res.json())
    .then(data => {
    // Aggiungi un marker per ogni autovelox sulla mappa
    data.forEach(v => {
        const marker = L.marker([v.lat, v.lon])
        .bindPopup(`<b>Velocità max: ${v.maxspeed}km/h</b><br>ID: ${v.id}`); // Mostra la descrizione e ID quando clicchi sul marker

        // Aggiunta del marker al cluster
        markers.addLayer(marker);
    });

    //Aggiungo il cluster al layer della mappa
    map.addLayer(markers);

    })
    .catch(err => console.error('Errore nel caricamento dei dati:', err));    
    