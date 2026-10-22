
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
      "Lien TikTok reconnu ! Aucune analyse d'authenticité " +
      "n'a encore été effectuée. Importe une vidéo pour consulter " +
      "ses informations techniques."
    );
  });

  // Vérification du fichier vidéo
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
        showMessage("Choisis un fichier MP4, WebM ou MOV.");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        fileInput.value = "";
        fileInfo.textContent =
          "Fichier trop volumineux. Maximum : 50 Mo.";
        showMessage("La vidéo dépasse la limite de 50 Mo.");
        return;
      }

      const taille = (file.size / (1024 * 1024)).toFixed(1);
      fileInfo.textContent = file.name + " — " + taille + " Mo";

      // Lire les métadonnées localement dans le navigateur
      const video = document.createElement("video");
      const videoUrl = URL.createObjectURL(file);
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        const duree = Number.isFinite(video.duration)
          ? Math.round(video.duration)
          : null;

        const largeur = video.videoWidth;
        const hauteur = video.videoHeight;

        const informations = [
          "Vidéo chargée : " + file.name,
          "Taille : " + taille + " Mo",
          "Résolution : " +
            (largeur && hauteur
              ? largeur + " × " + hauteur + " pixels"
              : "indisponible"),
          "Durée : " +
            (duree !== null
              ? Math.floor(duree / 60) + " min " +
                (duree % 60) + " s"
              : "indisponible"),
          "",
          "Ces informations décrivent le fichier, mais ne prouvent " +
            "pas son authenticité ni une génération par IA."
        ];

        showMessage(informations.join("\n"));
        URL.revokeObjectURL(videoUrl);
      };

      video.onerror = function () {
        showMessage(
          "Le fichier est accepté, mais ses métadonnées n'ont pas pu " +
          "être lues. Essaie une autre vidéo."
        );
        URL.revokeObjectURL(videoUrl);
      };

      video.src = videoUrl;
    });
  }

  console.log("TikTok Fake Detector : JavaScript chargé.");
});
