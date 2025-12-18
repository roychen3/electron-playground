import { contextBridge, ipcRenderer } from 'electron/renderer';

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  calculateSum: (a: number, b: number) => {
    return ipcRenderer.invoke('calculate-sum', a, b);
  },
  onUpdateTimer: (callback) => {
    const listener = (_event: Electron.IpcRendererEvent, value: Date) =>
      callback(value);
    ipcRenderer.on('update-timer', listener);
    return () => {
      ipcRenderer.removeListener('update-timer', listener);
    };
  },
} satisfies Window['electronAPI']);
