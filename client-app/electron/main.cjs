const { app, BrowserWindow, Tray, Menu, nativeImage, screen } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  // Calculate the position for the far right middle of the screen
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const windowWidth = 450;
  const windowHeight = 750;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: width - windowWidth - 20, // 20px padding from the right edge
    y: Math.round((height - windowHeight) / 2), // Centered vertically
    show: false, // Don't show immediately on load
    frame: false, // Remove the standard Windows frame/titlebar
    resizable: false, // Prevent manual resizing
    skipTaskbar: true, // Hide it from the Windows Taskbar
    alwaysOnTop: false, // Let it sit on the desktop behind other windows
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load the Vite dev server if in development, otherwise load the built React app
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }
}

function createTray() {
  // Create a simple 16x16 blue square icon for the system tray (using base64 so we don't need an external file)
  const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZKAQMFKon2HUAAYahoH/Q+phAmhmAANtMwpGwygZRsMoGUbDKBkGDAwAAPnLAwF1qJ9EAAAAAElFTkSuQmCC';
  const icon = nativeImage.createFromDataURL(`data:image/png;base64,${iconBase64}`);
  
  tray = new Tray(icon);
  tray.setToolTip('Application Tracker');

  // Right-click menu to actually close the app
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setContextMenu(contextMenu);

  // Left-click to toggle the widget
  tray.on('click', (event, bounds) => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

// Don't quit when the window is hidden, because we want it to live forever in the system tray
app.on('window-all-closed', () => {
  // Do nothing!
});