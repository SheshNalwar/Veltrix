import { getSystemPrompt } from "../prompt.js";
import { genAI } from "../../index.js";

const chatController = async (req, res) => {
  try {
    const rawMessages = req.body.messages;

    // Validate incoming messages
    if (!Array.isArray(rawMessages)) {
      return res
        .status(400)
        .json({ error: "Invalid 'messages' format. Expected array." });
    }

    if (rawMessages.length === 0) {
      return res
        .status(400)
        .json({
          code: "You haven't provided anything for me to respond to. Please provide a question, text, code, or something else you'd like me to process.",
        });
    }

    // Filter out any empty messages
    const filteredMessages = rawMessages.filter((message) => {
      // Keep messages that have non-empty text
      return message.parts?.some((part) => part.text?.trim().length > 0);
    });

    if (filteredMessages.length === 0) {
      return res
        .status(400)
        .json({
          code: "You haven't provided anything for me to respond to. Please provide a question, text, code, or something else you'd like me to process.",
        });
    }

    // Validate message format
    for (const message of filteredMessages) {
      if (
        !message.role ||
        !Array.isArray(message.parts) ||
        message.parts.length === 0
      ) {
        return res
          .status(400)
          .json({
            error:
              "Invalid message format. Each message must have a 'role' and 'parts' array with at least one text entry.",
          });
      }
    }

    console.log("✅ Messages received:", JSON.stringify(rawMessages, null, 2));

    // Pass only filtered, valid messages to GenAI
    const stream = await genAI.models.generateContentStream({
      model: "gemini-1.5-pro",
      contents: filteredMessages,
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

    console.log("✅ Final AI response:", finalText);

    if (!finalText.trim()) {
      return res.status(500).json({
        error:
          "The AI model returned an empty response. Please try again with a different prompt.",
      });
    }

    res.status(200).json({
  prompts: [],  // if needed, include actual prompts
  uiPrompts: [finalText], // wrap finalText in an array as expected by uiPrompts[0]
});

  } catch (err) {
    console.error("🔥 Error in chatController:", err);

    // Add detailed logging for unknown structures
    if (err instanceof Error) {
      res.status(500).json({ error: err.message, stack: err.stack });
    } else {
      res.status(500).json({ error: "Unknown server error", raw: err });
    }
  }
};

export default chatController;
