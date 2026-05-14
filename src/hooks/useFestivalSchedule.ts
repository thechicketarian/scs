// import { buildSchedule } from "../utils/buildSchedule";
// import { useSheetData } from "./useSheetData";

// import {
//   MetaRow,
//   MatchRow,
//   MusicRow,
//   ExperienceRow,
//   FestivalDay,
//   SoccerCapSchedule,
//   UseFestivalScheduleResult
// } from "../types/types";

// export function useFestivalSchedule(): UseFestivalScheduleResult {
//   const datesMap = useSheetData("1187407494")
//   const meta = useSheetData("843872450");
//   const matches = useSheetData("179580476");
//   const music = useSheetData("2047900320");
//   const experiences = useSheetData("366396295");

//   const loading =
//     meta.loading ||
//     matches.loading ||
//     music.loading ||
//     experiences.loading;

//   const schedule = buildSchedule({
//     meta: meta.data as (MetaRow & { date: string | null })[],
//     matches: matches.data as (MatchRow & { date: string | null })[],
//     music: music.data as (MusicRow & { date: string | null })[],
//     experiences: experiences.data as (ExperienceRow & { date: string | null })[],
//   });
//   return { schedule, loading };

// }


import { buildSchedule } from "../utils/buildSchedule";
import { useSheetData } from "./useSheetData";

import {
  MetaRow,
  MatchRow,
  MusicRow,
  ExperienceRow,
  UseFestivalScheduleResult
} from "../types/types";
import { DateTime } from "luxon";

export function useFestivalSchedule(): UseFestivalScheduleResult {
  const datesSheet = useSheetData("1187407494");
  const meta = useSheetData("843872450");
  const matches = useSheetData("179580476");
  const music = useSheetData("2047900320");
  const experiences = useSheetData("366396295");

  const loading =
    datesSheet.loading ||
    meta.loading ||
    matches.loading ||
    music.loading ||
    experiences.loading;

  // ------------------------------------
  // CLEANING FUNCTION (shared)
  // ------------------------------------
  function cleanDateString(raw: any): string {
    return String(raw)
      .normalize("NFKC")
      .replace(/\u00A0/g, " ") // remove non-breaking spaces
      .replace(/\s+/g, " ")    // collapse multiple spaces
      .trim()
      .toLowerCase();
  }

  // ------------------------------------
  // BUILD SOURCE OF TRUTH: dateMap
  // ------------------------------------
  const dateMap: Record<string, string> = {};

  datesSheet.data.forEach((row: any) => {
    const raw = row.date;
    if (!raw) return;

    const cleaned = cleanDateString(raw);
    const dt = new Date(`${raw} 2026`);

    if (!isNaN(dt.getTime())) {
      dateMap[cleaned] = dt.toISOString().slice(0, 10);
    }
  });

  // ------------------------------------
  // NORMALIZE ALL SHEET ROWS HERE (root)
  // ------------------------------------
  // function normalizeRows<T extends { date?: string }>(rows: T[]): T[] {
  //   return rows.map(row => {
  //     const raw = row.date;
  //     if (!raw) return { ...row, date: null };

  //     const cleaned = cleanDateString(raw);

  //     // Experiences-only special case
  //     if (cleaned === "all") return { ...row, date: "all" };

  //     // Multi-date support
  //     const parts = cleaned.split(",").map(p => cleanDateString(p));

  //     const isoDates = parts
  //       .map(p => dateMap[p])
  //       .filter(Boolean);

  //     if (isoDates.length === 0) return { ...row, date: null };
  //     if (isoDates.length === 1) return { ...row, date: isoDates[0] };

  //     return { ...row, date: isoDates };
  //   });
  // }


function toIsoDateTime(dateIso: string | null, timeStr?: string | null) {
  if (!dateIso || !timeStr) return null;

  const clean = String(timeStr)
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  let dt = DateTime.fromFormat(
    `${dateIso} ${clean}`,
    "yyyy-MM-dd h:mm a",
    { zone: "America/Chicago" }
  );

  if (!dt.isValid) return null;

  // ⭐ UNIVERSAL RULE:
  // If the time is exactly midnight (00:00), treat it as END OF DAY.
// ⭐ If time is 12:00 AM or 1:00 AM → treat as end of day
if (dt.hour === 0 || dt.hour === 1) {
  dt = dt.plus({ days: 1 });
}

  return dt.toISO();
}

function normalizeRows<T extends { date?: string }>(rows: T[]): T[] {
  return rows.map(row => {
    const raw = row.date;
    if (!raw) return { ...row, date: null };

    const cleaned = cleanDateString(raw);

    if (cleaned === "all") return { ...row, date: "all" };

    const parts = cleaned.split(",").map(p => cleanDateString(p));
    const isoDates = parts.map(p => dateMap[p]).filter(Boolean);

    let finalDate: string | string[] | null = null;

    if (isoDates.length === 1) finalDate = isoDates[0];
    else if (isoDates.length > 1) finalDate = isoDates;
    else finalDate = null;

    // ⭐ Attach ISO datetime fields for matches, music, meta, experiences
    const dateIso = Array.isArray(finalDate) ? finalDate[0] : finalDate;

    return {
      ...row,
      date: finalDate,

      // MATCHES
      matchDateTime: "matchTime" in row
        ? toIsoDateTime(dateIso, (row as any).matchTime)
        : undefined,

      // MUSIC
      musicDateTime: "time" in row
        ? toIsoDateTime(dateIso, (row as any).time)
        : undefined,

      // META
      doorsOpenDateTime: "doorsOpen" in row
        ? toIsoDateTime(dateIso, (row as any).doorsOpen)
        : undefined,

      session1EndDateTime: "session1End" in row
        ? toIsoDateTime(dateIso, (row as any).session1End)
        : undefined,

      session2StartDateTime: "session2Start" in row
        ? toIsoDateTime(dateIso, (row as any).session2Start)
        : undefined,

      doorsCloseDateTime: "doorsClose" in row
        ? toIsoDateTime(dateIso, (row as any).doorsClose)
        : undefined
    };
  });
}

  // ------------------------------------
  // PASS NORMALIZED ROWS INTO buildSchedule
  // ------------------------------------
  const schedule = buildSchedule({
    meta: normalizeRows(meta.data as MetaRow[]),
    matches: normalizeRows(matches.data as MatchRow[]),
    music: normalizeRows(music.data as MusicRow[]),
    experiences: normalizeRows(experiences.data as ExperienceRow[])
  });

  return { schedule, loading };
}


