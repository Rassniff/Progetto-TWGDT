document.addEventListener('DOMContentLoaded', () => {
  fetchAutoveloxData().then(data => {
    renderSummaryStats(data);
    renderCharts(data);
  });
});

// Funzione per recuperare i dati degli autovelox dal backend
function fetchAutoveloxData() {
  return fetch('/api/autovelox')
    .then(res => res.json());
}

// Funzione per visualizzare le statistiche riassuntive
function renderSummaryStats(data) {
  document.getElementById('totalVelox').textContent = data.length;
  const validSpeeds = data
    .map(v => Number(v.maxspeed))
    .filter(speed => !isNaN(speed) && isFinite(speed));
  const avg = validSpeeds.length
    ? (validSpeeds.reduce((sum, v) => sum + v, 0) / validSpeeds.length).toFixed(1)
    : 'N/A';
  document.getElementById('avgSpeed').textContent = avg;
}

// Funzione per calcolare le fasce di velocità
function getSpeedBands(data) {
  const fasce = { '0-50': 0, '51-90': 0, '91-130+': 0, 'No data': 0 };
  data.forEach(v => {
    if (v.maxspeed == null || isNaN(v.maxspeed)) fasce['No data']++;
    else if (v.maxspeed <= 50) fasce['0-50']++;
    else if (v.maxspeed <= 90) fasce['51-90']++;
    else fasce['91-130+']++;
  });
  return fasce;
}

// Funzione per visualizzare i grafici delle statistiche
function renderCharts(data) {
  const fasce = getSpeedBands(data);

  new Chart(document.getElementById('speedBarChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(fasce),
      datasets: [{
        label: 'Numero autovelox',
        data: Object.values(fasce),
        backgroundColor: ['#28a745','#ffc107','#dc3545','#6c757d']
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  new Chart(document.getElementById('speedPieChart'), {
    type: 'pie',
    data: {
      labels: Object.keys(fasce),
      datasets: [{
        data: Object.values(fasce),
        backgroundColor: ['#28a745','#ffc107','#dc3545','#6c757d']
      }]
    }
  });
}