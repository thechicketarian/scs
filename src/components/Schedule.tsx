import React from "react";
import { useFestivalSchedule } from "../hooks/useFestivalSchedule";

import {
  FestivalDay,
  MetaRow,
  MatchRow,
  SoccerCapSchedule,
  ScheduleProps
} from "../types/types";

import "./Schedule.css";
import "./Schedule-List.css";
import "./Schedule-Grid.css";
import { DateTime } from "luxon";
/* -----------------------------
   Helpers
------------------------------ */
const slugify = (str: string | null | undefined): string =>
  str?.toLowerCase().trim().replace(/\s+/g, "-") || "";

/* -----------------------------
   Main Component
------------------------------ */
export default function Schedule({
  targetDate = null,
  filterMonth = null,
  layout
}: ScheduleProps) {
  const { schedule, loading } = useFestivalSchedule();

  if (loading) return <div className="scs-loader">Syncing Schedule...</div>;

  /* -----------------------------
     Build a typed list of days
  ------------------------------ */
  const allDays = Object.entries(schedule)
    .map(([key, day]) => ({
      key,               // normalized date key
      meta: day.meta!,   // guaranteed non-null
      matches: day.matches,
      music: day.music,
      experiences: day.experiences
    }))
    .filter((d) => Boolean(d.meta));

  let displayDays = allDays;

  /* -----------------------------
     Filtering Logic
  ------------------------------ */
  if (targetDate) {
    const targetSlug = slugify(targetDate);
    displayDays = allDays.filter((d) => slugify(d.key) === targetSlug);
  } else if (filterMonth) {
    const monthSlug = slugify(filterMonth);
    displayDays = allDays.filter((d) => slugify(d.key).includes(monthSlug));
  }

  const activeLayout = layout || "list";

  return (
    <div className={`scs-main-wrapper scs-layout-${activeLayout}`}>
      {displayDays.map((day, index) => {
        const { key, meta, matches } = day;
        const daySlug = slugify(key);
        const EventDate = DateTime.fromISO(key).toFormat("ccc LLLL d")
        const uniqueSessions = [...new Set(matches.map((m) => m.session))];
        const uniqueSessionsCount = uniqueSessions.length;

        return (
          <div key={index} className="scs-day-block" id={`date-${daySlug}`}>
            {/* -----------------------------
                Date + Ticket Button
            ------------------------------ */}
            <div className="scs-day-date-wrapper">
              <h3 className="scs-date-text">{EventDate}</h3>
              <div
                className="fivoButton"
                role="button"
                onClick={() => (window as any).GMWidget?.open("SoccerCapitalSummer")}
              >
                <span className="scs-sched-button-label"> find tickets </span>
                <span className="material-symbols-outlined">arrow_outward</span>
              </div>
            </div>

            {/* -----------------------------
                Meta Block
            ------------------------------ */}
            <div className="scs-day-meta">
              <div className="scs-day-copy">
                <h3 className="scs-theme-title">{meta.theme || "Theme Needed"}</h3>
              </div>

              <div className="scs-day-desc">
                <p>{meta.description}</p>

                {uniqueSessionsCount > 1 && (
                  <div className="cardDisclaimer">
                    For days featuring two sessions, premium admission is ticketed
                    separately—one ticket per session is required.
                  </div>
                )}
              </div>
            </div>

            {/* -----------------------------
                Matches
            ------------------------------ */}
            <div className="scs-match-list">
              {renderSession(matches, "1", meta, uniqueSessionsCount, activeLayout)}
              {renderSession(matches, "2", meta, uniqueSessionsCount, activeLayout)}

              {matches.length === 0 && (
                <p className="scs-no-matches">
                  Matches for this day are currently being finalized.
                </p>
              )}
            </div>
          </div>
        );
      })}
          <div className="scs-breadcrumbs-bottom-nav">
          <a className="scs-breadcrumbs-item" href="https://www.soccercapitalsummer.com/tickets" target="_blank"><span className="material-symbols-outlined">
            arrow_back
          </span>Find Tickets</a>
          
          <a className="scs-breadcrumbs-item" href="https://www.soccercapitalsummer.com/experience" target="_blank">Live Music<span className="material-symbols-outlined">
            arrow_forward
          </span></a>
        </div>
    </div>
  );
}

/* -----------------------------
   Session Renderer
------------------------------ */
function renderSession(
  allMatches: MatchRow[],
  sessionNum: string,
  meta: MetaRow,
  totalSessions: number,
  layout: string
) {
  const matches = allMatches.filter((m) => m.session === sessionNum);
  if (matches.length === 0) return null;

  const { doorsOpen, session1End, session2Start, doorsClose } = meta;

  let timeRange = "";
  if (totalSessions > 1) {
    timeRange =
      sessionNum === "1"
        ? `${doorsOpen} - ${session1End}`
        : `${session2Start} - ${doorsClose}`;
  } else {
    timeRange = `${doorsOpen} - ${doorsClose}`;
  }

  const showLabel = totalSessions > 1;
  const containerClass =
    layout === "carousel" ? "scs-match-carousel" : "scs-match-grid";

  const isTBA = (team: string | undefined) =>
    !team || ["TBA", "TBD", "TBC"].includes(team);

  return (
    <div className={`scs-session scs-session-${layout}`}>
      <h6 className="scs-session-header">
        <div className="scs-session-title-group">
          <span>{showLabel ? `Session ${sessionNum}` : "Day Schedule"}</span>
        </div>
        <span className="scs-time-label">{timeRange}</span>
      </h6>

      <div className={containerClass}>
        {matches.map((m, i) => (
          <div key={i} className="scs-match-card">
            <div className="scs-match-teams">
              {/* Flags */}
              {!isTBA(m.teamA) || !isTBA(m.teamB) ? (
                <div className="scs-team-flags-wrapper">
                  <div className="scs-flag">
                    {m.teamAFlag && <img src={m.teamAFlag} alt="" />}
                  </div>
                  <div className="scs-flag">
                    {m.teamBFlag && <img src={m.teamBFlag} alt="" />}
                  </div>
                </div>
              ) : null}

              {/* Team Names */}
              <div className="scs-team-details">
                <div className="scs-team-matchup">
                  <div className="scs-team-vs-wrapper">
                    {isTBA(m.teamA) && isTBA(m.teamB) ? (
                      <div className="scs-team-name scs-team-tba">Matchup TBA</div>
                    ) : (
                      <>
                        <div className="scs-team-name">{m.teamA}</div>
                        <span className="scs-vs">vs.</span>
                        <div className="scs-team-name">{m.teamB}</div>
                      </>
                    )}
                  </div>
                  <span className="scs-match-time">{m.matchTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
  );
}
