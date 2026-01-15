import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App, type NativeContracts } from '@mono/web';

import './index.css';
import './App.css';

class ElectronNativeAdapter implements NativeContracts {
  setTitle(title: string): void {
    window.electronAPI.setTitle(title);
  }

  async calculateSum(a: number, b: number): Promise<number> {
    return await window.electronAPI.calculateSum(a, b);
  }

  onUpdateTimer(callback: (value: Date) => void): () => void {
    return window.electronAPI.onUpdateTimer(callback);
  }

  onBeforeQuit(callback: () => void): () => void {
    return window.electronAPI.onBeforeQuit(callback);
  }

  confirmQuit(userConfirmed: boolean): void {
    window.electronAPI.confirmQuit(userConfirmed);
  }
}

const electronNativeAdapter = new ElectronNativeAdapter();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App platformName="Electron" nativeAdapter={electronNativeAdapter} />
  </StrictMode>
);
