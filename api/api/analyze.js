
module.exports = (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      success: false,
      message: "Utilise une requête POST."
    });
  }

  return res.status(200).json({
    success: true,
    status: "not_connected",
    message:
      "Le serveur fonctionne, mais aucun moteur d'analyse IA n'est connecté.",
    analysis: null
  });
};
