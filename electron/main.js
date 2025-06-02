import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'electron-updater';
import electronLog from 'electron-log';
import process from 'node:process';

const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
// Enable auto-download
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

// Configure logging
autoUpdater.logger = electronLog;
autoUpdater.logger.transports.file.level = 'info';

// Log all events for debugging
autoUpdater.logger.info('App starting...');

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
    autoUpdater.logger.info('Checking for updates...');
    mainWindow.webContents.send('update-status', 'Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
    autoUpdater.logger.info('Update available:', info);
    mainWindow.webContents.send('update-status', 'Update available');
    mainWindow.webContents.send('update-info', info);
});

autoUpdater.on('update-not-available', (info) => {
    autoUpdater.logger.info('Update not available:', info);
    mainWindow.webContents.send('update-status', 'Update not available');
});

autoUpdater.on('error', (err) => {
    autoUpdater.logger.error('Error in auto-updater:', err);
    mainWindow.webContents.send('update-status', 'Error in auto-updater');
    mainWindow.webContents.send('update-error', {
        message: err.message,
        stack: err.stack,
        code: err.code
    });
});

autoUpdater.on('download-progress', (progressObj) => {
    autoUpdater.logger.info('Download progress:', progressObj);
    mainWindow.webContents.send('update-progress', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
    autoUpdater.logger.info('Update downloaded:', info);
    mainWindow.webContents.send('update-status', 'Update downloaded');
    mainWindow.webContents.send('update-info', info);
});

// IPC handlers for update actions
ipcMain.on('start-update', () => {
    autoUpdater.logger.info('Starting update download...');
    autoUpdater.downloadUpdate();
});

ipcMain.on('install-update', () => {
    autoUpdater.logger.info('Installing update...');
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
