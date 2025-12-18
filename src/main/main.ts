import { app, BrowserWindow, ipcMain } from 'electron';

import { getPreloadPath, getReactUiPath } from './pathResolver';

function handleSetTitle(event: Electron.IpcMainEvent, title: string) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win?.setTitle(title);
}

async function handleCalculateSum(
  _event: Electron.IpcMainInvokeEvent,
  a: number,
  b: number
): Promise<number> {
  return a + b;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (app.isPackaged) {
    win.loadFile(getReactUiPath());
  } else {
    win.loadURL('http://localhost:5173/');
  }

  let lastTime = Date.now();
  const timer = setInterval(() => {
    const currentTime = Date.now();
    if (currentTime - lastTime > 1000) {
      lastTime = currentTime;
      win.webContents.send('update-timer', new Date());
    }
  }, 0);

  let isReallyClosing = false;
  const handleBeforeQuit = async (event: Electron.Event) => {
    if (!isReallyClosing) {
      event.preventDefault();

      win.webContents.send('before-quit');
      const userConfirmed = await new Promise<boolean>((resolve) => {
        ipcMain.on('confirm-quit', (_event, userConfirmed: boolean) => {
          resolve(userConfirmed);
        });
      });

      if (userConfirmed) {
        isReallyClosing = true;
        app.quit();
        return;
      }
    }
  };
  app.on('before-quit', handleBeforeQuit);

  win.on('closed', () => {
    clearInterval(timer);
    app.removeListener('before-quit', handleBeforeQuit);
  });
}

app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle);
  ipcMain.handle('calculate-sum', handleCalculateSum);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
