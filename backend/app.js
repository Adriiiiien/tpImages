const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Servir les fichiers statiques du front
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Routes
const uploadRoutes = require("./routes/upload");
const filesRoutes = require("./routes/files");

app.use("/upload", uploadRoutes);
app.use("/files", filesRoutes);

// Rediriger toutes les autres requêtes vers index.html 
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
