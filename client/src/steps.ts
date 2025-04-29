import {StepType, Step} from "./types/index.ts"
import { v4 as uuidv4 } from "uuid";
/*
 * Parse input XML and convert it into steps.
 * Eg: Input -
 * <boltArtifact id=\"project-import\" title=\"Project Files\">
 *  <boltAction type=\"file\" filePath=\"eslint.config.js\">
 *      import js from '@eslint/js';\nimport globals from 'globals';\n
 *  </boltAction>
 * <boltAction type="shell">
 *      node index.js
 * </boltAction>
 * </boltArtifact>
 *
 * Output -
 * [{
 *      title: "Project Files",
 *      status: "Pending"
 * }, {
 *      title: "Create eslint.config.js",
 *      type: StepType.CreateFile,
 *      code: "import js from '@eslint/js';\nimport globals from 'globals';\n"
 * }, {
 *      title: "Run command",
 *      code: "node index.js",
 *      type: StepType.RunScript
 * }]
 *
 * The input can have strings in the middle they need to be ignored
 */



export function parseXML(response: string): Step[] {
  const steps: Step[] = [];

  // 1. Add a base "Project Files" step
  steps.push({
    id: uuidv4(),
    title: "Project Files",
    type: StepType.CreateFolder,
    description: "Initial project files artifact",
    completed: false,
  });

  // 2. Use RegEx to extract <boltAction> blocks
  const actionRegex =
    /<boltAction[^>]*type="file"[^>]*filePath="([^"]+)"[^>]*>([\s\S]*?)<\/boltAction>/g;
  let match;

  while ((match = actionRegex.exec(response)) !== null) {
    const [, filePath, content] = match;
    steps.push({
      id: uuidv4(),
      title: `Create ${filePath}`,
      type: StepType.CreateFile,
      description: `Create the file ${filePath}`,
      completed: false,
      code: content.trim(),
    });
  }

  // 3. Optionally detect scripts to run from package.json
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

  return steps;
}
