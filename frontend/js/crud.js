//Carica la lista di tutti gli autovelox
function loadAutoveloxList() {
    fetch('/api/autovelox')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('autoveloxContainer');
        container.innerHTML = '';
  
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
  
        attachActionHandlers();

        // --- AGGIUNGI QUESTO BLOCCO ---
        document.querySelectorAll('.autovelox-item').forEach(item => {
          item.addEventListener('click', function(e) {
            // Evita il click sui bottoni modifica/elimina
            if (e.target.closest('.autovelox-actions')) return;
            const id = this.getAttribute('data-id');
            // Evidenzia l'elemento cliccato
            document.querySelectorAll('.autovelox-item').forEach(el => el.classList.remove('highlight'));
            this.classList.add('highlight');
            setTimeout(() => {
              this.classList.remove('highlight');
            }, 1200);
            
            // Usa markers e map definiti globalmente in map.js
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
        // --- FINE BLOCCO ---
      });
}

//Gestione modifica/eliminazione degli autovelox
function attachActionHandlers() {
    //Eliminazione autovelox
    document.querySelectorAll('.delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm(`Vuoi davvero eliminare l'autovelox ID ${id}?`)) {
          fetch(`/api/autovelox/${id}`, { method: 'DELETE' })
            .then(() => {
              loadAutoveloxList(); //aggiorno la lista
              loadAutoveloxData(); //aggiorno la mappa
              alert('Autovelox eliminato!');
            });
        }
      });
    });
    //Modifica velocità autovelox
    document.querySelectorAll('.edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const newSpeed = prompt('Inserisci nuova velocità max (km/h):');
        if (!newSpeed) return;
  
        fetch(`/api/autovelox/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ maxspeed: parseInt(newSpeed) })
        })
        .then(() => {
          loadAutoveloxList(); //aggiorno la lista
          loadAutoveloxData(); //aggiorno la mappa
          alert('Autovelox aggiornato!');
        });
      });
    });
}
  
// Carica subito la lista quando si apre la pagina
window.addEventListener('DOMContentLoaded', loadAutoveloxList);
  