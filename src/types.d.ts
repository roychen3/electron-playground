declare global {
  interface Window {
    electronAPI: {
      setTitle: (title: string) => void;
      calculateSum: (a: number, b: number) => Promise<number>;
      onUpdateTimer: (callback: (value: Date) => void) => () => void;
      onBeforeQuit: (callback: () => void) => () => void;
      confirmQuit: (userConfirmed: boolean) => void;
    };
  }
}

export {};
