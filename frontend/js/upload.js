const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const statusDiv = document.getElementById("status");
const MAX_SIZE = 3 * 1024 * 1024; // 3 Mo
const allowedTypes = ["text/plain", "application/pdf", "image/jpeg", "image/png"];

let selectedFile = null;

// Sélection via clic ou drag & drop
uploadBox.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        selectedFile = fileInput.files[0];
        statusDiv.textContent = `Fichier sélectionné : ${selectedFile.name}`;
    }
});

uploadBox.addEventListener("dragover", e => {
    e.preventDefault();
    uploadBox.classList.add("dragover");
});
uploadBox.addEventListener("dragleave", () => uploadBox.classList.remove("dragover"));
uploadBox.addEventListener("drop", e => {
    e.preventDefault();
    uploadBox.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
        selectedFile = e.dataTransfer.files[0];
        fileInput.files = e.dataTransfer.files; // synchro input
        statusDiv.textContent = `Fichier sélectionné : ${selectedFile.name}`;
    }
});

// Validation côté client
function validateFile(file) {
    if (!allowedTypes.includes(file.type)) {
        statusDiv.textContent = "Format non supporté.";
        return false;
    }
    if (file.size > MAX_SIZE) {
        statusDiv.textContent = "Fichier trop volumineux (> 3 Mo).";
        return false;
    }
    return true;
}

// Upload via POST
async function uploadFile(file) {
    if (!validateFile(file)) return;
    const formData = new FormData();
    formData.append("document", file);

    try {
        const res = await fetch("/upload", { method: "POST", body: formData });
        const data = await res.json();
        statusDiv.textContent = data.success ? `Upload réussi : ${data.filename}` : `Erreur : ${data.error}`;
    } catch (err) {
        statusDiv.textContent = "Erreur réseau.";
    }
}

// Bouton upload
uploadBtn.addEventListener("click", () => {
    if (selectedFile) uploadFile(selectedFile);
    else statusDiv.textContent = "Veuillez sélectionner un fichier.";
});
