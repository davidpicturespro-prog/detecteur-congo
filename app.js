
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("analysis-form");
  const urlInput = document.getElementById("video-url");
  const fileInput = document.getElementById("video-file");
  const fileInfo = document.getElementById("file-info");
  const result = document.getElementById("result");
  const resultMessage = document.getElementById("result-message");

  function showMessage(message) {
    if (result && resultMessage) {
      result.hidden = false;
      resultMessage.textContent = message;
    } else {
      alert(message);
    }
  }

  if (!form || !urlInput) {
    console.error("Formulaire introuvable. Vérifie index.html.");
    return;
  }

  // Vérification du lien TikTok
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const link = urlInput.value.trim();

    if (!link) {
      showMessage("Colle d'abord le lien d'une vidéo TikTok.");
      return;
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(link);
    } catch {
      showMessage("Le lien saisi n'est pas valide.");
      return;
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const validTikTok =
      hostname === "tiktok.com" ||
      hostname.endsWith(".tiktok.com");

    if (parsedUrl.protocol !== "https:" || !validTikTok) {
      showMessage("Entre un lien HTTPS provenant de TikTok.");
      return;
    }

    showMessage(
      "Lien TikTok reconnu ! Le moteur d'analyse réel reste à connecter. " +
      "Nous n'avons pas encore vérifié si cette vidéo est vraie ou fausse."
    );
  });

  // Vérification du fichier importé
  if (fileInput && fileInfo) {
    fileInput.addEventListener("change", function () {
      const file = fileInput.files[0];

      if (!file) {
        fileInfo.textContent = "Aucun fichier sélectionné.";
        return;
      }

      const allowedTypes = [
        "video/mp4",
        "video/webm",
        "video/quicktime"
      ];

      if (!allowedTypes.includes(file.type)) {
        fileInput.value = "";
        fileInfo.textContent =
          "Format non accepté. Choisis MP4, WebM ou MOV.";
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        fileInput.value = "";
        fileInfo.textContent =
          "Fichier trop volumineux. Maximum : 50 Mo.";
        return;
      }

      fileInfo.textContent =
        file.name + " — " +
        (file.size / (1024 * 1024)).toFixed(1) + " Mo";

      showMessage(
        "Vidéo sélectionnée. L'analyse réelle n'est pas encore activée."
      );
    });
  }

  console.log("TikTok Fake Detector : JavaScript chargé.");
});

