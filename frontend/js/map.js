const map = initMap();
const markers = L.markerClusterGroup();
let tempMarker = null;
let debounceTimer; // Timer debounce

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
    `)
    .on('click', () => {
      highlightAutoveloxInList(v.id); // Evidenzio nella lista
    });
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

// Ricerca località sulla mappa senza marker 

// Pulsanti e input
const locationSearchBtn = document.getElementById("locationSearchBtn");
const locationInput = document.getElementById("locationInput");

// Eventi
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

      // Zoom e animazione fluida
      map.flyTo([parseFloat(lat), parseFloat(lon)], 15, {
        animate: true,
        duration: 1.5
      });
    })
    .catch(() => {
      alert("Errore nella ricerca della località");
    });
}

// Evidenziazione sulla lista
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

// Suggerimento ricerca per località 
const suggestionsList = document.getElementById("locationSuggestions");

// Mostra i suggerimenti mentre si digita
locationInput.addEventListener("input", () => {
  const query = locationInput.value.trim();

  clearTimeout(debounceTimer); // Cancella il timer precedente

  if (query.length < 3) {
    suggestionsList.innerHTML = "";
    return;
  }

  // Aspetta 400ms prima di eseguire la richiesta
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
  }, 400); // 400ms debounce
});


// Chiudi suggerimenti quando perdi il focus
locationInput.addEventListener("blur", () => {
  setTimeout(() => (suggestionsList.innerHTML = ""), 100); // timeout per consentire click
});

