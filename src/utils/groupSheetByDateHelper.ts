import { SoccerCapSchedule } from "../types/types";
import { normalizeDateKey } from "./normalizeDate";

export function groupSheetByDate<T extends { date: string | null }>(
  rows: T[],
  key: keyof SoccerCapSchedule[string],
  schedule: SoccerCapSchedule
) {
  rows.forEach(row => {
    const { date, ...rest } = row;

    if (!date) return;

    // Support comma-separated dates: "June 17, June 18"
    const dateParts = date
      .split(",")
      .map(d => d.trim())
      .filter(Boolean);

    dateParts.forEach(dateStr => {
      const normalized = normalizeDateKey(dateStr);
      if (!normalized) return;

      if (!schedule[normalized]) {
        schedule[normalized] = {
          meta: null,
          matches: [],
          music: [],
          experiences: []
        };
      }

      if (key === "meta") {
        schedule[normalized].meta = rest as any;
      } else {
        (schedule[normalized][key] as any[]).push(rest);
      }
    });
  });
}
