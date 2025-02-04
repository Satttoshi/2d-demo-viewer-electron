import React from "react";

function App(): React.ReactElement {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <h1 className="text-red-500">HELLO WORLD</h1>
        <div>
          <button onClick={ipcHandle}>
            Send IPC
          </button>
        </div>
    </>
  )
}

export default App
