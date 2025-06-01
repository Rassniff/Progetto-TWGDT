// Inizializzazione 
initAutoveloxFormToggle();
initAutoveloxFormSubmit();


// Attiva/disattiva la visibilità del form
function initAutoveloxFormToggle() {
  const toggleBtn = document.getElementById("addAutoveloxBtn");
  const form = document.getElementById("autoveloxForm");

  if (!toggleBtn || !form) return;

  toggleBtn.addEventListener("click", () => {
    const visible = form.style.display === "block";
    form.style.display = visible ? "none" : "block";
    if (!visible) {
      resetAutoveloxForm(); // <--- aggiungi questa riga
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

    // Mostra spinner
    //showFormMessage("Invio in corso...", "loading");

    sendNewAutoveloxToBackend(newAutovelox)
      .then(() => {
        alert("Autovelox aggiunto con successo!");
        //location.reload(); // Si può sostituire con un refresh dinamico della mappa/lista
        //showFormMessage("Autovelox aggiunto con successo!", "success");
        loadAutoveloxList();
        loadAutoveloxData();
        // Nascondi il form se vuoi
        document.getElementById("autoveloxForm").style.display = "none";
        //resetAutoveloxForm();
      })
      .catch((err) => {
        console.error("Errore:", err);
        alert("Errore nell'aggiunta dell'autovelox.");
        //showFormMessage("Errore nell'aggiunta dell'autovelox.", "error");
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
  // Se usi input con id specifici:
  if (document.getElementById("latInput")) document.getElementById("latInput").value = "";
  if (document.getElementById("lonInput")) document.getElementById("lonInput").value = "";
}

// Mostra messaggi sotto il form
/*function showFormMessage(msg, type) {
  let el = document.getElementById("formMessage");
  if (!el) {
    el = document.createElement("div");
    el.id = "formMessage";
    document.getElementById("autoveloxForm").appendChild(el);
  }
  el.textContent = msg;
  el.style.color = type === "error" ? "red" : type === "success" ? "green" : "black";
  el.style.marginTop = "10px";
  if (type === "loading") {
    el.innerHTML = `<span class="spinner"></span> ${msg}`;
  }
}*/
