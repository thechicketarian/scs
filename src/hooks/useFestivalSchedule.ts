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
  function normalizeRows<T extends { date?: string }>(rows: T[]): T[] {
    return rows.map(row => {
      const raw = row.date;
      if (!raw) return { ...row, date: null };

      const cleaned = cleanDateString(raw);

      // Experiences-only special case
      if (cleaned === "all") return { ...row, date: "all" };

      // Multi-date support
      const parts = cleaned.split(",").map(p => cleanDateString(p));

      const isoDates = parts
        .map(p => dateMap[p])
        .filter(Boolean);

      if (isoDates.length === 0) return { ...row, date: null };
      if (isoDates.length === 1) return { ...row, date: isoDates[0] };

      return { ...row, date: isoDates };
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
