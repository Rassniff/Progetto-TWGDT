const express = require('express');
const cors = require('cors');

const app = express();
const autoveloxRouter = require('./routes/autovelox'); // importa il router

app.use(cors());
app.use(express.json());

// Monta il router: tutte le rotte iniziano con /api/autovelox
app.use('/api/autovelox', autoveloxRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
