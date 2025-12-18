import { useState } from 'react';
import './App.css';

function App() {
  const [inputNumber, setInputNumber] = useState<string>('1, 2');
  const [calculateSum, setCalculateSum] = useState<number | null>(null);
  const [unsubscribeTimer, setUnsubscribeTimer] = useState<() => void>(
    () => () => {}
  );
  const [timer, setTimer] = useState<Date | null>(null);

  return (
    <>
      <h1>Electron + Vite + React</h1>

      <h3>IPC: Renderer to main (one-way)</h3>
      <button
        onClick={() => {
          const num = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0');
          window.electronAPI.setTitle('New Title from Renderer ' + num);
        }}
      >
        Set Window Title
      </button>

      <h3>IPC: Renderer to main (two-way)</h3>
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
            const result = await window.electronAPI.calculateSum(a, b);
            setCalculateSum(result);
          } catch (error) {
            alert(
              'Invalid input, please input like 12,34.\n\n detail: ' + error
            );
          }
        }}
      >
        Calculate Sum by Main Process
      </button>

      <h3>IPC: Main to renderer</h3>
      <button
        onClick={() => {
          unsubscribeTimer();
          const unsubscribe = window.electronAPI.onUpdateTimer((value) => {
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
      <div>Timer: {timer ? timer.toLocaleTimeString(): '-'}</div>
    </>
  );
}

export default App;
