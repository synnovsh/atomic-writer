import MenuBuilder from './menu';

const { app, BrowserWindow, ipcMain } = require('electron');

const Model = require('./utils/model');

const db = new Model();
ipcMain.on('add-entry', (event, date, content) => {
  if (db.getEntry(date) === undefined) {
    db.addEntry(content);
  }
});

ipcMain.on('get-entry', (event, date) => {
  event.returnValue = db.getEntry(date);
});

ipcMain.on('update-entry', (event, date, content) => {
  event.returnValue = db.updateEntry(date, content);
});

ipcMain.on('get-all', (event) => {
  event.returnValue = db.getAllEntries();
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (
    process.env.NODE_ENV === 'development'
    || process.env.DEBUG_PROD === 'true'
  ) {
    mainWindow.webContents.openDevTools();
  }
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Db closing
app.on('exit', () => db.close());

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
