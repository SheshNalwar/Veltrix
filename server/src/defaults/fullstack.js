export const basePrompt = `<boltArtifact id="project-import" title="TypeScript Full Stack App">

<!-- ===== React Frontend (TypeScript) ===== -->

<boltAction type="file" filePath="client/index.html"><!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
</boltAction>

<boltAction type="file" filePath="client/package.json">{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}</boltAction>

<boltAction type="file" filePath="client/tsconfig.json">{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}</boltAction>

<boltAction type="file" filePath="client/tsconfig.app.json">{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}</boltAction>

<boltAction type="file" filePath="client/postcss.config.js">export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
</boltAction>

<boltAction type="file" filePath="client/tailwind.config.js">/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
</boltAction>

<boltAction type="file" filePath="client/vite.config.ts">import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './client',
});
</boltAction>

<boltAction type="file" filePath="client/src/App.tsx">import * as React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p>Welcome to the Full Stack Starter!</p>
    </div>
  );
}

export default App;
</boltAction>

<boltAction type="file" filePath="client/src/main.tsx">
import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
</boltAction>

<boltAction type="file" filePath="client/src/index.css">@tailwind base;
@tailwind components;
@tailwind utilities;
</boltAction>

<boltAction type="file" filePath="client/src/vite-env.d.ts">/// <reference types="vite/client" />
</boltAction>

<!-- ===== Node Backend (TypeScript) ===== -->

<boltAction type="file" filePath="server/index.ts">import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from TypeScript Node backend!');
});

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});
</boltAction>

<boltAction type="file" filePath="server/package.json">{
  "name": "server",
  "version": "1.0.0",
  "main": "index.ts",
  "type": "module",
  "scripts": {
    "start": "ts-node index.ts",
    "dev": "nodemon index.ts"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.6.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.5.3",
    "nodemon": "^3.0.3"
  }
}
</boltAction>

<boltAction type="file" filePath="server/tsconfig.json">{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "dist"
  },
  "include": ["./"]
}
</boltAction>

<boltAction type="file" filePath="server/.gitignore">node_modules
.env
dist
</boltAction>

</boltArtifact>`;
