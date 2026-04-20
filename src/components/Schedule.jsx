import { useSheetData } from '../useSheetData';
import './Schedule.css';

/**
 * SCHEMA MAPPERS
 * These match the camelCase normalization from your hook.
 * "Doors Open" -> doorsOpen | "Session 1" -> session1Start (mapped from session1)
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

export default function Schedule({ targetDate = null, filterMonth = null }) {
  const { data: rawMeta, loading: metaLoading } = useSheetData('843872450');
  const { data: rawMatch, loading: matchLoading } = useSheetData('179580476');

  /**
   * Helper: Slugify
   * Normalizes "June 17" to "june-17" for internal logic and HTML IDs
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

  return (
    <div className="scs-schedule-wrapper">
      {displayDays.map((day, index) => {
        const daySlug = slugify(day.date);
        const dayMatches = matchData.filter(m => slugify(m.date) === daySlug);

        // Count unique sessions for this specific day to decide on labeling
        const uniqueSessionsCount = [...new Set(dayMatches.map(m => m.session))].length;

        return (
          <div key={index} className="scs-day-block" id={`date-${daySlug}`}>
            <div className='scs-day-date-wrapper'>
              <h3 className="scs-date-text">{day.date}</h3>
              <div
                className='fivoButton'
                role='button'
                onClick={() => window.GMWidget && window.GMWidget.open('SoccerCapitalSummer')}
              >
                <span className='scs-sched-button-label'>  find tixs </span>
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
                {/* <div className="scs-door-times">
                  <div>
                    {day.doorsOpen && <h5 className="scs-doors"> {day.doorsOpen}</h5>}
                  </div>
                  <h5>-</h5>
                  <div>
                    {day.doorsClose && <h5 className="scs-doors">{day.doorsClose}</h5>}
                  </div>
                </div> */}

              </div>
              <div>
                <p className="scs-day-desc">{day.description}</p>
                {/* Only show the disclaimer if the day has multiple sessions */}
                {uniqueSessionsCount > 1 && (
                  <div className='cardDisclaimer'>
                    For days featuring two sessions, premium admission is ticketed separately—one ticket per session is required.
                  </div>
                )}
              </div>
            </div>

            <div className="scs-match-list">
              {/* We now just pass the match list, the session number, the full day object, and the count */}
              {renderSession(dayMatches, "1", day, uniqueSessionsCount)}
              {renderSession(dayMatches, "2", day, uniqueSessionsCount)}

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
function renderSession(allMatches, sessionNum, day, totalSessions) {
  const matches = allMatches.filter(m => m.session === sessionNum);
  if (matches.length === 0) return null;

  const showLabel = totalSessions > 1;
  const { doorsOpen, session1End, session2Start, doorsClose, matchCategory } = day;

  // Logic for the time range string
  let timeRange = "";
  if (totalSessions > 1) {
    // Session 1: Doors -> Session 2 | Session 2: Session 2 -> Close
    timeRange = sessionNum === "1"
      ? `${doorsOpen} - ${session1End}`
      : `${session2Start} - ${doorsClose}`;
  } else {
    // Single Session: Doors -> Close
    timeRange = `${doorsOpen} - ${doorsClose}`;
  }
  const isTBA = (team) => !team || team === "TBA" || team === "TBD" || team === "TBC";

  return (
    <div className="scs-session">

      <h6 className="scs-session-header">
        <div className="scs-session-title-group">
          <span>{showLabel ? `Session ${sessionNum}` : "Day Schedule"}</span>
        </div>
        <span className="scs-time-label"> {timeRange}</span>
        {/* Pulling category directly from the day object we passed in */}
        {/* {matchCategory && (
          <span className="scs-session-category">{matchCategory}</span>
        )} */}
      </h6>
      <div className="scs-match-grid">
        {matches.map((m, i) => (
          <div key={i} className="scs-match-card">
            <div className="scs-match-teams">
              <div className='scs-team-flags-wrapper'>
                <div className="scs-flag">{m.teamAFlag && <img src={m.teamAFlag} alt="" />}</div>
                <div className="scs-flag">{m.teamBFlag && <img src={m.teamBFlag} alt="" />}</div>
              </div>
              <div className='scs-team-details'>
                <div className='scs-team-matchup'>
                  {isTBA(m.teamA) && isTBA(m.teamB) ? (
                    /* Case: Both are TBA */
                    <div className="scs-team-name scs-team-tba">Matchup TBA</div>
                  ) : (
                    /* Case: At least one team is known */
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
        ))}
      </div>
    </div>
  );
}