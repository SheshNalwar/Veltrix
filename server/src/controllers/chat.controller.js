import { getSystemPrompt } from "../prompt.js";
import { genAI } from "../../index.js";

const chatController = async (req, res) => {
  try {
    const messages = req.body.messages;

    const stream = await genAI.models.generateContentStream({
      model: "gemini-1.5-pro",
      contents: messages,
      config: {
        maxOutputTokens: 8000,
        temperature: 0.7,
      },
      systemInstruction: getSystemPrompt(),
    });

    let finalText = "";

    for await (const chunk of stream) {
      const part = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
      if (part) {
        finalText += part;
      }
    }
    console.log(finalText);
    

    res.json({ code: finalText });
  } catch (err) {
    console.error("🔥 Error in chatController:");
    console.error(err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown server error occurred." });
    }
  }
};

export default chatController;
