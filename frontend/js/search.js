// Ricerca per ID degli autovelox
function initSearchById() {
  const searchButton = document.getElementById('searchButton');
  if (!searchButton) return;
  searchButton.addEventListener('click', handleSearchById);
}

// Gestione della ricerca per ID
function handleSearchById() {
  const id = document.getElementById('searchId').value.trim();
  if (id === '') return;

  fetch(`/api/autovelox/${id}`)
    .then(res => res.json())
    .then(data => {
      let found = false;
      markers.eachLayer(marker => {
        if (marker.autoveloxId == data.id) {
          map.setView(marker.getLatLng(), 17, { animate: true });
          setTimeout(() => {
            marker.openPopup();
          }, 400);
          found = true;
        }
      });
      if (!found) {
        alert('Autovelox non trovato sulla mappa!');
      } else {
        highlightAutoveloxInList(data.id);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Autovelox non trovato!');
    });
}

initSearchById();
