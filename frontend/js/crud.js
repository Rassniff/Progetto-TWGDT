
let allAutovelox = [];

// Inizializza il CRUD per gli autovelox
function initAutoveloxCrud() {
  loadAutoveloxList();
  document.getElementById('applyFilters').addEventListener('click', applyFilters);
  document.getElementById('resetFilters').addEventListener('click', resetFilters);
}

// Carica la lista degli autovelox dal server e li visualizza
function loadAutoveloxList() {
  fetch('/api/autovelox')
    .then(res => {
      if (!res.ok) throw new Error('Errore nel caricamento dati');
        return res.json();
    })
    .then(data => {
      allAutovelox = data; // Salva tutti gli autovelox per i filtri
      renderAutoveloxList(data);
      attachActionHandlers();
      attachListItemHandlers();
      // Aggiorna la mappa con tutti i marker all'avvio
      if (typeof updateMapWithFilteredAutovelox === 'function') {
        updateMapWithFilteredAutovelox(data);
      }
    })
    .catch(err => {
      alert('Errore di rete o server!');
      console.error(err);
    });
}

// Applica i filtri selezionati e aggiorna la lista degli autovelox
function applyFilters() {
  const min = document.getElementById('filterMinSpeed').value;
  const max = document.getElementById('filterMaxSpeed').value;
  const noSpeed = document.getElementById('filterNoSpeed').checked;

  let filtered = allAutovelox.filter(v => {
    if (noSpeed) return v.maxspeed == null || isNaN(v.maxspeed);
    if (min && (v.maxspeed == null || isNaN(v.maxspeed) || v.maxspeed < parseInt(min))) return false;
    if (max && (v.maxspeed == null || isNaN(v.maxspeed) || v.maxspeed > parseInt(max))) return false;
    return true;
  });

  renderAutoveloxList(filtered);
  attachActionHandlers();
  attachListItemHandlers();
  if (typeof updateMapWithFilteredAutovelox === 'function') {
    updateMapWithFilteredAutovelox(filtered);
  }
}

// Resetta i filtri e mostra tutti gli autovelox
function resetFilters() {
  document.getElementById('filterMinSpeed').value = '';
  document.getElementById('filterMaxSpeed').value = '';
  document.getElementById('filterNoSpeed').checked = false;
  renderAutoveloxList(allAutovelox);
  attachActionHandlers();
  attachListItemHandlers();
  if (typeof updateMapWithFilteredAutovelox === 'function') {
    updateMapWithFilteredAutovelox(allAutovelox);
  }
}

// Renderizza la lista degli autovelox nella pagina
function renderAutoveloxList(data) {
  const container = document.getElementById('autoveloxContainer');
  container.innerHTML = '';
  if (data.length === 0) {
    container.innerHTML = '<div class="no-results">Nessun autovelox trovato.</div>';
    return;
  }
  data.forEach(v => {
    const el = document.createElement('div');
    el.classList.add('autovelox-item');
    el.setAttribute('data-id', v.id);
    el.innerHTML = `
      <div>
        <b>ID:</b> ${v.id} | 
        <b>Latitudine:</b> ${v.lat} | 
        <b>Longitudine:</b> ${v.lon} | 
        <b>Velocità max:</b> ${v.maxspeed} km/h
      </div>
      <div class="autovelox-actions">
        <button class="edit" data-id="${v.id}">📝</button>
        <button class="delete" data-id="${v.id}">🗑️</button>
      </div>
    `;
    container.appendChild(el);
  });
}

// Aggiunge i gestori di eventi per gli elementi della lista degli autovelox
function attachListItemHandlers() {
  document.querySelectorAll('.autovelox-item').forEach(item => {
    item.addEventListener('click', function(e) {
      if (e.target.closest('.autovelox-actions')) return;
      const id = this.getAttribute('data-id');
      document.querySelectorAll('.autovelox-item').forEach(el => el.classList.remove('highlight'));
      this.classList.add('highlight');
      setTimeout(() => {
        this.classList.remove('highlight');
      }, 1200);
      markers.eachLayer(marker => {
        if (String(marker.autoveloxId) === String(id)) {
          map.setView(marker.getLatLng(), 17, { animate: true });
          setTimeout(() => {
            marker.openPopup();
          }, 400);
        }
      });
    });
  });
}

// Aggiunge i gestori di eventi per le azioni sugli autovelox DELETE e PUT (eliminazione, modifica velocità)
function attachActionHandlers() {
  //Eliminazione autovelox
  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm(`Vuoi davvero eliminare l'autovelox ID ${id}?`)) {
        fetch(`/api/autovelox/${id}`, { method: 'DELETE' })
          .then(() => {
            loadAutoveloxList();
            //loadAutoveloxData();
            alert('Autovelox eliminato!');
          })
          .catch(err => {
            alert('Errore durante l\'eliminazione!');
            console.error(err);
          });
      }
    });
  });
  //Modifica velocità autovelox
  document.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const newSpeed = prompt('Inserisci nuova velocità max (km/h):');
      if (!newSpeed || isNaN(newSpeed) || newSpeed <= 0) {
      alert('Inserisci un valore numerico positivo!');
      return;
    }

      fetch(`/api/autovelox/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxspeed: newSpeed })
      })
      .then(() => {
        loadAutoveloxList();
        //loadAutoveloxData();
        alert('Autovelox aggiornato!');
      });
    });
  });
}

// Avvia tutto quando la pagina è pronta
window.addEventListener('DOMContentLoaded', initAutoveloxCrud);
  