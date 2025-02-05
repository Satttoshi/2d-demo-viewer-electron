import React from 'react';
import { DemoStage } from './components/DemoStage';

export function App(): React.ReactElement {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');
  const ipcHandle2 = (): void => window.electron.ipcRenderer.send('parse-demo');

  return (
    <>
      <h1 className="text-red-500 text-4xl font-bold mb-6">HELLO WORLD</h1>
      <div className="space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          onClick={ipcHandle}
        >
          Send IPC
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          onClick={ipcHandle2}
        >
          Send IPC
        </button>
      </div>
      <DemoStage />
    </>
  );
}
