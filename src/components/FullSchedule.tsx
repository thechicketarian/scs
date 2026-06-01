// import React from "react";
// import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
// import { DateTime } from "luxon";
// import "./FullSchedule.css";

// /* -----------------------------------------
//    TIME FORMATTER → "4pm", "5:30pm", "11am"
// ------------------------------------------ */
// function formatTime(dtString: string | null | undefined) {
//   if (!dtString) return "";

//   const dt = DateTime.fromISO(dtString);
//   if (!dt.isValid) return "";

//   // "4:30pm"
//   let formatted = dt.toFormat("h:mma").toLowerCase();

//   // Remove :00 → "4pm"
//   formatted = formatted.replace(":00", "");

//   return formatted;
// }

// export default function FullSchedule() {
//   const { schedule, loading } = useFestivalSchedule();

//   if (loading) return <div>Loading full schedule…</div>;

//   const days = Object.entries(schedule);

//   return (
//     <div className="full-schedule-wrapper">
//       {days.map(([dateKey, day]) => {
//         const m = day.meta;
//         if (!m) return null;

//         const formatted = DateTime.fromISO(dateKey, { zone: "America/Chicago" })
//           .toFormat("ccc LLLL d");

//         const isTwoSessionDay =
//           m.session1EndDateTime &&
//           m.session2StartDateTime;

//         /* -----------------------------------------
//            BUILD RAW TIMELINE
//         ------------------------------------------ */
//         const timeline: any[] = [];

//         // ONE-SESSION DAY → Doors Open
//         if (!isTwoSessionDay) {
//           timeline.push({
//             type: "meta",
//             label: "Gates Open",
//             time: formatTime(m.doorsOpenDateTime),
//             iso: m.doorsOpenDateTime
//           });
//         }

//         // TWO-SESSION DAY → Session 1
//         if (isTwoSessionDay) {
//           timeline.push({
//             type: "session",
//             label: "Session 1",
//             time: formatTime(m.doorsOpenDateTime),
//             end: formatTime(m.session1EndDateTime),
//             iso: m.doorsOpenDateTime
//           });
//         }

//         // MATCHES
//         day.matches?.forEach((match) => {
//           timeline.push({
//             type: "match",
//             label: `${match.teamA} vs. ${match.teamB}`,
//             time: formatTime(match.matchDateTime),
//             iso: match.matchDateTime
//           });
//         });

//         // TWO-SESSION DAY → Session 2
//         if (isTwoSessionDay) {
//           timeline.push({
//             type: "session",
//             label: "Session 2",
//             time: formatTime(m.session2StartDateTime),
//             end: formatTime(m.doorsCloseDateTime),
//             iso: m.session2StartDateTime
//           });
//         }

//         // MUSIC
//         const djSets: any[] = [];

//         day.music?.forEach((mus) => {
//           const hasTime = Boolean(mus.time && mus.musicDateTime);

//           if (hasTime) {
//             // Timed concert → goes into grid
//             timeline.push({
//               type: "music",
//               label: mus.artist,
//               time: formatTime(mus.musicDateTime),
//               iso: mus.musicDateTime
//             });
//           } else {
//             // Untimed DJ set → pop OUT of timeline
//             djSets.push({
//               label: mus.artist
//             });
//           }
//         });

//         // ⭐ ALL DAYS → Doors Close
//         timeline.push({
//           type: "meta",
//           label: "Gates Close",
//           time: formatTime(m.doorsCloseDateTime),
//           iso: m.doorsCloseDateTime
//         });

//         /* -----------------------------------------
//            SORT BY ISO
//         ------------------------------------------ */
//         timeline.sort((a, b) => {
//           if (!a.iso || !b.iso) return 0;
//           return (
//             DateTime.fromISO(a.iso).toMillis() -
//             DateTime.fromISO(b.iso).toMillis()
//           );
//         });

//         /* -----------------------------------------
//            RENDER USING A-SMART GRID BREAK LOGIC
//         ------------------------------------------ */
//         const rendered: any[] = [];
//         let grid: any[] = [];

//         const flushGrid = () => {
//           if (grid.length === 0) return;
//           rendered.push({
//             type: "grid",
//             items: [...grid]
//           });
//           grid = [];
//         };

//         timeline.forEach((item) => {
//           if (item.type === "match" || item.type === "music") {
//             grid.push(item);
//           } else {
//             flushGrid();
//             rendered.push(item);
//           }
//         });

//         flushGrid();

//         return (
//           <div key={dateKey} className="full-schedule-day">
//             <div className="fs-meta-wrapper">
//               <div className="fs-date scs-vendor-name">{formatted}</div>
//               <div className="fs-theme scs-music-date">
//                 {m.theme}
//               </div>
//             </div>

//             {djSets.length < 0 && (
//               <div className="dj-section">
//                 <div>
//                   <span>Sounds By:</span>
//                   {djSets.map((dj, i) => (
//                     <div key={i} className="dj-item">
//                       <strong>🎧 {dj.label}</strong>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="fs-section">
//               {rendered.map((block, i) => {
//                 if (block.type === "grid") {
//                   return (
//                     <div key={i} className="fs-match-grid">
//                       {block.items.map((item: any, j: number) => (
//                         <div key={j} className="fs-match-card">
//                           <div className="bold-label">
//                             <span>{item.type === "match" && "⚽ "}</span>
//                             <span>{item.type === "music" && "🎤 "}</span>
//                             <span className="sched-label-mini">{item.label}</span>
//                           </div>
//                           <div className="sched-label-mini">{item.time}</div>
//                         </div>
//                       ))}
//                     </div>
//                   );
//                 }

//                 // session or meta
//                 return (
//                   <div key={i} className="fs-item fs-session-item">
//                     <strong className="fs-uppercase">{block.label}</strong>
//                     {block.type === "session" ? (
//                       <div>{block.time} – {block.end}</div>
//                     ) : (
//                       <div>{block.time}</div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

import React from "react";
import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
import { DateTime } from "luxon";
import "./FullSchedule.css";

/* -----------------------------------------
   TIME FORMATTER → "4pm", "5:30pm", "11am"
------------------------------------------ */
function formatTime(dtString: string | null | undefined) {
  if (!dtString) return "";

  const dt = DateTime.fromISO(dtString);
  if (!dt.isValid) return "";

  let formatted = dt.toFormat("h:mma").toLowerCase();
  formatted = formatted.replace(":00", "");

  return formatted;
}

export default function FullSchedule({
  mode = "full"
}: {
  mode?: "full" | "upcoming";
}) {
  const { schedule, loading } = useFestivalSchedule();

  if (loading) return <div>Loading full schedule…</div>;

  const days = Object.entries(schedule);

  /* -----------------------------------------
     UPCOMING MODE → pick next active date
  ------------------------------------------ */
  let filteredDays = days;

  if (mode === "upcoming") {
    const now = DateTime.now().setZone("America/Chicago");

    const next = days.find(([dateKey, day]) => {
      const date = DateTime.fromISO(dateKey, { zone: "America/Chicago" });

      if (date < now.startOf("day")) return false;

      const hasContent =
        (day.matches && day.matches.length > 0) ||
        (day.music && day.music.length > 0);

      return hasContent;
    });

    filteredDays = next ? [next] : [];
  }

  return (
    <div className={`full-schedule-wrapper full-schedule--${mode}`}>
      {filteredDays.map(([dateKey, day]) => {
        const m = day.meta;
        if (!m) return null;

        const formatted = DateTime.fromISO(dateKey, { zone: "America/Chicago" })
          .toFormat("ccc LLLL d");

        const isTwoSessionDay =
          m.session1EndDateTime &&
          m.session2StartDateTime;

        /* -----------------------------------------
           BUILD RAW TIMELINE
        ------------------------------------------ */
        const timeline: any[] = [];
        const djSets: any[] = [];

        if (!isTwoSessionDay) {
          timeline.push({
            type: "meta",
            label: "Gates Open",
            time: formatTime(m.doorsOpenDateTime),
            iso: m.doorsOpenDateTime
          });
        }

        if (isTwoSessionDay) {
          timeline.push({
            type: "session",
            label: "Session 1",
            time: formatTime(m.doorsOpenDateTime),
            end: formatTime(m.session1EndDateTime),
            iso: m.doorsOpenDateTime
          });
        }

        day.matches?.forEach((match) => {
          timeline.push({
            type: "match",
            label: `${match.teamA} vs. ${match.teamB}`,
            time: formatTime(match.matchDateTime),
            iso: match.matchDateTime
          });
        });

        if (isTwoSessionDay) {
          timeline.push({
            type: "session",
            label: "Session 2",
            time: formatTime(m.session2StartDateTime),
            end: formatTime(m.doorsCloseDateTime),
            iso: m.session2StartDateTime
          });
        }

        day.music?.forEach((mus) => {
          const hasTime = Boolean(mus.time && mus.musicDateTime);

          if (hasTime) {
            timeline.push({
              type: "music",
              label: mus.artist,
              time: formatTime(mus.musicDateTime),
              iso: mus.musicDateTime
            });
          } else {
            djSets.push({ label: mus.artist });
          }
        });

        timeline.push({
          type: "meta",
          label: "Gates Close",
          time: formatTime(m.doorsCloseDateTime),
          iso: m.doorsCloseDateTime
        });

        timeline.sort((a, b) => {
          if (!a.iso || !b.iso) return 0;
          return (
            DateTime.fromISO(a.iso).toMillis() -
            DateTime.fromISO(b.iso).toMillis()
          );
        });

        const rendered: any[] = [];
        let grid: any[] = [];

        const flushGrid = () => {
          if (grid.length === 0) return;
          rendered.push({ type: "grid", items: [...grid] });
          grid = [];
        };

        timeline.forEach((item) => {
          if (item.type === "match" || item.type === "music") {
            grid.push(item);
          } else {
            flushGrid();
            rendered.push(item);
          }
        });

        flushGrid();

        return (
          <div key={dateKey} className="full-schedule-day">
            <div className="fs-meta-wrapper">
              <div className="fs-date scs-vendor-name">{formatted}</div>
              <div className="fs-theme scs-music-date">{m.theme}</div>
            </div>

            {djSets.length > 0 && (
              <div className="dj-section">
                <span>Sounds By:</span>
                {djSets.map((dj, i) => (
                  <div key={i} className="dj-item">
                    🎧 {dj.label}
                  </div>
                ))}
              </div>
            )}

            <div className="fs-section">
              {rendered.map((block, i) => {
                if (block.type === "grid") {
                  return (
                    <div key={i} className="fs-match-grid">
                      {block.items.map((item: any, j: number) => (
                        <div key={j} className="fs-match-card">
                          <div className="bold-label">
                            <span>{item.type === "match" && "⚽ "}</span>
                            <span>{item.type === "music" && "🎤 "}</span>
                            <span className="sched-label-mini">{item.label}</span>
                          </div>
                          <div className="sched-label-mini">{item.time}</div>
                        </div>
                      ))}
                    </div>
                  );
                }

                return (
                  <div key={i} className="fs-item fs-session-item">
                    <strong className="fs-uppercase">{block.label}</strong>
                    {block.type === "session" ? (
                      <div>{block.time} – {block.end}</div>
                    ) : (
                      <div>{block.time}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
