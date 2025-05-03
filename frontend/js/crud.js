//Carico la lista di tutti gli autovelox
function loadAutoveloxList() {
    fetch('/api/autovelox')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('autoveloxContainer');
        container.innerHTML = '';
  
        data.forEach(v => {
          const el = document.createElement('div');
          el.classList.add('autovelox-item');
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
      });
}
  

function attachActionHandlers() {
    //Eliminazione autovelox
    document.querySelectorAll('.delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm(`Vuoi davvero eliminare l'autovelox ID ${id}?`)) {
          fetch(`/api/autovelox/${id}`, { method: 'DELETE' })
            .then(() => {
              loadAutoveloxList();
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
          loadAutoveloxList();
          alert('Autovelox aggiornato!');
        });
      });
    });
}
  
// Carica subito la lista quando si apre la pagina
window.addEventListener('DOMContentLoaded', loadAutoveloxList);
  