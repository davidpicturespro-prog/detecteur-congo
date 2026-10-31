
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Utilise une requête POST."
    });
  }

  const token = process.env.HF_TOKEN;

  if (!token) {
    return res.status(503).json({
      success: false,
      status: "not_connected",
      message: "La variable HF_TOKEN est absente."
    });
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b:fastest",
          messages: [
            {
              role: "user",
              content: "Réponds simplement : Connexion réussie."
            }
          ],
          max_tokens: 30
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        status: "inference_error",
        message: "Hugging Face a refusé la requête.",
        details: data.error || data.message || "Erreur inconnue."
      });
    }

    return res.status(200).json({
      success: true,
      status: "connected",
      message: "Connexion Hugging Face réussie.",
      answer: data.choices?.[0]?.message?.content || null
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      status: "server_error",
      message: "Erreur pendant la connexion à Hugging Face."
    });
  }
};
