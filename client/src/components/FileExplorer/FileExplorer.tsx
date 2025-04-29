import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import FileItem from './FileItem';
import FolderItem from './FolderItem';

const FileExplorer: React.FC = () => {
  const { fileSystem } = useBuilder();

  const renderFileNode = (node: any, level = 0) => {
    if (node.type === 'folder') {
      return (
        <FolderItem key={node.id} folder={node} level={level}>
          {node.isOpen && node.children?.map((child: any) => renderFileNode(child, level + 1))}
        </FolderItem>
      );
    } else {
      return <FileItem key={node.id} file={node} level={level} />;
    }
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-semibold">Files</h2>
      </div>
      <div className="space-y-1">
        {fileSystem.map((node) => renderFileNode(node))}
      </div>
    </div>
  );
};

export default FileExplorer;