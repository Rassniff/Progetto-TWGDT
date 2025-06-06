# 🚦 Progetto TWGDT 2024–2025 — Mappa degli Autovelox

Questo progetto consiste in una web application full-stack che consente la gestione, visualizzazione e modifica di dati relativi agli autovelox in Italia.  
L'applicazione è sviluppata con Node.js (Express) per il backend e HTML, CSS e JavaScript con Leaflet.js per il frontend.

---

## 📌 Funzionalità principali

- Visualizzazione di tutti gli autovelox su mappa (Leaflet) e lista interattiva
- Aggiunta di nuovi autovelox cliccando sulla mappa
- Modifica del limite di velocità direttamente dalla lista o dalla mappa
- Spostamento dell’autovelox trascinandolo nella nuova posizione
- Eliminazione con conferma
- Dati sincronizzati in tempo reale tra mappa e lista
- Tutte le richieste REST in formato `application/json`

---

## 🧱 Struttura del progetto

    Progetto-TWGDT/
    ├── backend/
    │   ├── app.js                       # Entry point del backend Express
    │   ├── package.json                 # Configurazione npm
    │   ├── package-lock.json
    │   ├── data/
    │   │   ├── autovelox.json           # File JSON con tutti gli autovelox
    │   │   └── export.geojson           # File originale esportato da Overpass/OSM
    │   ├── routes/
    │   │   └── autovelox.js             # Tutte le API REST per gli autovelox
    │   └── tools/
    │       └── pulisciGeoJSON.js        # Script per convertire GeoJSON in JSON semplificato
    │
    ├── frontend/
    │   ├── index.html                   # Pagina principale con mappa e lista
    │   ├── stats.html                   # Pagina per visualizzare statistiche
    │   ├── style.css                    # Stili generali (mappa e lista)
    │   ├── style_stats.css              # Stili per la pagina delle statistiche
    │   ├── js/
    │   │   ├── crud.js                  # Funzioni per chiamate API (C.R.U.D.)
    │   │   ├── form.js                  # Gestione del form per aggiunta/modifica
    │   │   ├── map.js                   # Inizializzazione mappa e marker
    │   │   ├── search.js                # Ricerca per ID / maxspeed / range
    │   │   └── stats.js                 # Logica per generare statistiche
    │   └── images/                      # Immagini
    │
    ├── relazione/
    │   └── relazione.pdf                # Relazione tecnica del progetto
    │
    ├── .gitkeep                         # Per mantenere la cartella `images/` vuota nel repo
    └── README.md                        # Documentazione del progetto (da completare)

---

## 🚀 Avvio del progetto

### 🔧 Requisiti

Per avviare e utilizzare il progetto sono necessari:

* **[Node.js](https://nodejs.org)** installato sul sistema.
* Un **browser moderno** per visualizzare il frontend.

### ▶️ Avviare il backend

1.  Apri il terminale e naviga nella directory `backend`:
    ```bash
    cd backend
    ```
2.  Installa le dipendenze del progetto:
    ```bash
    npm install
    ```
3.  Avvia il server Express:
    ```bash
    node app.js
    ```
    Il backend sarà attivo e in ascolto su `http://localhost:3000`.

### 🌐 Avviare il frontend

1.  Apri il file `frontend/index.html` direttamente nel tuo browser.
    * La pagina principale mostrerà la mappa e la lista degli autovelox.
2.  Per visualizzare il riepilogo statistico, apri invece il file `frontend/stats.html` nel browser.

---

### 📡 API REST disponibili

Il backend espone le seguenti API RESTful per la gestione degli autovelox. Tutte le richieste e risposte avvengono in formato `application/json`.

| Metodo | Endpoint                     | Descrizione                                 |
| :----- | :--------------------------- | :------------------------------------------ |
| `GET`  | `/api/autovelox`             | Restituisce tutti gli autovelox.            |
| `GET`  | `/api/autovelox/:id`         | Restituisce un autovelox specifico per ID.  |
| `GET`  | `/api/autovelox/maxspeed/:value` | Filtra gli autovelox per limite di velocità. |
| `GET`  | `/api/autovelox/range/:min/:max` | Filtra gli autovelox per intervallo di ID.  |
| `POST` | `/api/autovelox`             | Aggiunge un nuovo autovelox.                |
| `PUT`  | `/api/autovelox/:id`         | Modifica un autovelox esistente.            |
| `DELETE`| `/api/autovelox/:id`         | Elimina un autovelox.                       |

---

## 👤 Autore

Andrii Ursu
Tecnologie Web e Gestione dei Dati Territoriali
A.A. 2024/2025

---
## 📄 Licenza

Questo progetto è realizzato a scopo didattico per uso universitario.

Open Database License (ODbL) v1.0
