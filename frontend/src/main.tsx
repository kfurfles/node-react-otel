import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID } from './config/env/index.ts'
import { AppProvider } from './providers/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  // </GoogleOAuthProvider>
  ,
)
