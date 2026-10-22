
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

  // Vérifier le lien et envoyer la demande au serveur
  form.addEventListener("submit", async function (event) {
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

    const submitButton = form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (submitButton) submitButton.disabled = true;

    showMessage("Connexion au serveur en cours...");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: link })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Le serveur a rencontré une erreur."
        );
      }

      if (data.status === "not_connected") {
        showMessage(
          "Le serveur fonctionne !\n\n" +
          "Lien TikTok reconnu : " + link + "\n\n" +
          "Le moteur d'analyse IA n'est pas encore connecté. " +
          "La vidéo n'a donc pas été déclarée vraie ou fausse."
        );
        return;
      }

      showMessage(
        data.message ||
        "Réponse reçue du serveur. Aucune conclusion ne doit être tirée sans analyse réelle."
      );
    } catch (error) {
      console.error("Erreur API :", error);
      showMessage(
        "Impossible de contacter le serveur. Vérifie ta connexion " +
        "Internet et réessaie."
      );
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  // Lire les informations techniques du fichier vidéo
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
          "Ces informations techniques ne prouvent pas " +
          "l'authenticité de la vidéo."
        ];

        showMessage(informations.join("\n"));
        URL.revokeObjectURL(videoUrl);
      };

      video.onerror = function () {
        showMessage(
          "Les métadonnées de cette vidéo n'ont pas pu être lues."
        );
        URL.revokeObjectURL(videoUrl);
      };

      video.src = videoUrl;
    });
  }

  console.log("TikTok Fake Detector : JavaScript chargé.");
});
