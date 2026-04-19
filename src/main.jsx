import React from 'react';
import ReactDOM from 'react-dom/client';
import Hero from './components/Hero';
import TicketCards from './components/TicketCards';
import './App.css';

const isProd = import.meta.env.PROD; // Vite's built-in env check

console.log(`Running in ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'} mode.`);

/**
 * 1. THE HERO
 */
const heroRoot = document.getElementById('scs-hero-root');
if (heroRoot) {
  ReactDOM.createRoot(heroRoot).render(
    <React.StrictMode>
      <Hero />
    </React.StrictMode>
  );
}

/**
 * 2. TICKET CARDS
 * In Dev: Mounts everything to your local test divs.
 * In Prod: Loops through IDs to find where Squarespace placed them.
 */
if (!isProd) {
  // --- LOCAL DEVELOPMENT SETUP ---
  // This matches your old testing rig so your local server works again
  const devSections = [
    { id: 'scs-tickets-ga', cat: 'GA' },
    { id: 'scs-tickets-stm', cat: 'STM' },
    { id: 'scs-tickets-premium', cat: 'Premium' }
  ];

  devSections.forEach(section => {
    const el = document.getElementById(section.id);
    if (el) {
      ReactDOM.createRoot(el).render(<TicketCards category={section.cat} />);
    }
  });

} else {
  // --- LIVE SQUARESPACE SETUP ---
  // Optimized modular loop for production
  const ticketConfigs = [
    { id: 'scs-tickets-ga', category: 'GA' },
    { id: 'scs-tickets-stm', category: 'STM' },
    { id: 'scs-tickets-premium', category: 'Premium' }
  ];

  ticketConfigs.forEach(config => {
    const container = document.getElementById(config.id);
    if (container) {
      ReactDOM.createRoot(container).render(
        <React.StrictMode>
          <TicketCards category={config.category} />
        </React.StrictMode>
      );
    }
  });
}