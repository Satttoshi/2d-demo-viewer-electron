import React from "react";

function App(): React.ReactElement {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
        <div>
          <button onClick={ipcHandle}>
            Send IPC
          </button>
        </div>
    </>
  )
}

export default App
