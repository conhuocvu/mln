export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { systemPrompt, userMessage, conversationHistory, mode } = req.body;
  const apiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API Key is not configured on Vercel.' });
  }

  try {
    let messages = [];
    let responseFormat = undefined;
    let maxTokens = 1024;
    let temperature = 0.9;

    if (mode === 'json') {
      messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];
      responseFormat = { type: 'json_object' };
      maxTokens = 2048;
      temperature = 0.8;
    } else {
      messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'ai' ? 'assistant' : 'user',
          content: msg.text
        }))
      ];
      maxTokens = 1024;
      temperature = 0.9;
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: responseFormat
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API Error:", groqResponse.status, errorText);
      return res.status(groqResponse.status).json({ error: `Groq API Error: ${groqResponse.status}`, details: errorText });
    }

    const data = await groqResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
