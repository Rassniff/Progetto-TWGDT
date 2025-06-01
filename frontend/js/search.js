// Gestione ricerca autovelox per ID
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', () => {
  const id = document.getElementById('searchId').value.trim();
  if (id === '') return;

  fetch(`/api/autovelox/${id}`)
    .then(res => res.json())
    .then(data => {
      let found = false;
      markers.eachLayer(marker => {
        // Confronta l'ID 
        if (marker.autoveloxId == data.id) { // confronto esatto!
          map.setView(marker.getLatLng(), 17, { animate: true });
          setTimeout(() => {
            marker.openPopup();
          }, 400); // 400ms di solito bastano
          found = true;
        }
      });
      if (!found) {
        alert('Autovelox non trovato sulla mappa!');
      } else {
        highlightAutoveloxInList(data.id); // Evidenzio nella lista
      }
    })
    .catch(err => {
      console.error(err);
      alert('Autovelox non trovato!');
    });
});
