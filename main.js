const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');


let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), 
      contextIsolation: true,
      nodeIntegration: false, 
    },
  });

  win.loadFile(path.join(__dirname, "src", "index.html"));

  // devTools for debugging
  win.webContents.openDevTools();

  // register global hotkey
  globalShortcut.register("Ctrl+Shift+/", () => {
    if (win) {
      win.webContents.send("replay-shortcut");
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});