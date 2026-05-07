import React from "react";
import ReactDOM from "react-dom/client";

import "./App.css";
// import Home from "./components/Home";
import Hero from "./components/Hero";
import TicketCards from "./components/TicketCards";
import Schedule from "./components/Schedule";
import LiveMusicSchedule from "./components/LiveMusicSchedule";
import HomeLiveMusicWidget from "./components/HomeLiveMusicWidget";
import Home from "./components/Home";
import PanelOne from "./components/PanelOne";


const isProd = import.meta.env.PROD;

// Types for the helper
type MountTarget = string | HTMLElement;
type AnyProps = Record<string, any>;

/**
 * UNIFIED HELPER: Safe Render
 * Automatically pulls data-attributes from HTML and merges with JS props.
 */
const mountIfElementExists = (
  idOrEl: MountTarget,
  Component: React.ComponentType<any>,
  manualProps: AnyProps = {}
) => {
  const el =
    typeof idOrEl === "string"
      ? document.getElementById(idOrEl)
      : idOrEl;

  if (!el) return;

  // Prevent double-mounting
  if (!(el as any)._reactRoot) {
    const dataProps = {
      targetDate: el.getAttribute("data-date") || undefined,
      filterMonth: el.getAttribute("data-month") || undefined,
      category: el.getAttribute("data-category") || undefined,
      layout: el.getAttribute("layout") || "list",
    };

    const finalProps = { ...dataProps, ...manualProps };

    const root = ReactDOM.createRoot(el);
    root.render(
      <React.StrictMode>
        <Component {...finalProps} />
      </React.StrictMode>
    );

    (el as any)._reactRoot = root;
  }
};

// --- 1. THE HERO ---
mountIfElementExists("scs-home-root", Home);
mountIfElementExists("scs-hero-root", Hero);
mountIfElementExists("scs-panel-1", PanelOne);


// --- 2. TICKET CARDS ---
const ticketConfigs = [
  { id: "scs-tickets-ga", category: "GA" },
  { id: "scs-tickets-stm", category: "STM" },
  { id: "scs-tickets-premium", category: "Premium" },
  { id: "scs-ticket-private", category: "Private" },
];

ticketConfigs.forEach((config) => {
  mountIfElementExists(config.id, TicketCards, { category: config.category });
});

// --- 3. DYNAMIC SCHEDULE BLOCKS ---
document.querySelectorAll("[id^='scs-schedule']").forEach((el) => {
  mountIfElementExists(el as HTMLElement, Schedule);
});

document.querySelectorAll("[id^='scs-music-schedule']").forEach((el) => {
  mountIfElementExists(el as HTMLElement, LiveMusicSchedule);
});
document.querySelectorAll("[id^='scs-home-lineup']").forEach((el) => {
  mountIfElementExists(el as HTMLElement, HomeLiveMusicWidget);})

  

console.log(`🚀 Soccer Capital Suite: ${isProd ? "PROD" : "DEV"} - Mounted.`);
