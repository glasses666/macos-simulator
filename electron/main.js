const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../client/public/icon.png'),
    title: 'macOS 26 Simulator',
  });

  // In production, load from localhost:3000 (server will be started separately)
  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  
  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startServer() {
  // Start the backend server
  const serverPath = path.join(__dirname, '../dist/index.js');
  
  if (process.env.NODE_ENV === 'production') {
    serverProcess = spawn('node', [serverPath], {
      env: { ...process.env, PORT: '3000' },
      stdio: 'inherit',
    });

    serverProcess.on('error', (err) => {
      console.error('Failed to start server:', err);
    });
  }
}

app.on('ready', () => {
  startServer();
  
  // Wait a bit for server to start, then create window
  setTimeout(createWindow, 2000);
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
