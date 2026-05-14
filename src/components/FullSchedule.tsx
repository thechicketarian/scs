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
        const formatted = DateTime.fromISO(dateKey, { zone: "America/Chicago" })
          .toFormat("cccc LLLL d");

        /* -----------------------------------------
           Build unified timeline using ISO fields
        ------------------------------------------ */
        const timeline: {
          type: "meta" | "match" | "music";
          label: string;
          time: string;
          iso: string | null | undefined;
        }[] = [];

        /* -----------------------------------------
           META EVENTS
        ------------------------------------------ */
        if (day.meta) {
          const m = day.meta;

          if (m.doorsOpen) {
            timeline.push({
              type: "meta",
              label: "Session 1",
              time: m.doorsOpen,
              iso: m.doorsOpenDateTime
            });
          }

          if (m.session1End) {
            timeline.push({
              type: "meta",
              label: "Session 1 Ends",
              time: m.session1End,
              iso: m.session1EndDateTime
            });
          }

          if (m.session2Start) {
            timeline.push({
              type: "meta",
              label: "Session 2",
              time: m.session2Start,
              iso: m.session2StartDateTime
            });
          }

          if (m.doorsClose) {
            timeline.push({
              type: "meta",
              label: "Doors Close",
              time: m.doorsClose,
              iso: m.doorsCloseDateTime
            });
          }
        }

        /* -----------------------------------------
           MATCHES
        ------------------------------------------ */
        day.matches?.forEach((m) => {
          timeline.push({
            type: "match",
            label: `${m.teamA} vs ${m.teamB}`,
            time: m.matchTime,
            iso: m.matchDateTime
          });
        });

        /* -----------------------------------------
           MUSIC
        ------------------------------------------ */
        day.music?.forEach((m) => {
          timeline.push({
            type: "music",
            label: m.artist,
            time: m.time,
            iso: m.musicDateTime
          });
        });

        /* -----------------------------------------
           SORT BY ISO DATETIME
        ------------------------------------------ */

        console.log(timeline)
        timeline.sort((a, b) => {
          if (!a.iso || !b.iso) return 0;
          return (
            DateTime.fromISO(a.iso).toMillis() -
            DateTime.fromISO(b.iso).toMillis()
          );
        });

        return (
          <div key={dateKey} className="full-schedule-day">
            <h2 className="fs-date">{formatted}</h2>

            {/* META BLOCK */}
            {day.meta && (
              <div className="fs-meta">
                <h3>{day.meta.theme}</h3>
                <p>{day.meta.description}</p>
              </div>
            )}

            {/* UNIFIED TIMELINE */}
            <div className="fs-section">
              <h4>Schedule</h4>

              {timeline.map((item, i) => (
                <div key={i} className="fs-item">
                  <strong>
                    {item.type === "match" && "Match: "}
                    {item.type === "music" && "Concert: "}
                    {item.type === "meta" && ""}
                    {item.label}
                  </strong>
                  <div>{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
