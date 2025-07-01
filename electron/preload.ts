import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electron', {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (channel: string, func: (...args: any[]) => void) =>
        ipcRenderer.on(channel, (event: any, ...args: any[]) => func(...args)),
    update: {
        start: () => ipcRenderer.send('start-update'),
        install: () => ipcRenderer.send('install-update'),
        onStatus: (callback: (status: any) => void) => ipcRenderer.on('update-status', (event: any, status: any) => callback(status)),
        onProgress: (callback: (progress: any) => void) => ipcRenderer.on('update-progress', (event: any, progress: any) => callback(progress)),
        onError: (callback: (error: any) => void) => ipcRenderer.on('update-error', (event: any, error: any) => callback(error))
    }
});