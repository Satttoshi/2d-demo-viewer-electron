import { app, shell, BrowserWindow, ipcMain } from 'electron';
import path, { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { getBinaryPath, getDemoPath, getParsedDemoPath } from './utils/file-paths';
import { parse } from './parser/demo-parser';

// Set to true to enable debug mode, which will open e.G., DevTools
const DEBUG_MODE = false;

// Start Bechilo-go web server
const serverProc = require('child_process').spawn(
  getBinaryPath('webserver'),
  [],
  {
    stdio: 'pipe',
    env: {
      ...process.env,
      PORT: '4242'
    }
  }
);

serverProc.stdout.on('data', (data) => console.log(data.toString()));
serverProc.stderr.on('data', (data) => console.error(data.toString()));

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    title: '2D Demo Viewer',
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    // open Dev Tools if running in development
    if (is.dev && DEBUG_MODE) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  ipcMain.on('parse-demo', async _ => {
    const demoPath = getDemoPath('ancient.dem');
    const outputPath = getParsedDemoPath(path.basename(demoPath, '.dem'));
    console.log('Demo path:', demoPath);
    console.log('Output path:', outputPath);
    parse(demoPath);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  serverProc.kill();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
