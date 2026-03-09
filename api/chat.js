export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // *** PEGA TU KEY DE GEMINI AQUI ***
  const apiKey = AIzaSyCimv_wAw6g4cEnNZzef-iq_KvwZ093fNU;
  // **********************************

  const { system, messages } = req.body;

  const contents = [];
  if (system) {
    contents.push({ role: "user", parts: [{ text: "INSTRUCCIONES:\n" + system }] });
    contents.push({ role: "model", parts: [{ text: "Entendido. Seguire esas instrucciones." }] });
  }
  for (const msg of messages) {
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    });
  }

  try {
    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.85, maxOutputTokens: 1200 },
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      const errMsg = (data && data.error && data.error.message) ? data.error.message : JSON.stringify(data);
      return res.status(geminiRes.status).json({ error: "Gemini: " + errMsg });
    }

    const text =
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text
        ? data.candidates[0].content.parts[0].text
        : "";

    if (!text) {
      return res.status(500).json({ error: "Gemini devolvio respuesta vacia" });
    }

    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: "Error interno: " + err.message });
  }
}
