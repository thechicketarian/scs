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
  session1Start: row.session1 || "",
  session2Start: row.session2 || "",
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
            <h2 className="scs-date-text">{day.date}</h2>
            <div className="scs-day-meta">
              <div className="scs-day-copy">
                {day.theme ? (
                  <h3 className="scs-theme-title">{day.theme}</h3>
                ) : (
                  <h3 className="scs-theme-title" style={{ color: 'red' }}> Theme Needed </h3>
                )}
              </div>
              <div className="scs-door-times">
                <div>
                  {day.doorsOpen && <h3 className="scs-doors"> {day.doorsOpen}</h3>}
                </div>
                <h3>-</h3>
                <div>
                  {day.doorsClose && <h3 className="scs-doors">{day.doorsClose}</h3>}
                </div>
              </div>
            </div>
            <p className="scs-day-desc">{day.description}</p>
            <div className='scs-day-match-category'>{day.matchCategory}</div>
            <div className="scs-match-list">
              {/* Pass uniqueSessionsCount to handle conditional labeling */}
              {renderSession(dayMatches, "1", day.session1Start, uniqueSessionsCount)}
              {renderSession(dayMatches, "2", day.session2Start, uniqueSessionsCount)}

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
 * Only shows "Session X" labels if there is more than 1 session on that day.
 */
function renderSession(allMatches, sessionNum, sessionStart, totalSessions) {
  const matches = allMatches.filter(m => m.session === sessionNum);
  if (matches.length === 0) return null;

  const showLabel = totalSessions > 1;

  return (
    <div className="scs-session">
      {(showLabel || sessionStart) && (
        <h4 className="scs-session-header">
         <span> {showLabel && `Session ${sessionNum}`}</span>
          {sessionStart && (
            <span className="scs-time-label">
              {showLabel ? ` ${sessionStart}` : `${sessionStart}`}
            </span>
          )}
        </h4>
      )}

      <div className="scs-match-grid">
        {matches.map((m, i) => (
          <div key={i} className="scs-match-card">

            <div className="scs-match-teams">
            <div className='scs-team-flags-wrapper'>
              <div className='scs-team'>
                <div className="scs-flag-img" >
                  {m.teamAFlag && <img src={m.teamAFlag} alt="" />}
                </div>
              </div>
              <div className='scs-team'>
                <div className="scs-flag-img">
                  {m.teamBFlag && <img src={m.teamBFlag} alt="" />}
                </div>
              </div>
              </div>
              <div className='scs-team-details'>
                <div className="scs-team-name">{m.teamA}</div>
                <span className="scs-vs">vs.</span>
                <div className="scs-team-name">{m.teamB}</div>
                <div>
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