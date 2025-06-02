// Inizializza il form per l'aggiunta di un autovelox
function initAutoveloxForm() {
  initAutoveloxFormToggle();
  initAutoveloxFormSubmit();
}

// Attiva/disattiva la visibilità del form
function initAutoveloxFormToggle() {
  const toggleBtn = document.getElementById("addAutoveloxBtn");
  const form = document.getElementById("autoveloxForm");

  if (!toggleBtn || !form) return;

  toggleBtn.addEventListener("click", () => {
    const visible = form.style.display === "block";
    form.style.display = visible ? "none" : "block";
    if (!visible) {
      resetAutoveloxForm();
    }
  });
}

// Gestione del submit del form
function initAutoveloxFormSubmit() {
  const form = document.getElementById("newAutoveloxForm");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newAutovelox = getAutoveloxDataFromForm(formData);

    sendNewAutoveloxToBackend(newAutovelox)
      .then(() => {
        alert("Autovelox aggiunto con successo!");
        loadAutoveloxList();
        loadAutoveloxData();
        document.getElementById("autoveloxForm").style.display = "none";
      })
      .catch((err) => {
        console.error("Errore:", err);
        alert("Errore nell'aggiunta dell'autovelox.");
      });
  });
}

// Estrae i dati dal form e restituisci un oggetto
function getAutoveloxDataFromForm(formData) {
  return {
    lat: parseFloat(formData.get("lat")),
    lon: parseFloat(formData.get("lon")),
    maxspeed: parseInt(formData.get("maxspeed")),
  };
}

// Invia i dati al backend tramite POST
function sendNewAutoveloxToBackend(data) {
  return fetch("/api/autovelox", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) throw new Error("Errore nella richiesta");
    return res.json();
  });
}

// Funzione per svuotare i campi del form
function resetAutoveloxForm() {
  const form = document.getElementById("newAutoveloxForm");
  if (form) form.reset();
  if (document.getElementById("latInput")) document.getElementById("latInput").value = "";
  if (document.getElementById("lonInput")) document.getElementById("lonInput").value = "";
}

initAutoveloxForm();