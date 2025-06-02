const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) =>
        ipcRenderer.on(channel, (event, ...args) => func(...args)),
    update: {
        start: () => ipcRenderer.send('start-update'),
        install: () => ipcRenderer.send('install-update'),
        onStatus: (callback) => ipcRenderer.on('update-status', (event, status) => callback(status)),
        onProgress: (callback) => ipcRenderer.on('update-progress', (event, progress) => callback(progress)),
        onError: (callback) => ipcRenderer.on('update-error', (event, error) => callback(error))
    }
});