const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 Mo
  fileFilter: (req, file, cb) => {
    const allowed = ["text/plain", "application/pdf", "image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Format non supporté"));
  }
});

// POST /upload
router.post("/", upload.single("document"), (req, res) => {
  res.json({ success: true, filename: req.file.filename });
});

// Gestion erreurs Multer
router.use((err, req, res, next) => {
  if (err.message === "Format non supporté") {
    return res.status(400).json({ success: false, error: "Format non supporté" });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, error: "Fichier trop volumineux (> 3 Mo)" });
  }
  res.status(500).json({ success: false, error: "Erreur serveur" });
});

module.exports = router;
