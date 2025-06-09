import { genAI } from "../../index.js";
import { BASE_PROMPT } from "../prompt.js";
import { basePrompt as nodeBasePrompt } from "../defaults/node.js";
import { basePrompt as reactBasePrompt } from "../defaults/react.js";
import { basePrompt as fullstackBasePrompt } from "../defaults/fullstack.js";

const templateController = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const prompt = req.body.prompt;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user", // "user", "model", or "system"
          parts: [{ text: prompt }],
        },
      ],
      config: {
        maxOutputTokens: 200,
        systemInstruction:
          "Return either node, react, or fullstack based on what do you think this project should be. Only return a single word either 'node', 'react', or 'fullstack'. Do not return anything extra. if the prompt includes 'node' or 'express' or 'backend', return 'node'. If the prompt includes 'react' or 'frontend', return 'react'. If the prompt includes both or 'fullstack, return 'fullstack'. Do not return anything else.",
      },
    });

    console.log(response);

    const answer = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    //react, node, or fullstack

    console.log(answer);

    if (answer == "react") {
      res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (answer === "node") {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }

    if (answer === "fullstack") {
      console.log("Fullstack prompt selected:", fullstackBasePrompt); // Debugging log
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${fullstackBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [fullstackBasePrompt],
      });
      return;
    }

    res.status(403).json({ message: "You cant access this" });
    return;
  } catch (error) {
    console.error("Error in /template route:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export default templateController;
