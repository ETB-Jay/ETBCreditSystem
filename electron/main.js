import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { autoUpdater } from "electron-updater";
import electronLog from 'electron-log';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Configure logging
autoUpdater.logger = electronLog;
autoUpdater.logger.transports.file.level = 'info';

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 400,
        minWidth: 700,
        minHeight: 400,
        icon: path.join(__dirname, '../src/ETBFavicon.ico'),
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '../electron/preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    
    // Check for updates
    autoUpdater.checkForUpdatesAndNotify();
}

// Update event handlers
autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('update-status', 'Checking for updates...');
});

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update-status', 'Update available');
});

autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('update-status', 'Update not available');
});

autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('update-status', 'Error in auto-updater');
    mainWindow.webContents.send('update-error', err);
});

autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('update-progress', progressObj);
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-status', 'Update downloaded');
});

// IPC handlers for update actions
ipcMain.on('start-update', () => {
    autoUpdater.downloadUpdate();
});

ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall();
});

app.whenReady().then(() => {
    //additional logic here
}).then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
