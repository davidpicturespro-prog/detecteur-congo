
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Utilise une requête POST."
    });
  }

  if (!process.env.HF_TOKEN) {
    return res.status(503).json({
      success: false,
      status: "not_connected",
      message: "La variable HF_TOKEN est absente."
    });
  }

  return res.status(200).json({
    success: true,
    status: "token_detected",
    message:
      "Le serveur détecte HF_TOKEN. " +
      "La connexion Hugging Face est prête pour le test suivant.",
    analysis: null
  });
};
