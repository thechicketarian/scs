import React from 'react';
import { useSheetData } from '../useSheetData';
import './Schedule.css';
import './Schedule-List.css';
import './Schedule-Grid.css';
import './Schedule-Carousel.css';

/**
 * SCHEMA MAPPERS
 * These match the camelCase normalization from your hook.
 */
const mapMetaData = (row) => ({
  date: row.date || "",
  doorsOpen: row.doorsOpen || "",
  doorsClose: row.doorsClose || "",
  session1End: row.session1End || "",
  session2Start: row.session2Start || "",
  theme: row.theme || "",
  description: row.description || "",
  matchCategory: row.matchCategory || ""
});

const mapMatchData = (row) => ({
  date: row.date || "",
  session: String(row.session || ""),
  teamA: row.teamA || "TBA",
  teamAFlag: row.teamAFlag || "",
  teamB: row.teamB || "TBA",
  teamBFlag: row.teamBFlag || "",
  matchTime: row.matchTime || "TBD"
});

export default function Schedule({ targetDate = null, filterMonth = null, layout }) {
  const { data: rawMeta, loading: metaLoading } = useSheetData('843872450');
  const { data: rawMatch, loading: matchLoading } = useSheetData('179580476');

  /**
   * Helper: Slugify
   */
  const slugify = (str) => {
    if (!str) return "";
    return str.toLowerCase().trim().replace(/\s+/g, '-');
  };

  if (metaLoading || matchLoading) return <div className="scs-loader">Syncing Schedule...</div>;

  const metaData = (rawMeta || []).map(mapMetaData);
  const matchData = (rawMatch || []).map(mapMatchData);

  let displayDays = metaData;

  // Filtering Logic
  if (targetDate) {
    const targetSlug = slugify(targetDate);
    displayDays = metaData.filter(m => slugify(m.date) === targetSlug);
  } else if (filterMonth) {
    const monthSlug = slugify(filterMonth);
    displayDays = metaData.filter(m => slugify(m.date).includes(monthSlug));
  }

  // Determine the active layout class
  const activeLayout = layout || 'list';

  return (
    <div className={`scs-main-wrapper scs-layout-${activeLayout}`}>
      {displayDays.map((day, index) => {
        const daySlug = slugify(day.date);
        const dayMatches = matchData.filter(m => slugify(m.date) === daySlug);

        // Count unique sessions for this specific day to decide on labeling
        const uniqueSessionsCount = [...new Set(dayMatches.map(m => m.session))].length;

        return (
          <div key={index} className={`scs-day-block`} id={`date-${daySlug}`}>
            <div className='scs-day-date-wrapper'>
              <h3 className="scs-date-text">{day.date}</h3>
              <div
                className='fivoButton'
                role='button'
                onClick={() => window.GMWidget && window.GMWidget.open('SoccerCapitalSummer')}
              >
                <span className='scs-sched-button-label'> find tickets </span>
                <span className="material-symbols-outlined">
                  arrow_outward
                </span>
              </div>
            </div>
            <div className="scs-day-meta">
              <div className="scs-day-copy">
                {day.theme ? (
                  <h3 className="scs-theme-title">{day.theme}</h3>
                ) : (
                  <h3 className="scs-theme-title"> Theme Needed </h3>
                )}
              </div>
              <div className="scs-day-desc">
                <p>{day.description}</p>
                {/* Only show the disclaimer if the day has multiple sessions */}
                {uniqueSessionsCount > 1 && (
                  <div className='cardDisclaimer'>
                    For days featuring two sessions, premium admission is ticketed separately—one ticket per session is required.
                  </div>
                )}
              </div>
            </div>

            <div className="scs-match-list">
              {/* Added activeLayout to renderSession */}
              {renderSession(dayMatches, "1", day, uniqueSessionsCount, activeLayout)}
              {renderSession(dayMatches, "2", day, uniqueSessionsCount, activeLayout)}

              {dayMatches.length === 0 && (
                <p className="scs-no-matches">Matches for this day are currently being finalized.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * RENDER HELPER: Session Block
 */
function renderSession(allMatches, sessionNum, day, totalSessions, layout) {
  const matches = allMatches.filter(m => m.session === sessionNum);
  if (matches.length === 0) return null;

  const showLabel = totalSessions > 1;
  const { doorsOpen, session1End, session2Start, doorsClose } = day;

  // Logic for the time range string
  let timeRange = "";
  if (totalSessions > 1) {
    timeRange = sessionNum === "1"
      ? `${doorsOpen} - ${session1End}`
      : `${session2Start} - ${doorsClose}`;
  } else {
    timeRange = `${doorsOpen} - ${doorsClose}`;
  }

  const isTBA = (team) => !team || team === "TBA" || team === "TBD" || team === "TBC";

  // Dynamic class for the container
  const containerClass = layout === 'carousel' ? 'scs-match-carousel' : 'scs-match-grid';

  return (
    <div className={`scs-session scs-session-${layout}`}>
      <h6 className="scs-session-header">
        <div className="scs-session-title-group">
          <span>{showLabel ? `Session ${sessionNum}` : "Day Schedule"}</span>
        </div>
        <span className="scs-time-label"> {timeRange}</span>
      </h6>
      <div className={containerClass}>
        {matches.map((m, i) => (
          <div key={i} className="scs-match-card">
            <div className="scs-match-teams">
            
                {isTBA(m.teamA) && isTBA(m.teamB) ? (
                  null
                ) : (
                  <>
                    <div className='scs-team-flags-wrapper'>
                    <div className="scs-flag">{m.teamAFlag && <img src={m.teamAFlag} alt="" />}</div>
                    <div className="scs-flag">{m.teamBFlag && <img src={m.teamBFlag} alt="" />}</div>
                  </div>
                  </>
                )
                }
              <div className='scs-team-details'>
                <div className='scs-team-matchup'>
                  <div className='scs-team-vs-wrapper'>
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