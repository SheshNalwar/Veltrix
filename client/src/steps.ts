import { StepType, Step } from "./types/index.ts";
import { v4 as uuidv4 } from "uuid";

/*
 * Parse input XML and convert it into steps.
 * Example input:
 * <boltArtifact id="project-import" title="Project Files">
 *   <boltAction type="file" filePath="eslint.config.js">
 *     import js from '@eslint/js';\nimport globals from 'globals';
 *   </boltAction>
 *   <boltAction type="shell">
 *     node index.js
 *   </boltAction>
 * </boltArtifact>
 *
 * Output:
 * [
 *   { ...Project Files Step },
 *   { ...Step to create eslint.config.js },
 *   { ...Step to run node index.js }
 * ]
 */

export function parseXML(response: string): Step[] {
  const steps: Step[] = [];
  // ✅ Fix: Strip Markdown code block wrapper
  if (response.startsWith("```")) {
    response = response
      .replace(/^```xml\n/, "")
      .replace(/```$/, "")
      .trim();
  }

  // 1. Add initial Project Files step
  steps.push({
    id: uuidv4(),
    title: "Project Files",
    type: StepType.CreateFolder,
    description: "Initial project files artifact",
    completed: false,
  });

  // 2. Parse all <boltAction type="file" ...> or add/modify types
  const fileActionRegex =
    /<boltAction[^>]*type="(?:file|add|modify)"[^>]*filePath="([^"]+)"[^>]*>([\s\S]*?)<\/boltAction>/g;
  let match;

  while ((match = fileActionRegex.exec(response)) !== null) {
    const [_, filePath, content] = match;

    steps.push({
      id: uuidv4(),
      title: `Create ${filePath}`,
      type: StepType.CreateFile,
      description: `Create or modify the file ${filePath}`,
      completed: false,
      code: content.trim(),
      path: "/" + filePath,
    });
  }

  // 3. Parse package.json scripts
  const packageJsonMatch = response.match(
    /<boltAction[^>]*filePath="package\.json"[^>]*>([\s\S]*?)<\/boltAction>/
  );
  if (packageJsonMatch) {
    try {
      const packageJson = JSON.parse(packageJsonMatch[1]);
      const scripts = packageJson.scripts || {};

      for (const script in scripts) {
        steps.push({
          id: uuidv4(),
          title: `Run script: ${script}`,
          type: StepType.RunScript,
          description: `Run the command: ${scripts[script]}`,
          completed: false,
          code: scripts[script],
        });
      }
    } catch (e) {
      console.warn("Failed to parse package.json", e);
    }
  }

  // 4. Shell commands
  const shellRegex =
    /<boltAction[^>]*type="(?:shell|install-dependencies)"[^>]*>([\s\S]*?)<\/boltAction>/g;
  let shellMatch;
  while ((shellMatch = shellRegex.exec(response)) !== null) {
    const shellCode = shellMatch[1].trim();
    if (shellCode) {
      steps.push({
        id: uuidv4(),
        title: `Run command`,
        type: StepType.RunScript,
        description: `Run the command: ${shellCode}`,
        completed: false,
        code: shellCode,
      });
    }
  }

  // 5. Update instructions (optional)
  const updateInstructionsMatch = response.match(
    /<boltAction[^>]*type="update-instructions"[^>]*>([\s\S]*?)<\/boltAction>/
  );
  if (updateInstructionsMatch) {
    steps.push({
      id: uuidv4(),
      title: "Post Setup Instructions",
      type: StepType.ShowNote,
      description: "Follow these instructions after setup",
      completed: false,
      code: updateInstructionsMatch[1].trim(),
    });
  }

  return steps;
}
