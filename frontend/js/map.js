const map = initMap(); // Inizializza la mappa
const markers = L.markerClusterGroup(); // Gruppo di marker per clustering
let tempMarker = null; // Marker temporaneo per aggiunta autovelox
let debounceTimer; // Timer debounce

// Inizializzazione principale
function initMapApp(){
  loadAutoveloxData();
  enableClickToAddMarker();
  initLocationSearch();
}

// Eventi e logica per la ricerca di località
function initLocationSearch() {
  const locationSearchBtn = document.getElementById("locationSearchBtn");
  const locationInput = document.getElementById("locationInput");
  const suggestionsList = document.getElementById("locationSuggestions");

  locationSearchBtn.addEventListener("click", () => {
    const query = locationInput.value.trim();
    if (query) searchLocation(query);
  });

  locationInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = locationInput.value.trim();
      if (query) searchLocation(query);
    }
  });

  locationInput.addEventListener("input", () => {
    const query = locationInput.value.trim();
    clearTimeout(debounceTimer);

    if (query.length < 3) {
      suggestionsList.innerHTML = "";
      return;
    }

    debounceTimer = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3&addressdetails=1&countrycodes=it`)
        .then(res => res.json())
        .then(results => {
          suggestionsList.innerHTML = "";
          results.forEach(result => {
            const li = document.createElement("li");
            li.textContent = result.display_name;
            li.classList.add("suggestion-item");
            li.addEventListener("click", () => {
              locationInput.value = result.display_name;
              suggestionsList.innerHTML = "";
              map.flyTo([parseFloat(result.lat), parseFloat(result.lon)], 15, {
                animate: true,
                duration: 1.5
              });
            });
            suggestionsList.appendChild(li);
          });
        });
    }, 400);
  });

  locationInput.addEventListener("blur", () => {
    setTimeout(() => (suggestionsList.innerHTML = ""), 100);
  });
}

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
  if (tempMarker) {
    map.removeLayer(tempMarker);
    tempMarker = null;
  }

  fetch('/api/autovelox')
    .then(res => res.json())
    .then(data => {
      data.forEach(v => {
        const marker = createAutoveloxMarker(v);
        markers.addLayer(marker);
      });
      if (!map.hasLayer(markers)) {
        map.addLayer(markers);
      }
    })
    .catch(err => console.error('Errore nel caricamento dei dati:', err));
}

// Crea un marker con popup per un autovelox
function createAutoveloxMarker(v) {
  let iconUrl;
  if (v.maxspeed == null || isNaN(v.maxspeed)) {
    iconUrl = 'images/autovelox_nero_filled.png'; 
  } else if (v.maxspeed <= 50) {
    iconUrl = 'images/autovelox_verde_filled.png';
  } else if (v.maxspeed <= 90) {
    iconUrl = 'images/autovelox_arancione_filled.png';
  } else {
    iconUrl = 'images/autovelox_rosso_filled.png';
  }
  
  const autoveloxIcon = L.icon({
    iconUrl: iconUrl, 
    iconSize: [32, 32],           
    iconAnchor: [16, 32],         
    popupAnchor: [0, -32]         
  });
  
  const marker = L.marker([v.lat, v.lon], {icon: autoveloxIcon, draggable: true});
  marker.autoveloxId = v.id;

    marker.bindPopup(`
      <b>Velocità max: ${v.maxspeed} km/h</b><br>
      ID: ${v.id}
    `)
    .on('click', () => {
      highlightAutoveloxInList(v.id);
    });
  
  // Gestisci il drop
  marker.on('dragend', function(e) {
    const newLatLng = e.target.getLatLng();
    // Chiedi conferma all'utente
    if (confirm('Vuoi aggiornare la posizione di questo autovelox?')) {
      // Chiama il backend per aggiornare la posizione
      fetch(`/api/autovelox/${v.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: newLatLng.lat,
          lon: newLatLng.lng
        })
      })
      .then(res => {
        if (!res.ok) throw new Error('Errore nell\'aggiornamento');
        return res.json();
      })
      .then(() => {
        alert('Posizione aggiornata!');
        loadAutoveloxList();
        loadAutoveloxData();
      })
      .catch(() => {
        alert('Errore nell\'aggiornamento della posizione!');
        loadAutoveloxData(); // Ripristina la posizione se errore
      });
    } else {
      loadAutoveloxData(); // Ripristina la posizione se annullato
    }
  });
    
  return marker;
}

// Aggiorna la mappa con i dati filtrati degli autovelox
function updateMapWithFilteredAutovelox(filteredData) {
  markers.clearLayers();
  filteredData.forEach(v => {
    const marker = createAutoveloxMarker(v);
    markers.addLayer(marker);
  });
  if (!map.hasLayer(markers)) {
    map.addLayer(markers);
  }
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

// Funzione principale di ricerca
function searchLocation(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=it`;

  fetch(url)
    .then(res => res.json())
    .then(results => {
      if (!results.length) {
        alert("Località non trovata");
        return;
      }

      const { lat, lon } = results[0];

      map.flyTo([parseFloat(lat), parseFloat(lon)], 15, {
        animate: true,
        duration: 1.5
      });
    })
    .catch(() => {
      alert("Errore nella ricerca della località");
    });
}

// Funzione per l'evidenziazione sulla lista
function highlightAutoveloxInList(id) {
  document.querySelectorAll('.autovelox-item').forEach(el => {
    el.classList.remove('highlight');
  });

  const el = document.querySelector(`.autovelox-item[data-id="${id}"]`);
  if (el) {
    el.classList.add('highlight');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      el.classList.remove('highlight');
    }, 2000);
  }
}

initMapApp();
