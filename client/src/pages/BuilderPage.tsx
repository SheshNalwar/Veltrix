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
import { FileNode, Step } from "../types";
const BuilderPage: React.FC = () => {
  const { prompt, activeFile } = useBuilder();
  const { steps, setSteps } = useBuilder();
  const [view, setView] = useState<"code" | "preview">("code");


  const [files, setFiles] = useState<FileNode[]>([]);

  useEffect(() => {
    
  }, [steps, files])
  
  const init = async () => {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim(),
    });
    console.log(response.data);

    const { prompts, uiPrompts } = response.data;

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

    console.log("step response:",stepResponse.data);
    

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
              <FileExplorer />
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
