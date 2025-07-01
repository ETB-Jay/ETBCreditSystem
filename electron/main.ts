import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'electron-updater';
import electronLog from 'electron-log';
import process from 'node:process';

const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null;

// Configure logging
electronLog.transports.file.level = 'debug';
electronLog.transports.file.resolvePathFn = () => path.join(app.getPath('userData'), 'logs/main.log');
autoUpdater.logger = electronLog;

// Enable auto-download and auto-install
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

// Add more detailed logging
electronLog.info('App starting...');
electronLog.info('Current version:', app.getVersion());
electronLog.info('Update configuration:', {
    autoDownload: autoUpdater.autoDownload,
    autoInstallOnAppQuit: autoUpdater.autoInstallOnAppQuit,
    allowDowngrade: autoUpdater.allowDowngrade,
    channel: autoUpdater.channel,
    currentVersion: app.getVersion(),
    feedURL: autoUpdater.getFeedURL()
});

function createWindow() {
    const iconPath = app.isPackaged
        ? path.join(process.resourcesPath, 'ETBFavicon.ico')
        : path.resolve(process.cwd(), 'public', 'ETBFavicon.ico');

    mainWindow = new BrowserWindow({
        width: 700,
        height: 400,
        minWidth: 700,
        minHeight: 400,
        title: 'ETBCredit',
        icon: iconPath,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '../electron/preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    
    // Wait for window to be ready before checking for updates
    mainWindow.webContents.on('did-finish-load', () => {
        try {
            electronLog.info('Window loaded, checking for updates...');
            const feedURL = autoUpdater.getFeedURL();
            electronLog.info('Update server URL:', feedURL);
            electronLog.info('Current version:', app.getVersion());
            electronLog.info('Update configuration:', {
                autoDownload: autoUpdater.autoDownload,
                autoInstallOnAppQuit: autoUpdater.autoInstallOnAppQuit,
                allowDowngrade: autoUpdater.allowDowngrade,
                channel: autoUpdater.channel
            });
            autoUpdater.checkForUpdatesAndNotify();
        } catch (error) {
            electronLog.error('Failed to check for updates:', error);
            if (typeof error === 'object' && error && 'stack' in error && 'message' in error) {
                electronLog.error('Error stack:', (error as any).stack);
                if (mainWindow) {
                    mainWindow.webContents.send('update-error', {
                        message: 'Failed to check for updates',
                        error: (error as any).message,
                        stack: (error as any).stack
                    });
                }
            }
        }
    });
}

// Update event handlers
autoUpdater.on('checking-for-update', () => {
    electronLog.info('Checking for updates...');
    mainWindow?.webContents.send('update-status', 'Checking for updates...');
});

autoUpdater.on('update-available', (info: any) => {
    electronLog.info('Update available:', info);
    mainWindow?.webContents.send('update-status', 'Update available');
    mainWindow?.webContents.send('update-info', info);
});

autoUpdater.on('update-not-available', (info: any) => {
    electronLog.info('Update not available:', info);
    mainWindow?.webContents.send('update-status', 'Update not available');
});

autoUpdater.on('error', (err: any) => {
    electronLog.error('Error in auto-updater:', err);
    mainWindow?.webContents.send('update-status', 'Error in auto-updater');
    mainWindow?.webContents.send('update-error', {
        message: err.message,
        stack: err.stack,
        code: err.code
    });
});

autoUpdater.on('download-progress', (progressObj: any) => {
    electronLog.info('Download progress:', progressObj);
    mainWindow?.webContents.send('update-progress', progressObj);
});

autoUpdater.on('update-downloaded', (info: any) => {
    electronLog.info('Update downloaded:', info);
    mainWindow?.webContents.send('update-status', 'Update downloaded');
    mainWindow?.webContents.send('update-info', info);
    
    // Automatically install the update after a short delay
    setTimeout(() => {
        autoUpdater.quitAndInstall();
    }, 1000);
});

// IPC handlers for update actions
ipcMain.on('start-update', () => {
    electronLog.info('Starting update download...');
    autoUpdater.downloadUpdate();
});

ipcMain.on('install-update', () => {
    electronLog.info('Installing update...');
    autoUpdater.quitAndInstall();
});

app.whenReady().then(createWindow).catch(error => {
    electronLog.error('Failed to create window:', error);
    app.quit();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
