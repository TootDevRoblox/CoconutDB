const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const DB_FILE = "./db.json";

// carregar banco
function loadDB() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// salvar banco
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// pegar player
app.get("/player/:id", (req, res) => {
  const db = loadDB();
  const player = db[req.params.id];

  if (!player) return res.json({ error: "not found" });

  res.json(player);
});

// criar ou atualizar player
app.post("/player/:id", (req, res) => {
  const db = loadDB();

  db[req.params.id] = req.body;

  saveDB(db);

  res.json({ success: true });
});

// iniciar server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("DataStore rodando na porta " + PORT);
});