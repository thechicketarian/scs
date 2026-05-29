// import React from "react";
// import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
// import { DateTime } from "luxon";
// import "./FullSchedule.css";

// export default function FullSchedule() {
//   const { schedule, loading } = useFestivalSchedule();

//   if (loading) return <div>Loading full schedule…</div>;

//   const days = Object.entries(schedule);

//   return (
//     <div className="full-schedule-wrapper">
//       {days.map(([dateKey, day]) => {
//         const formatted = DateTime.fromISO(dateKey, { zone: "America/Chicago" })
//           .toFormat("cccc LLLL d");

//         /* -----------------------------------------
//            Build unified timeline using ISO fields
//         ------------------------------------------ */
//         const timeline: {
//           type: "meta" | "match" | "music";
//           label: string;
//           time: string;
//           iso: string | null | undefined;
//         }[] = [];

//         /* -----------------------------------------
//            META EVENTS
//         ------------------------------------------ */
//         if (day.meta) {
//           const m = day.meta;

//           if (m.doorsOpen) {
//             timeline.push({
//               type: "meta",
//               label: "Session 1",
//               time: m.doorsOpen,
//               iso: m.doorsOpenDateTime
//             });
//           }

//           if (m.session1End) {
//             timeline.push({
//               type: "meta",
//               label: "Session 1 Ends",
//               time: m.session1End,
//               iso: m.session1EndDateTime
//             });
//           }

//           if (m.session2Start) {
//             timeline.push({
//               type: "meta",
//               label: "Session 2",
//               time: m.session2Start,
//               iso: m.session2StartDateTime
//             });
//           }

//           if (m.doorsClose) {
//             timeline.push({
//               type: "meta",
//               label: "Doors Close",
//               time: m.doorsClose,
//               iso: m.doorsCloseDateTime
//             });
//           }
//         }

//         /* -----------------------------------------
//            MATCHES
//         ------------------------------------------ */
//         day.matches?.forEach((m) => {
//           timeline.push({
//             type: "match",
//             label: `${m.teamA} vs ${m.teamB}`,
//             time: m.matchTime,
//             iso: m.matchDateTime
//           });
//         });

//         /* -----------------------------------------
//            MUSIC
//         ------------------------------------------ */
//         day.music?.forEach((m) => {
//           timeline.push({
//             type: "music",
//             label: m.artist,
//             time: m.time,
//             iso: m.musicDateTime
//           });
//         });

//         /* -----------------------------------------
//            SORT BY ISO DATETIME
//         ------------------------------------------ */

//         console.log(timeline)
//         timeline.sort((a, b) => {
//           if (!a.iso || !b.iso) return 0;
//           return (
//             DateTime.fromISO(a.iso).toMillis() -
//             DateTime.fromISO(b.iso).toMillis()
//           );
//         });

//         return (
//           <div key={dateKey} className="full-schedule-day">
//             <h2 className="fs-date">{formatted}</h2>

//             {/* META BLOCK */}
//             {day.meta && (
//               <div className="fs-meta">
//                 <h3>{day.meta.theme}</h3>
//                 {/* <p>{day.meta.description}</p> */}
//               </div>
//             )}
//               <h4>Schedule</h4>
//             {/* UNIFIED TIMELINE */}
//             <div className="fs-section">
//               {timeline.map((item, i) => (
//                 <div key={i} className="fs-item">
//                   <strong>
//                     {item.type === "match" && "⚽ "}
//                     {item.type === "music" && "🎤 "}
//                     {item.type === "meta" && ""}
//                     {item.label}
//                   </strong>
//                   <div>{item.time}</div>
//                 </div>
//               ))}
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

export default function FullSchedule() {
  const { schedule, loading } = useFestivalSchedule();

  if (loading) return <div>Loading full schedule…</div>;

  const days = Object.entries(schedule);

  return (
    <div className="full-schedule-wrapper">
      {days.map(([dateKey, day]) => {
        const m = day.meta;
        if (!m) return null;

        const formatted = DateTime.fromISO(dateKey, { zone: "America/Chicago" })
          .toFormat("LLLL d");

        const isTwoSessionDay =
          m.session1EndDateTime &&
          m.session2StartDateTime;

        /* -----------------------------------------
           BUILD RAW TIMELINE
        ------------------------------------------ */
        const timeline: any[] = [];

        // ONE-SESSION DAY → Doors Open
        if (!isTwoSessionDay) {
          timeline.push({
            type: "meta",
            label: "Gates Open",
            time: DateTime.fromISO(m.doorsOpenDateTime!).toFormat("h:mm a"),
            iso: m.doorsOpenDateTime
          });
        }

        // TWO-SESSION DAY → Session 1
        if (isTwoSessionDay) {
          timeline.push({
            type: "session",
            label: "Session 1",
            time: DateTime.fromISO(m.doorsOpenDateTime!).toFormat("h:mm a"),
            end: DateTime.fromISO(m.session1EndDateTime!).toFormat("h:mm a"),
            iso: m.doorsOpenDateTime
          });
        }

        // MATCHES
        day.matches?.forEach((match) => {
          timeline.push({
            type: "match",
            label: `${match.teamA} vs ${match.teamB}`,
            time: match.matchTime,
            iso: match.matchDateTime
          });
        });

        // TWO-SESSION DAY → Session 2
        if (isTwoSessionDay) {
          timeline.push({
            type: "session",
            label: "Session 2",
            time: DateTime.fromISO(m.session2StartDateTime!).toFormat("h:mm a"),
            end: DateTime.fromISO(m.doorsCloseDateTime!).toFormat("h:mm a"),
            iso: m.session2StartDateTime
          });
        }

        // MUSIC
        // day.music?.forEach((mus) => {
        //   timeline.push({
        //     type: "music",
        //     label: mus.artist,
        //     time: mus.time,
        //     iso: mus.musicDateTime
        //   });
        // });

        // ⭐ ALL DAYS → Doors Close (FIXED)
        timeline.push({
          type: "meta",
          label: "Gates Close",
          time: m.doorsClose,
          iso: m.doorsCloseDateTime
        });

        /* -----------------------------------------
           SORT BY ISO
        ------------------------------------------ */
        timeline.sort((a, b) => {
          if (!a.iso || !b.iso) return 0;
          return (
            DateTime.fromISO(a.iso).toMillis() -
            DateTime.fromISO(b.iso).toMillis()
          );
        });

        /* -----------------------------------------
           RENDER USING A-SMART GRID BREAK LOGIC
        ------------------------------------------ */
        const rendered: any[] = [];
        let grid: any[] = [];

        const flushGrid = () => {
          if (grid.length === 0) return;
          rendered.push({
            type: "grid",
            items: [...grid]
          });
          grid = [];
        };

        timeline.forEach((item) => {
          if (item.type === "match" || item.type === "music") {
            grid.push(item);
          } else {
            // session or meta → break the grid
            flushGrid();
            rendered.push(item);
          }
        });

        // flush final grid
        flushGrid();

        return (
          <div key={dateKey} className="full-schedule-day">
            <div className="fs-meta-wrapper">
              <div className="fs-date scs-vendor-name">{formatted}</div>
              <div className="fs-theme scs-music-date">
                {m.theme}
              </div>
            </div>

            <div className="fs-section">
              {rendered.map((block, i) => {
                if (block.type === "grid") {
                  return (
                    <div key={i} className="fs-match-grid">
                      {block.items.map((item: any, j: number) => (
                        <div key={j} className="fs-match-card">
                          <strong className="bold-label">
                            {/* <span>  {item.type === "match" && "⚽ "}</span>
                            <span> {item.type === "music" && "🎤 "}</span> */}
                            <span className="sched-label-mini"> {item.label}</span>
                          </strong>
                          <div className="sched-label-mini">{item.time}</div>
                        </div>
                      ))}
                    </div>
                  );
                }

                // session or meta
                return (
                  <div key={i} className="fs-item fs-session-item">
                    <strong>{block.label}</strong>
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
