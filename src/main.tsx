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
import ExperiencesWidget from "./components/ExperiencesWidget";
import FullSchedule from "./components/FullSchedule";
import KnowBeforeYouGo from "./components/KnowBeforeYouGo";
import TicketNav from "./components/TicketNav";

const isProd = import.meta.env.PROD;

// -----------------------------
// GLOBAL ANCHOR STABILIZER
// -----------------------------
function stableAnchorScroll() {
  const hash = window.location.hash;
  if (!hash) return;

  let attempts = 0;

  const tryScroll = () => {
    const el = document.querySelector(hash);
    attempts++;

    if (el) {
      // Smooth scroll once layout is stable
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (attempts < 20) {
      // Retry while React components mount + fetch data
      setTimeout(tryScroll, 100);
    }
  };

  // Wait for Squarespace + React hydration
  setTimeout(tryScroll, 300);
}

window.addEventListener("load", stableAnchorScroll);


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
      mode: el.getAttribute("data-mode") || undefined,
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
mountIfElementExists("scs-ticket-nav", TicketNav);
mountIfElementExists("scs-experiences", ExperiencesWidget);
mountIfElementExists("scs-home-upcoming", FullSchedule);
mountIfElementExists("scs-full-schedule", FullSchedule);

mountIfElementExists("scs-know-before", KnowBeforeYouGo);



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
