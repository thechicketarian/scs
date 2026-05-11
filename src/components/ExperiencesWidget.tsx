import React, { useEffect, useState } from "react";
import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
import "./ExperiencesWidget.css";
import { ExperienceRow } from "../types/types";

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

  // ⭐ SAFE conditional render (after hooks + memo)
  if (loading) {
    return <div>Loading…</div>;
  }

  return (
    <div className="scs-experiences-widget">
      <h1 className="scs-experiences-title">Experiences & Activations</h1>

      <div className="scs-experiences-list">
        {activations.map((exp, i) => (
          <button
            key={i}
            className="scs-experience-card scs-card-button"
            onClick={() => openDrawer(exp)}
          >
            <div className="scs-music-info">
              <div>{exp.dates}</div>
                  <div className="scs-music-date">{exp.category}</div>
                  <div className="scs-music-artist">{exp.experience}</div>
                  <div
                    className="scs-artist-modal"
                  >
                    <span>about</span>
                    <span className="material-symbols-outlined">
                      arrow_outward
                    </span>
                  </div>
                </div>
                {exp.image && (
                  <div className="scs-music-artist-image artist-img">
                    <img src={exp.image} alt={exp.vendor} className="scs-artist-image" />
                  </div>
                )}
          </button>
        ))}
      </div>

      {activeActivation && (
        <ActivationDrawer activation={activeActivation} onClose={closeDrawer} />
      )}
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
  // ⭐ Compute date range for drawer
  const sortedDates = [...activation.dates].sort();
  const dateRange =
    sortedDates.length === 1
      ? sortedDates[0]
      : `${sortedDates[0]} – ${sortedDates[sortedDates.length - 1]}`;

  return (
    <div className="scs-drawer-overlay" onClick={onClose}>
      <div className="scs-content-wrapper">

        {/* ⭐ Optional image */}
        <div className="scs-drawer-img"></div>

        <div className="scs-drawer" onClick={(e) => e.stopPropagation()}>
          <button className="scs-drawer-close" onClick={onClose}>×</button>

          {/* ⭐ Date range */}
          <div className="scs-drawer-date">{dateRange}</div>

          {/* ⭐ Vendor */}
          <h4 className="scs-drawer-title">{activation.vendor}</h4>

          <hr />

          {/* ⭐ Activation name */}
          <h3 className="scs-drawer-activation-title">{activation.experience}</h3>

          {/* ⭐ Description */}
          {activation.description && (
            <p className="scs-drawer-bio">{activation.description}</p>
          )}

          {/* ⭐ Time */}
          {activation.time && (
            <p><strong>Time:</strong> {activation.time}</p>
          )}

          {/* ⭐ Partner */}
          {activation.partner && (
            <p><strong>Partner:</strong> {activation.partner}</p>
          )}

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
