import type { NativeContracts } from '../native-contracts';

export class WebNativeAdapter implements NativeContracts {
  setTitle(title: string) {
    document.title = title;
  }

  async calculateSum(a: number, b: number) {
    return a + b;
  }

  onUpdateTimer(callback: (value: Date) => void) {
    let last = Date.now();
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - last >= 1000) {
        last = now;
        callback(new Date());
      }
    }, 0);

    return () => {
      clearInterval(intervalId);
    };
  }

  onBeforeQuit() {
    console.warn('onBeforeQuit is not supported in browser environment.');
    return () => {};
  }

  confirmQuit(userConfirmed: boolean) {
    if (userConfirmed) {
      window.close();
    }
  }
}
