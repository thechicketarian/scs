// import React from "react";
// import { useFestivalSchedule } from "../hooks/useFestivalSchedule";
// import { DateTime } from "luxon";
// import "./FullSchedule.css";
// import { ExperiencesCarousel } from "./ExperiencesCarousel";
// import { sortExperiences } from "../utils/SortExperiences";

// /* -----------------------------------------
//    TIME FORMATTER → "4pm", "5:30pm", "11am"
// ------------------------------------------ */
// function formatTime(dtString: string | null | undefined) {
//   if (!dtString) return "";

//   const dt = DateTime.fromISO(dtString);
//   if (!dt.isValid) return "";

//   let formatted = dt.toFormat("h:mm a ").toLowerCase();
//   formatted = formatted.replace(":00", "");
//   return formatted;
// }


// export default function FullSchedule({
//   mode = "full"
// }: {
//   mode?: "full" | "upcoming";
// }) {
//   const { schedule, loading } = useFestivalSchedule();

//   if (loading) return <div>Loading full schedule…</div>;

//   const days = Object.entries(schedule);

//   /* -----------------------------------------
//      UPCOMING MODE → pick next active date
//   ------------------------------------------ */
//   let filteredDays = days;

//   if (mode === "upcoming") {
//     const now = DateTime.now().setZone("America/Chicago");

//     const next = days.find(([dateKey, day]) => {
//       const date = DateTime.fromISO(dateKey, { zone: "America/Chicago" });

//       if (date < now.startOf("day")) return false;

//       const hasContent =
//         (day.matches && day.matches.length > 0) ||
//         (day.music && day.music.length > 0);

//       return hasContent;
//     });

//     filteredDays = next ? [next] : [];
//   }

//   return (
//     <div className={`full-schedule-wrapper full-schedule--${mode}`}>
//       {filteredDays.map(([dateKey, day]) => {
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
//         const djSets: any[] = [];

//         if (!isTwoSessionDay) {
//           timeline.push({
//             type: "meta",
//             label: "Gates Open",
//             time: formatTime(m.doorsOpenDateTime),
//             iso: m.doorsOpenDateTime
//           });
//         }

//         if (isTwoSessionDay) {
//           timeline.push({
//             type: "session",
//             label: "Session 1",
//             time: formatTime(m.doorsOpenDateTime),
//             end: formatTime(m.session1EndDateTime),
//             iso: m.doorsOpenDateTime
//           });
//         }

//         day.matches?.forEach((match) => {
//           timeline.push({
//             type: "match",
//             teamAFlag: `${match.teamAFlag}`,
//             teamBFlag: `${match.teamBFlag}`,
//             teamACode: `${match.teamACode}`,
//             teamBCode: `${match.teamBCode}`,
//             label: `${match.teamA} vs. ${match.teamB}`,
//             time: formatTime(match.matchDateTime),
//             iso: match.matchDateTime
//           });
//         });

//         if (isTwoSessionDay) {
//           timeline.push({
//             type: "session",
//             label: "Session 2",
//             time: formatTime(m.session2StartDateTime),
//             end: formatTime(m.doorsCloseDateTime),
//             iso: m.session2StartDateTime
//           });
//         }

//         day.music?.forEach((mus) => {
//           const hasTime = Boolean(mus.time && mus.musicDateTime);

//           if (hasTime) {
//             timeline.push({
//               type: "music",
//               label: mus.artist,
//               time: formatTime(mus.musicDateTime),
//               iso: mus.musicDateTime,
//               image: mus.image
//             });
//           } else {
//             djSets.push({ label: mus.artist });
//           }
//         });

//         timeline.push({
//           type: "meta",
//           label: "Gates Close",
//           time: formatTime(m.doorsCloseDateTime),
//           iso: m.doorsCloseDateTime
//         });

//         timeline.sort((a, b) => {
//           if (!a.iso || !b.iso) return 0;
//           return (
//             DateTime.fromISO(a.iso).toMillis() -
//             DateTime.fromISO(b.iso).toMillis()
//           );
//         });

//         const rendered: any[] = [];
//         const experiences = sortExperiences(day.experiences || []);


//         let grid: any[] = [];

//         const flushGrid = () => {
//           if (grid.length === 0) return;
//           rendered.push({ type: "grid", items: [...grid] });
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
//               <div className="fs-date scs-music-date">{formatted}</div>
//               <div className="fs-theme scs-vendor-name">{m.theme}</div>
//             </div>



//             <div className="fs-section">
//               {rendered.map((block, i) => {
//                 if (block.type === "grid") {
//                   return (
//                     <div key={i} className="fs-match-grid">
//                       {block.items.map((item: any, j: number) => (
//                         <>
//                           <div key={j} className="fs-match-card">
//                             {item.type === "match" ?
//                               <>
//                                 <div className="fs-match-group">
//                                   <div className="fs-match-team">
//                                     <div className="fs-match-flag"> <img src={item.teamAFlag} /></div>
//                                     <span className="fs-match-teamCode fs-uppercase">{item.teamACode}</span>
//                                   </div>
//                                   <div className="fs-match-team">
//                                     <div className="fs-match-flag">
//                                       <img src={item.teamBFlag} />
//                                     </div>
//                                     <span className="fs-match-teamCode fs-uppercase">{item.teamBCode}</span>
//                                   </div>
//                                 </div>
//                                 <div className="fs-match-time fs-label-global-sm fs-uppercase">{item.time}</div>
//                               </>
//                               :
//                               null
//                             }
//                             {item.type === "music"
//                               ?
//                               <>
//                                 <div className="fs-music-group">
//                                   <div className="fs-music-artist">
//                                     <div className="fs-music-image">
//                                       <img src={item.image} />
//                                     </div>
//                                     <span className="fs-music-artist-name fs-uppercase">{item.label}
//                                     </span>
//                                   </div>
//                                 </div>
//                                 <div className="fs-match-time fs-label-global-sm fs-uppercase">{item.time}</div>
//                               </>
//                               :
//                               null
//                             }

//                           </div>
//                           <span className="fs-match-divider">\</span>
//                         </>
//                       ))}

//                     </div>
//                   );
//                 }

//                 return (
//                   <div key={i} className="fs-item fs-session-item">
//                     <strong className="fs-label-global-sm">{block.label}</strong>
//                     {block.type === "session" ? (
//                       <div className="fs-label-global-sm fs-uppercase">{block.time} – {block.end}</div>
//                     ) : (
//                       <div className="fs-label-global-sm fs-uppercase">{block.time}</div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>


//             {djSets.length > 0 && (
//               <div className="dj-section">
//                 <div className="dj-section-title fs-label-global-sm">Sounds By</div>
//                 {/* <div><img src="" /></div> */}
//                 <div className="fs-dj-group">
//                   {djSets.map((dj, i) => (
//                     <div key={i} className="dj-item">
//                       {dj.label}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {/* -----------------------------------------
//     DAILY EXPERIENCES SECTION
// ------------------------------------------ */}
//             {experiences.length > 0 && (
//               <ExperiencesCarousel experiences={experiences} />
//             )}
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
import { ExperiencesCarousel } from "./ExperiencesCarousel";
import { sortExperiences } from "../utils/SortExperiences";
import Loading from "./Loading";

/* -----------------------------------------
   TIME FORMATTER → "4pm", "5:30pm", "11am"
------------------------------------------ */
function formatTime(dtString: string | null | undefined) {
  if (!dtString) return "";

  const dt = DateTime.fromISO(dtString);
  if (!dt.isValid) return "";

  let formatted = dt.toFormat("h:mm a ").toLowerCase();
  formatted = formatted.replace(":00", "");
  return formatted;
}

export default function FullSchedule({
  mode = "full"
}: {
  mode?: "full" | "upcoming";
}) {
  const { schedule, loading } = useFestivalSchedule();

  if (loading) return <Loading label="Syncing schedule…" />;

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

        /* -----------------------------------------
           ANCHOR SLUG → #day-YYYYMMDD
        ------------------------------------------ */
        const daySlug = DateTime.fromISO(dateKey).toFormat("yyyyLLdd");

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
            teamAFlag: `${match.teamAFlag}`,
            teamBFlag: `${match.teamBFlag}`,
            teamACode: `${match.teamACode}`,
            teamBCode: `${match.teamBCode}`,
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
              iso: mus.musicDateTime,
              image: mus.image
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
        const experiences = sortExperiences(day.experiences || []);

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
          <div
            key={dateKey}
            className="full-schedule-day"
            id={`day-${daySlug}`}   // ⭐ ANCHOR ID HERE
          >
            <div className="fs-meta-wrapper">
              <div className="fs-date scs-music-date">{formatted}</div>
              <div className="fs-theme scs-vendor-name">{m.theme}</div>
            </div>

            <div className="fs-section">
              {rendered.map((block, i) => {
                if (block.type === "grid") {
                  return (
                    <div key={i} className="fs-match-grid">
                      {block.items.map((item: any, j: number) => (
                        <>
                          <div key={j} className="fs-match-card">
                            {item.type === "match" ? (
                              <>
                                <div className="fs-match-group">
                                  <div className="fs-match-team">
                                    <div className="fs-match-flag">
                                      <img src={item.teamAFlag} />
                                    </div>
                                    <span className="fs-match-teamCode fs-uppercase">
                                      {item.teamACode}
                                    </span>
                                  </div>
                                  <div className="fs-match-team">
                                    <div className="fs-match-flag">
                                      <img src={item.teamBFlag} />
                                    </div>
                                    <span className="fs-match-teamCode fs-uppercase">
                                      {item.teamBCode}
                                    </span>
                                  </div>
                                </div>
                                <div className="fs-match-time fs-label-global-sm fs-uppercase">
                                  {item.time}
                                </div>
                              </>
                            ) : null}

                            {item.type === "music" ? (
                              <>
                                <div className="fs-music-group">
                                  <div className="fs-music-artist">
                                    <div className="fs-music-image">
                                      <img src={item.image} />
                                    </div>
                                    <span className="fs-music-artist-name fs-uppercase">
                                      {item.label}
                                    </span>
                                  </div>
                                </div>
                                <div className="fs-match-time fs-label-global-sm fs-uppercase">
                                  {item.time}
                                </div>
                              </>
                            ) : null}
                          </div>

                          <span className="fs-match-divider">\</span>
                        </>
                      ))}
                    </div>
                  );
                }

                return (
                  <div key={i} className="fs-item fs-session-item">
                    <strong className="fs-label-global-sm">{block.label}</strong>
                    {block.type === "session" ? (
                      <div className="fs-label-global-sm fs-uppercase">
                        {block.time} – {block.end}
                      </div>
                    ) : (
                      <div className="fs-label-global-sm fs-uppercase">
                        {block.time}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {djSets.length > 0 && (
              <div className="dj-section">
                <div className="dj-section-title fs-label-global-sm">Sounds By</div>
                <div className="fs-dj-group">
                  {djSets.map((dj, i) => (
                    <div key={i} className="dj-item">
                      {dj.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {experiences.length > 0 && (
              <ExperiencesCarousel experiences={experiences} />
            )}
          </div>
        );
      })}
    </div>
  );
}
