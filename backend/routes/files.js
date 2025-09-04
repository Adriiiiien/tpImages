const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "../backend/uploads");

// GET /files -> liste les fichiers
router.get("/", (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) return res.status(500).json({ success: false, error: "Impossible de lire le dossier" });
    res.json({ success: true, files });
  });
});

// DELETE /files/:name → supprime un fichier
router.delete("/:name", (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.name);
  fs.unlink(filePath, err => {
    if (err) return res.status(404).json({ success: false, error: "Fichier introuvable" });
    res.json({ success: true, message: "Fichier supprimé" });
  });
});

module.exports = router;
