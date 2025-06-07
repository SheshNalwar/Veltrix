import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FileNode } from "../types";

export const downloadProjectAsZip = async (
  files: FileNode[],
  zipName = "project.zip"
) => {
  const zip = new JSZip();

  const addToZip = (nodes: FileNode[], currentPath = "") => {
    nodes.forEach((node) => {
      const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name;

      if (node.type === "file") {
        zip.file(fullPath, node.content || "");
      } else if (node.type === "folder" && node.children) {
        addToZip(node.children, fullPath);
      }
    });
  };

  addToZip(files);

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, zipName);
};
