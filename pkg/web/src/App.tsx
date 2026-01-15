import { useEffect, useState } from 'react';

import type { NativeContracts } from './native/native-contracts';
import './App.css';

interface AppProps{
  platformName: string;
  nativeAdapter: NativeContracts;
}
function App({ platformName, nativeAdapter }: AppProps) {
  const [inputNumber, setInputNumber] = useState<string>('1, 2');
  const [calculateSum, setCalculateSum] = useState<number | null>(null);
  const [unsubscribeTimer, setUnsubscribeTimer] = useState<() => void>(
    () => () => {}
  );
  const [timer, setTimer] = useState<Date | null>(null);

  useEffect(() => {
    const unsubscribeBeforeQuit = nativeAdapter.onBeforeQuit(() => {
      const userConfirmed = window.confirm(
        'The application is about to quit. Do you want to proceed?'
      );
      nativeAdapter.confirmQuit(userConfirmed);
    });

    return () => {
      unsubscribeBeforeQuit();
    };
  }, []);

  return (
    <>
      <h1>UI In The Platform: {platformName}</h1>

      <button
        onClick={() => {
          const num = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0');
          nativeAdapter.setTitle('New Title from Renderer ' + num);
        }}
      >
        Set Window Title
      </button>

      <h3>Calculate Sum</h3>
      <input
        type="text"
        placeholder="input 12,34, then click Calculate Sum"
        value={inputNumber}
        onChange={(event) => {
          const value = event.target.value;
          setInputNumber(value);
        }}
      />
      <div>Result: {calculateSum}</div>
      <button
        onClick={async () => {
          try {
            const [a, b] = inputNumber
              .trim()
              .split(',')
              .map((v) => parseInt(v.replaceAll(' ', ''), 10)) as [
              number,
              number
            ];

            if (isNaN(a) || isNaN(b)) {
              throw new Error('Input is not valid numbers');
            }
            const result = await nativeAdapter.calculateSum(a, b);
            setCalculateSum(result);
          } catch (error) {
            alert(
              'Invalid input, please input like 12,34.\n\n detail: ' + error
            );
          }
        }}
      >
        Calculate
      </button>

      <h3>Subscribe Timer</h3>
      <button
        onClick={() => {
          unsubscribeTimer();
          const unsubscribe = nativeAdapter.onUpdateTimer((value) => {
            setTimer(value);
          });
          setUnsubscribeTimer(() => unsubscribe);
        }}
      >
        Listen to Timer Update
      </button>
      <button
        onClick={() => {
          setTimer(null);
          unsubscribeTimer();
        }}
      >
        Stop Listening to Timer Update
      </button>
      <div>Timer: {timer ? timer.toLocaleTimeString() : '-'}</div>
    </>
  );
}

export default App;
