import React from 'react';
import ReactDOM from 'react-dom/client';
import Hero from './components/Hero';
import Home from './components/Home';
import TicketCards from './components/TicketCards';
import Experiences from './components/Experiences';
import Schedule from './components/Schedule';
import './App.css';

const isProd = import.meta.env.PROD;

/**
 * UNIFIED HELPER: Safe Render
 * Automatically pulls data-attributes from HTML and merges with JS props.
 */
const mountIfElementExists = (idOrEl, Component, manualProps = {}) => {
  // Can accept an ID string or a DOM element directly from a loop
  const el = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
  
  if (el) {
    if (!el._reactRoot) {
      // 1. Gather any machine-friendly "slugs" from data-attributes
      const dataProps = {
        targetDate: el.getAttribute('data-date') || undefined,
        filterMonth: el.getAttribute('data-month') || undefined,
        category: el.getAttribute('data-category') || undefined,
        layout: el.getAttribute('layout') || 'list'
      };

      // 2. Merge data attributes with any manual props passed in JS
      const finalProps = { ...dataProps, ...manualProps };

      const root = ReactDOM.createRoot(el);
      root.render(
        <React.StrictMode>
          <Component {...finalProps} />
        </React.StrictMode>
      );
      el._reactRoot = root; // Prevents React from trying to re-mount on the same div
    }
  }
};

// --- 1. THE HERO ---
mountIfElementExists('scs-home-root', Home);
mountIfElementExists('scs-hero-root', Hero);

// --- 2. TICKET CARDS ---
// We keep these manual because they are distinct components on the page
const ticketConfigs = [
  { id: 'scs-tickets-ga', category: 'GA' },
  { id: 'scs-tickets-stm', category: 'STM' },
  { id: 'scs-tickets-premium', category: 'Premium' },
   { id: 'scs-ticket-private', category: 'Private' }
];

ticketConfigs.forEach(config => {
  mountIfElementExists(config.id, TicketCards, { category: config.category });
});

// --- 3. DYNAMIC SCHEDULE BLOCKS ---
/**
 * This querySelector looks for ANY element with an ID starting with 'scs-schedule'.
 * It will automatically mount the Schedule component and look for:
 * data-date="june-17" OR data-month="june"
 */
document.querySelectorAll('[id^="scs-schedule"]').forEach(el => {
  mountIfElementExists(el, Schedule);
});

console.log(`🚀 Soccer Capital Suite: ${isProd ? 'PROD' : 'DEV'} - Mounted.`);