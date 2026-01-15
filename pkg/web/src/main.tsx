import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { WebNativeAdapter } from './native/adapters/web-native-adapter.ts'
import App from './App.tsx'

import './index.css'

const webNativeAdapter = new WebNativeAdapter()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App platformName='Web' nativeAdapter={webNativeAdapter} />
  </StrictMode>,
)
