export interface NativeContracts {
      /** Sets the title of the Electron window */
      setTitle: (title: string) => void;

      /** Calculates the sum of two numbers in the main process and returns the result */
      calculateSum: (a: number, b: number) => Promise<number>;

      /** Listens for timer updates from the main process */
      onUpdateTimer: (callback: (value: Date) => void) => () => void;

      /** Listens for the before-quit event from the main process */
      onBeforeQuit: (callback: () => void) => () => void;

      /** Sends the user's confirmation to quit the application to the main process */
      confirmQuit: (userConfirmed: boolean) => void;
}