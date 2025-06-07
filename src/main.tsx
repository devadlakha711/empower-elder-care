import { createRoot } from 'react-dom/client'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'
import React from 'react'
import App from './App.tsx'
// import TestApp from './TestApp'

// Uncomment the line below and comment out the TestApp import when ready to revert
// import App from './App.tsx'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      {/* <TestApp /> */}
    </ErrorBoundary>
  </React.StrictMode>
);
