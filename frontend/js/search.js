// Gestione ricerca autovelox per ID
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', () => {
  const id = document.getElementById('searchId').value.trim();
  if (id === '') return;

  fetch(`/api/autovelox/${id}`)
    .then(res => res.json())
    .then(data => {
      const marker = L.marker([data.lat, data.lon])
        .addTo(map)
        .bindPopup(`<b>Velocità max: ${data.maxspeed}km/h</b><br>ID: ${data.id}`)
        .openPopup();
      map.setView([data.lat, data.lon], 14);
      highlightAutoveloxInList(data.id); // Evidenzio nella lista
    })
    .catch(err => {
      console.error(err);
      alert('Autovelox non trovato!');
    });
});
