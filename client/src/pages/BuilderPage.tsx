import React, { useEffect, useState } from "react";
import { ArrowLeft, Code2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useBuilder } from "../context/BuilderContext";
import FileExplorer from "../components/FileExplorer/FileExplorer";
import StepsList from "../components/StepsList";
import ContentViewer from "../components/ContentViewer";
import Button from "../components/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { parseXML } from "../steps";
import { FileNode, Step, StepType } from "../types";
import { v4 as uuidv4 } from "uuid";
const BuilderPage: React.FC = () => {
  const { prompt, activeFile, steps, setSteps } = useBuilder();

  const [view, setView] = useState<"code" | "preview">("code");

  const [files, setFiles] = useState<FileNode[]>([]);

  useEffect(() => {
    let originalFiles = [...files];

    let updateHappened = false;

    steps
      .filter(({ completed }) => completed === false)
      .forEach((step) => {
        if (step.type === StepType.CreateFile && step.path) {
          // console.log("Creating file:");

          updateHappened = true;

          let parsedPath = step.path.split("/").filter(Boolean);
          // e.g. ["src", "components", "App.tsx"]
          let currentFileStructure = [...originalFiles];
          let finalAnswerRef = currentFileStructure;
          let currentFolderPath = "";

          for (let i = 0; i < parsedPath.length; i++) {
            const segment = parsedPath[i];
            currentFolderPath += `/${segment}`;

            const isFile = i === parsedPath.length - 1;

            if (isFile) {
              const existingFile = currentFileStructure.find(
                (x) => x.path === currentFolderPath && x.type === "file"
              );
              if (existingFile) {
                existingFile.content = step.code;
              } else {
                currentFileStructure.push({
                  id: uuidv4(),
                  name: segment,
                  type: "file",
                  path: currentFolderPath,
                  content: step.code,
                });
              }
            } else {
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolderPath && x.type === "folder"
              );

              if (!folder) {
                folder = {
                  id: uuidv4(),
                  name: segment,
                  type: "folder",
                  path: currentFolderPath,
                  children: [],
                };
                currentFileStructure.push(folder);
              }

              currentFileStructure = folder.children!;
            }

            originalFiles = finalAnswerRef;
          }
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      // console.log("originalFiles", originalFiles);

      setSteps((prevSteps) =>
        prevSteps.map((s) => ({
          ...s,
          completed: true,
        }))
      );
    }
  }, [steps, setSteps]);

  const init = async () => {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim(),
    });
    // console.log(response.data);

    const { prompts, uiPrompts } = response.data;
    // console.log(prompt.trim());
    // console.log(uiPrompts[0]);

    // console.log("uiPrompts[0]:", uiPrompts[0]);
    // const xmlString =
    //   typeof uiPrompts[0] === "string"
    //     ? uiPrompts[0]
    //     : JSON.stringify(uiPrompts[0]);
    setSteps(
      parseXML(uiPrompts[0]).map((x: Step) => ({
        ...x,
        completed: false,
      }))
    );

    const stepResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map((text) => ({
        role: "user",
        parts: [{ text }],
      })),
    });

    console.log("step response:", stepResponse.data);

    const {uiPrompts: stepUiPrompts} = stepResponse.data;
    // console.log("stepUiPrompts:", stepUiPrompts);
    // console.log("stepUI prompts", typeof stepUiPrompts[0]);
    
    const parsedSteps = parseXML(stepUiPrompts[0])
      console.log("parsedSteps:", parsedSteps);
      

    setSteps((s) => [
      ...s,
      ...parsedSteps.map((x) => ({
        ...x,
        completed: false,
      })),
    ]);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link
            to="/"
            className="flex items-center text-gray-400 hover:text-gray-100 mr-4">
            <ArrowLeft size={18} className="mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-xl font-semibold">Web Builder</h1>
          <div className="ml-auto flex items-center space-x-2">
            <div className="bg-gray-800 rounded-md px-3 py-1 max-w-md overflow-hidden text-sm text-gray-400">
              <p className="truncate">{prompt}</p>
            </div>
            <div className="flex bg-gray-800 rounded-md p-1">
              <Button
                variant={view === "code" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setView("code")}
                className="flex items-center">
                <Code2 size={16} className="mr-1" />
                Code
              </Button>
              <Button
                variant={view === "preview" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setView("preview")}
                className="flex items-center">
                <Eye size={16} className="mr-1" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="w-1/4 bg-gray-900 border-r border-gray-800 overflow-y-auto">
          <StepsList />
        </div>

        {view === "code" ? (
          <>
            <div className="w-1/4 bg-gray-900 border-r border-gray-800 overflow-y-auto">
              <FileExplorer files={files} />
            </div>

            <div className="w-1/2 bg-gray-950 overflow-auto">
              {activeFile ? (
                <ContentViewer file={activeFile} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Select a file to view its content</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 bg-white">
            <iframe
              src="/preview"
              className="w-full h-full border-none"
              title="Website Preview"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default BuilderPage;
