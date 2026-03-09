export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const { system, messages } = req.body;

  // Convert messages to Gemini format
  // Gemini uses "contents" with "parts", and system prompt goes as first user message
  const contents = [];

  // Add system prompt as initial context
  if (system) {
    contents.push({ role: "user", parts: [{ text: `INSTRUCCIONES DEL SISTEMA:\n${system}` }] });
    contents.push({ role: "model", parts: [{ text: "Entendido. Actuaré exactamente según esas instrucciones." }] });
  }

  // Add conversation history
  for (const msg of messages) {
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Gemini error" });
    }

    // Return in a format the frontend can use
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.status(200).json({ text });

  } catch (error) {
    return res.status(500).json({ error: "Error connecting to Gemini" });
  }
}
