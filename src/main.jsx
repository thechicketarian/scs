import React from 'react';
import ReactDOM from 'react-dom/client';
import Hero from './components/Hero';
import TicketCards from './components/TicketCards';
import Experiences from './components/Experiences';
import './App.css';

const isProd = import.meta.env.PROD;

/**
 * HELPER: Safe Render
 * Prevents "container already has a root" errors in Squarespace
 */
const mountIfElementExists = (id, Component, props = {}) => {
  const el = document.getElementById(id);
  if (el) {
    // If you want to be extra safe against re-renders:
    if (!el._reactRoot) {
      const root = ReactDOM.createRoot(el);
      root.render(
        <React.StrictMode>
          <Component {...props} />
        </React.StrictMode>
      );
      el._reactRoot = root; // Attach root to the element to track it
    }
  }
};

// --- 1. EXPERIENCES (Vortex/Scroll) ---
mountIfElementExists('scs-experiences-root', Experiences);

// --- 2. THE HERO ---
mountIfElementExists('scs-hero-root', Hero);

// --- 3. TICKET CARDS ---
const ticketConfigs = [
  { id: 'scs-tickets-ga', category: 'GA' },
  { id: 'scs-tickets-stm', category: 'STM' },
  { id: 'scs-tickets-premium', category: 'Premium' }
];

ticketConfigs.forEach(config => {
  mountIfElementExists(config.id, TicketCards, { category: config.category });
});

console.log(`🚀 Soccer Capital Suite: ${isProd ? 'PROD' : 'DEV'} - Mounted.`);