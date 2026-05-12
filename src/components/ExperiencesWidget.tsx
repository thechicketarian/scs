import React, { useEffect, useState } from "react";
import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
import "./ExperiencesWidget.css";
import { ExperienceRow } from "../types/types";
import { formatExperienceDates } from "../utils/datesParser";
import { createPortal } from "react-dom";

export default function ExperiencesWidget() {
  const { schedule, loading } = useFestivalSchedule();
  const [activeActivation, setActiveActivation] = useState<ActivationEntry | null>(null);


  // ⭐ Memoized activation pipeline (dedupe + collect dates)
  const activations = React.useMemo(() => {
    if (loading) return [];

    const map = new Map<string, ActivationEntry>();

    Object.entries(schedule).forEach(([dateKey, day]) => {
      (day.experiences || []).forEach((exp: ExperienceRow) => {
        const key = `${exp.experience}|${exp.description}|${exp.time}|${exp.partner}|${exp.vendor}`;

        if (!map.has(key)) {
          map.set(key, {
            ...exp,
            dates: [dateKey]
          });
        } else {
          map.get(key)!.dates.push(dateKey);
        }
      });
    });

    return Array.from(map.values()).sort((a, b) =>
      a.experience.localeCompare(b.experience)
    );
  }, [loading, schedule]);

  const openDrawer = (activation: ActivationEntry) => {
    setActiveActivation(activation);
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    setActiveActivation(null);
    document.body.style.overflow = "";
  };

  // ⭐ ESC closes drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ⭐ ADD THIS
  useEffect(() => {
    if (activeActivation) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [activeActivation]);
  // ⭐ SAFE conditional render (after hooks + memo)
  if (loading) {
    return <div>Loading…</div>;
  }


  return (
    <div className="scs-experiences-widget">
      <h1 className="scs-music-page-title">Experiences</h1>
      <div className="scs-music-nav scs-music-nav-exp">
        <div className="scs-music-nav-date">Summer Fun</div>
        <button className="scs-music-cta scs-card-button"
          onClick={() => (window as any).GMWidget?.open("SoccerCapitalSummer")}
        >find tickets <span className="material-symbols-outlined">
            confirmation_number
          </span></button>
        <div className="scs-music-nav-date">2026</div>
      </div>
      <div className="scs-experiences-list">
        {activations.map((exp, i) => (
          <button
            key={i}
            className="scs-experience-card scs-card-button"
            onClick={() => openDrawer(exp)}
          >
            <div className="scs-headliner-info">

              <div className="scs-music-date">{formatExperienceDates(exp.date)} </div>
              <div className="scs-vendor-name">{exp.experience}</div>
              {/* <div> {exp.category}</div> */}
              {/* { exp.partner && <div className="scs-partner-title">Presented By: {exp.partner}</div>} */}
              <div
                className="scs-artist-modal"
              >
                <span>learn more</span>
                <span className="material-symbols-outlined">
                  arrow_outward
                </span>
              </div>
            </div>
            {exp.image && (
              <div className="scs-vendor-image artist-img">
                <img src={exp.image} alt={exp.vendor} />
              </div>
            )}
          </button>
        ))}
      </div>

      {activeActivation &&
        createPortal(
          <ActivationDrawer activation={activeActivation} onClose={closeDrawer} />,
          document.body
        )
      }

    </div>
  );
}

// ⭐ Activation entry with date range
interface ActivationEntry extends ExperienceRow {
  dates: string[];
}

interface DrawerProps {
  activation: ActivationEntry;
  onClose: () => void;
}

function ActivationDrawer({ activation, onClose }: DrawerProps) {

  const dateRange = formatExperienceDates(activation.date);

  return (
    <div className="scs-drawer-overlay" onClick={onClose}>
      <div className="scs-content-wrapper">

        {/* ⭐ Optional image */}
        <div className="scs-drawer-img">
          {activation.image && (
            <img src={activation.image} alt={activation.experience} />
          )}
        </div>

        <div className="scs-drawer" onClick={(e) => e.stopPropagation()}>
          <button className="scs-drawer-close" onClick={onClose}>×</button>

          {/* ⭐ Date range */}
          <div className="scs-drawer-date">{dateRange}</div>

          {/* ⭐ Vendor */}
          <div className="scs-drawer-title">{activation.experience}</div>

          {/* ⭐ Activation name */}
          <div className="scs-drawer-activation-title"> {activation.vendor}</div>
          <hr />
          {activation.partner && (
            <p className="scs-partner-title">Presented By: {activation.partner}</p>
          )}
          {/* ⭐ Description */}
          {activation.description && (
            <p className="scs-drawer-bio">{activation.description}</p>
          )}
          {/* ⭐ Partner */}


          {/* ⭐ Links */}
          <div className="scs-drawer-links">
            {activation.vendorWeb && (
              <a href={activation.vendorWeb} target="_blank">
                <span className="material-symbols-outlined">computer</span>
              </a>
            )}

            {activation.vendorIg && (
              <a href={activation.vendorIg} target="_blank">
                <img
                  className="scs-drawer-social-icon"
                  src="https://scs-ochre.vercel.app/icons/Instagram_Glyph_Gradient.jpg"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
