import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { EventrixProvider } from "eventrix";
import eventrixStore from "./eventrixStore";
import React from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EventrixProvider eventrix={eventrixStore}>
      <App />
    </EventrixProvider>
  </StrictMode>,
)
