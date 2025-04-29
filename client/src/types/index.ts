export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  path?: string,
  isOpen?: boolean;
}

export enum StepType {
  CreateFile, 
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript
}

export interface Step {
  id: string;
  title: string;
  type: StepType;
  description: string;
  completed: boolean;
  code?: string;
}